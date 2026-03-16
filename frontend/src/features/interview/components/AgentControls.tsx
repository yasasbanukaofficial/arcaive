import { AgentAudioVisualizerBar } from "@/components/agents-ui/agent-audio-visualizer-bar";
import { useAgent } from "@livekit/components-react";

export default function AgentControls() {
  const { microphoneTrack, state } = useAgent();
  return (
    <AgentAudioVisualizerBar
      size="lg"
      color={undefined}
      barCount={5}
      state={state}
      audioTrack={microphoneTrack}
    />
  );
}
