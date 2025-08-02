import OpenAI from "openai";
import {
    CallEndedEvent,
    MessageNewEvent,
    CallTranscriptionReadyEvent,
    CallSessionParticipantLeftEvent,
    CallRecordingReadyEvent,
    CallSessionStartedEvent,
} from "@stream-io/node-sdk";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

import { and, eq, not } from "drizzle-orm";
import { generateAvatarUri } from "@/lib/avatar";

import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { streamChat } from "@/lib/stream-chat";
import { inngest } from "@/inngest/client";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

function verifySignatureWithSDK(body: string, signature: string): boolean {
    return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
    const signature = req.headers.get("x-signature");
    const apikey = req.headers.get("x-api-key");

    if (!signature || !apikey) {
        return NextResponse.json(
            { error: "Missing signature or API key" },
            { status: 400 }
        );
    }

    const body = await req.text();

    if (!verifySignatureWithSDK(body, signature)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    let payload: unknown;
    try {
        payload = JSON.parse(body) as Record<string, unknown>;
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON payload" },
            { status: 400 }
        );
    }

    const eventType = (payload as Record<string, unknown>)?.type;

    if (eventType === "call.session_started") {
        const event = payload as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId;

        if (!meetingId) {
            return NextResponse.json(
                { error: "Missing meeting ID in call session started event" },
                { status: 400 }
            );
        }

        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(
                and(
                    eq(meetings.id, meetingId),
                    not(eq(meetings.status, "completed")),
                    not(eq(meetings.status, "active")),
                    not(eq(meetings.status, "cancelled")),
                    not(eq(meetings.status, "processing"))
                )
            );

        if (!existingMeeting) {
            return NextResponse.json(
                { error: "Meeting not found or already completed" },
                { status: 404 }
            );
        }

        await db
            .update(meetings)
            .set({ status: "active", startedAt: new Date() })
            .where(eq(meetings.id, existingMeeting.id));

        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId));

        if (!existingAgent) {
            return NextResponse.json(
                { error: "Agent not found for the meeting" },
                { status: 404 }
            );
        }

        const call = streamVideo.video.call("default", meetingId);
        const realtimeClient = await streamVideo.video.connectOpenAi({
            call,
            openAiApiKey: process.env.OPENAI_API_KEY!,
            agentUserId: existingAgent.id,
        });

        realtimeClient.updateSession({
            instructions: existingAgent.instructions,
        });
    } else if (eventType === "call.session_participant_left") {
        const event = payload as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1];

        if (!meetingId) {
            return NextResponse.json(
                { error: "Missing meeting ID in participant left event" },
                { status: 400 }
            );
        }

        const call = streamVideo.video.call("default", meetingId);
        await call.end();
    } else if (eventType === "call.session_ended") {
        const event = payload as CallEndedEvent;
        const meetingId = event.call.custom?.meetingId;

        if (!meetingId) {
            return NextResponse.json(
                { error: "Missing meeting ID in call ended event" },
                { status: 400 }
            );
        }

        await db
            .update(meetings)
            .set({ status: "processing", endedAt: new Date() })
            .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
    } else if (eventType === "call.transcription_ready") {
        const event = payload as CallTranscriptionReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        const [updatedMeeting] = await db
            .update(meetings)
            .set({
                transcriptUrl: event.call_transcription.url,
            })
            .where(eq(meetings.id, meetingId))
            .returning();

        if (!updatedMeeting) {
            return NextResponse.json(
                { error: "Meeting not found for transcription" },
                { status: 404 }
            );
        }
        await inngest.send({
            name: "meetings/processing",
            data: {
                meetingId: updatedMeeting.id,
                transcriptUrl: updatedMeeting.transcriptUrl,
            }
        })
    } else if (eventType === "call.recording_ready") {
        const event = payload as CallRecordingReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        await db
            .update(meetings)
            .set({
                recordingUrl: event.call_recording.url,
            })
            .where(eq(meetings.id, meetingId));
    } else if (eventType === "message.new") {
        const event = payload as MessageNewEvent;
        const userID = event.user?.id;
        const channelID = event.channel_id;
        const text = event.message?.text;

        if (!userID || !channelID || !text) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(and(eq(meetings.id, channelID), eq(meetings.status, "completed")));

        if (!existingMeeting) {
            return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
        }

        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId));

        if (!existingAgent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }

        if (userID !== existingAgent.id) {
            const instructions = `
              You are an AI assistant helping the user revisit a recently completed meeting.
              Below is a summary of the meeting, generated from the transcript:
              
              ${existingMeeting.summary}
              
              The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:
              
              ${existingAgent.instructions}
              
              The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
              Always base your responses on the meeting summary above.
              
              You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.
              
              If the summary does not contain enough information to answer a question, politely let the user know.
              
              Be concise, helpful, and focus on providing accurate information from the meeting and the ongoing conversation.
              `;

            const channel = streamChat.channel("messaging", channelID);
            await channel.watch();

            const previousMessages = channel.state.messages
                .slice(-5)
                .filter((msg) => msg.text && msg.text.trim() !== "")
                .map<ChatCompletionMessageParam>((message) => ({
                    role: message.user?.id === existingAgent.id ? "assistant" : "user",
                    content: message.text || "",
                }));

            const GPTResponse = await openaiClient.chat.completions.create({
                messages: [
                    { role: "system", content: instructions },
                    ...previousMessages,
                    { role: "user", content: text },
                ],
                model: "gpt-4o",
            });

            const GPTResponseText = GPTResponse.choices[0].message.content;

            if (!GPTResponseText) {
                return NextResponse.json(
                    { error: "No response from GPT" },
                    { status: 400 }
                );
            }

            const avatarUrl = generateAvatarUri({
                seed: existingAgent.name,
                variant: "botttsNeutral",
            });

            await streamChat.upsertUser({
                id: existingAgent.id,
                name: existingAgent.name,
                image: avatarUrl,
            });

            await channel.sendMessage({
                text: GPTResponseText,
                user: {
                    id: existingAgent.id,
                    name: existingAgent.name,
                    image: avatarUrl,
                },
            });
        }
        return NextResponse.json({ status: "ok" });
    }

    return NextResponse.json({ status: "ok" });
}