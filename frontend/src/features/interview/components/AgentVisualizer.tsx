import { BarVisualizer, useVoiceAssistant } from "@livekit/components-react";

export default function AgentVisualizer() {
  const { state, audioTrack } = useVoiceAssistant();
  console.log("Agent State:", state, "Track:", audioTrack);
  return (
      <BarVisualizer
        data-role="agent"
        state={state}
        trackRef={audioTrack}
        barCount={5}
        className="lk-voice-visualizer w-full h-full"
      />
  );
}
