"use client";
import VoiceAssistantUI from "@/features/interview/components/VoiceAssistantUI";
import {
  BarVisualizer,
  ControlBar,
  LiveKitRoom,
  RoomAudioRenderer,
  RoomContext,
  useVoiceAssistant,
} from "@livekit/components-react";
import { Room } from "livekit-client";

export default function InterviewPage() {
  const room = new Room({});
  return (
    <div>
      <RoomContext.Provider value={room}>
        <LiveKitRoom token="" serverUrl="" connect={false}>
          <RoomAudioRenderer />
          <VoiceAssistantUI/>
        </LiveKitRoom>
      </RoomContext.Provider>
    </div>
  );
}
