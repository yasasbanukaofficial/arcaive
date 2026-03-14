"use client";
import AgentUI from "@/features/interview/components/AgentUI";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";

export default function InterviewPage() {
  const severUrl = process.env.NEXT_PUBLIC_LIVEKIT_SERVER_URL;
  const token = process.env.NEXT_PUBLIC_LIVEKIT_TOKEN;
  return (
    <div className="w-full h-full">
      <LiveKitRoom
        serverUrl={severUrl}
        token={token}
        connect={true}
        video={false}
        audio={true}
        onDisconnected={() => {
          // Handle disconnection logic here
        }}
      >
        <RoomAudioRenderer />
        <AgentUI />
      </LiveKitRoom>
    </div>
  );
}
