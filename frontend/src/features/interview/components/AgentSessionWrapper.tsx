"use client";

import { SessionProvider, useSession } from "@livekit/components-react";
import AgentPanel from "./AgentPanel";

export default function AgentSessionWrapper({ duration }: { duration: string }) {
  // useSession hook provides the session context that useAgent and useSessionMessages need
  const session = useSession();

  if (!session) {
    return null; // Or a loader, but InterviewPage already handles initial loading
  }

  return (
    <SessionProvider session={session}>
      <AgentPanel duration={duration} />
    </SessionProvider>
  );
}
