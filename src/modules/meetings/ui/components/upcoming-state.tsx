import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VideoIcon, BanIcon } from "lucide-react";

interface Props {
    meetingId: string;
    onCancelMeeting: () => void;
    isCancelling: boolean;
}

export const UpcomingState = ({ meetingId, onCancelMeeting, isCancelling }: Props) => {
    return (
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState 
            image="/upcoming.svg"
            title="Not Started yet"
            description="This meeting is scheduled for a future date and time. Please check back later."
            />

            <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
                <Button
                variant="secondary"
                className="w-full lg:w-auto"
                onClick={onCancelMeeting}
                disabled={isCancelling}
                >
                    <BanIcon />
                    Cancel Meeting
                </Button>

                <Button asChild className="w-full lg:w-auto" disabled={isCancelling}>
                <Link href={`/call/${meetingId}`}>
                    <VideoIcon />
                    Start Meeting
                </Link>
                </Button>
            </div>
        </div>
    )
}