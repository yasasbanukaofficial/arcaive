"use client";

import { useSession, useRoomContext, useLocalParticipant } from "@livekit/components-react";
import { AgentSessionProvider } from "@/components/agents-ui/agent-session-provider";
import AgentControls from "./AgentControls";
import { TokenSource } from "livekit-client";
import { useMemo, useState, type CSSProperties } from "react";

type AgentPanelProps = {
  serverUrl: string;
  participantToken: string;
};

export default function AgentPanel({ serverUrl, participantToken }: AgentPanelProps) {
  const room = useRoomContext();
  const tokenSource = useMemo(
    () =>
      TokenSource.literal({
        serverUrl,
        participantToken,
      }),
    [serverUrl, participantToken],
  );
  const session = useSession(tokenSource, { room });
  const { localParticipant } = useLocalParticipant();
  const [mode, setMode] = useState<"dark" | "light">("dark");

  const handleMicToggle = async () => {
    await localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled);
  };
  
  const handleEndCall = async () => {
    await room.disconnect();
  };

  return (
    <AgentSessionProvider session={session}>
      <div
        className="h-full w-full"
        style={
          {
            "--iv-bg": mode === "dark" ? "#0a0b0d" : "#f7f5f2",
            "--iv-surface": mode === "dark" ? "#111318" : "#f1efe9",
            "--iv-border": mode === "dark" ? "rgba(217, 210, 196, 0.16)" : "rgba(13, 13, 13, 0.16)",
            "--iv-text": mode === "dark" ? "#ece8df" : "#0d0d0d",
            "--iv-muted": mode === "dark" ? "#8f8a81" : "#6b665f",
            "--iv-accent": "#d9d2c4",
          } as CSSProperties
        }
      >
        <AgentControls
          isMicrophoneEnabled={localParticipant.isMicrophoneEnabled}
          onMicToggle={handleMicToggle}
          onEndCall={handleEndCall}
          mode={mode}
          onModeToggle={() => setMode((prev) => (prev === "dark" ? "light" : "dark"))}
        />
      </div>
    </AgentSessionProvider>
  );
}




