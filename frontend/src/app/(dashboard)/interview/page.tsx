"use client";

import { useState } from "react";
import useLiveKitToken from "@/features/interview/hooks/useLiveKitToken";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import AgentPanel from "@/features/interview/components/AgentPanel";

export default function InterviewPage() {
  const { connection, loading, error } = useLiveKitToken();

  if (loading) return <p>Connecting...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full h-[calc(100vh-76px)] flex flex-col overflow-hidden">
      <LiveKitRoom
        serverUrl={connection!.url}
        token={connection!.token}
        connect={true}
        video={false}
        audio={true}
        onDisconnected={() => console.log("Disconnected")}
      >
        <RoomAudioRenderer />
        <AgentPanel />
      </LiveKitRoom>
    </div>
  );
}
