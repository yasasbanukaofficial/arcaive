"use client";
import { BarVisualizer, ControlBar, useVoiceAssistant } from "@livekit/components-react";

export default function VoiceAssistantUI() {
  const { state, audioTrack } = useVoiceAssistant();
  return (
    <div>
      <BarVisualizer state={state} track={audioTrack} barCount={5}/>
      <ControlBar />
    </div>
  );
}
