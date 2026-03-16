"use client";

import { AgentControlBar } from "@/components/agents-ui/agent-control-bar";

export function UserControlsBar() {
  return (
    <AgentControlBar
      variant="livekit"
      isChatOpen={false}
      isConnected={true}
      controls={{
        leave: true,
        microphone: true,
        screenShare: true,
        camera: true,
        chat: true,
      }}
    />
  );
}
