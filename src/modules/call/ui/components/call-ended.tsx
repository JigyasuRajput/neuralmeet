import Link from "next/link";

import { Button } from "@/components/ui/button";

export const CallEnded = () => {

  return (
    <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className="flex flex-1 items-center justify-center px-4 py-4">
        <div className="flex flex-col items-center justify-center gap-y-6 p-10 rounded-lg shadow-sm bg-background">
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg font-medium">You have ended the call</h6>
            <p className="text-sm">Summary will appear in a few minutes.</p>
          </div>
          <Button asChild>
            <Link href="/meetings">
              Back to meetings
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};