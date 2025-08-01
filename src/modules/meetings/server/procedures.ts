import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import {
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    MIN_PAGE_SIZE,
} from "@/constants";
import { TRPCError } from "@trpc/server";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";
import { MeetingStatus } from "../types";
import { streamVideo } from "@/lib/stream-video";
import { generateAvatarUri } from "@/lib/avatar";

export const meetingsRouter = createTRPCRouter({
    generateToken: protectedProcedure.mutation(async ({ ctx }) => {
        await streamVideo.upsertUsers([
            {
                id: ctx.auth.user.id,
                name: ctx.auth.user.name,
                role: "admin",
                image:
                    ctx.auth.user.image ??
                    generateAvatarUri({
                        seed: ctx.auth.user.id,
                        variant: "initials",
                    }),
            },
        ]);

        const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour in seconds
        const issuedAt = Math.floor(Date.now() / 1000) - 60; // 1 minute ago in seconds

        const token = streamVideo.generateUserToken({
            user_id: ctx.auth.user.id,
            exp: expirationTime,
            iat: issuedAt,
        });

        return token;
    }),
    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const [removedMeeting] = await db
                .delete(meetings)
                .where(
                    and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
                )
                .returning();

            if (!removedMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found",
                });
            }

            return removedMeeting;
        }),
    // Procedure for updating Meetings
    // Updates a Meeting by ID
    // Returns the updated Meeting
    update: protectedProcedure
        .input(meetingsUpdateSchema)
        .mutation(async ({ input, ctx }) => {
            const [updatedMeeting] = await db
                .update(meetings)
                .set(input)
                .where(
                    and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
                )
                .returning();

            if (!updatedMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found",
                });
            }

            return updatedMeeting;
        }),

    create: protectedProcedure
        .input(meetingsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const [createdMeeting] = await db
                .insert(meetings)
                .values({
                    ...input,
                    userId: ctx.auth.user.id,
                })
                .returning();

            const call = streamVideo.video.call("default", createdMeeting.id);
            await call.create({
                data: {
                    created_by_id: ctx.auth.user.id,
                    custom: {
                        meetingId: createdMeeting.id,
                        meetingName: createdMeeting.name,
                    },
                    settings_override: {
                        transcription: {
                            language: "en",
                            mode: "auto-on",
                            closed_caption_mode: "auto-on",
                        },
                        recording: {
                            mode: "auto-on",
                            quality: "1080p",
                        },
                    },
                },
            });

            const [existingAgent] = await db
                .select()
                .from(agents)
                .where(eq(agents.id, createdMeeting.agentId));

            if (!existingAgent) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Agent not found",
                });
            }

            await streamVideo.upsertUsers([
                {
                    id: existingAgent.id,
                    name: existingAgent.name,
                    role: "user",
                    image: generateAvatarUri({
                        seed: existingAgent.name,
                        variant: "botttsNeutral",
                    }),
                },
            ]);

            return createdMeeting;
        }),

    // Procedures for getting Meetings
    // Retrieves a single Meeting by ID
    // Returns the Meeting along with a static participantCount of 5
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const [existingMeeting] = await db
                .select({
                    ...getTableColumns(meetings),
                    agent: agents,
                    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
                        "duration"
                    ),
                })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
                );

            if (!existingMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meetings not found",
                });
            }

            return existingMeeting;
        }),

    // Procedure for getting a list of Meetings
    // Supports pagination and search functionality
    getMany: protectedProcedure
        .input(
            z.object({
                page: z.number().default(DEFAULT_PAGE),
                pageSize: z
                    .number()
                    .min(MIN_PAGE_SIZE)
                    .max(MAX_PAGE_SIZE)
                    .default(DEFAULT_PAGE_SIZE),
                search: z.string().nullish(),
                agentId: z.string().nullish(),
                status: z
                    .enum([
                        MeetingStatus.Upcoming,
                        MeetingStatus.Active,
                        MeetingStatus.Completed,
                        MeetingStatus.Processing,
                        MeetingStatus.Cancelled,
                    ])
                    .nullish(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { search, page, pageSize, status, agentId } = input;
            const data = await db
                .select({
                    ...getTableColumns(meetings),
                    agent: agents,
                    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
                        "duration"
                    ),
                })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        status ? eq(meetings.status, status) : undefined,
                        agentId ? eq(meetings.agentId, agentId) : undefined
                    )
                )
                .orderBy(desc(meetings.createdAt), desc(meetings.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            const [total] = await db
                .select({ count: count() })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        status ? eq(meetings.status, status) : undefined,
                        agentId ? eq(meetings.agentId, agentId) : undefined
                    )
                );

            const totalPages = Math.ceil(total.count / pageSize);

            return {
                items: data,
                total: total.count,
                totalPages,
            };
        }),
});