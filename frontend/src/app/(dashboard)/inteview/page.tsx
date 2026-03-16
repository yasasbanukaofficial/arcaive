"use client";

import { useState } from "react";
import AgentUI from "@/features/interview/components/AgentPanel";
import useLiveKitToken from "@/features/interview/hooks/useLiveKitToken";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";

export default function InterviewPage() {
  const [participantName] = useState(() => `user-${Date.now()}`);
  const [roomName] = useState(() => `room-${Date.now()}`);

  const { connection, loading, error } = useLiveKitToken(roomName, participantName);

  if (loading) return <p>Connecting...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full h-full">
      <LiveKitRoom
        serverUrl={connection!.url}
        token={connection!.token}
        connect={true}
        video={false}
        audio={true}
        onDisconnected={() => console.log("Disconnected")}
      >
        <RoomAudioRenderer />
        <AgentUI />
      </LiveKitRoom>
    </div>
  );
}