'use client';

import { useAgent} from '@livekit/components-react';
import { AgentAudioVisualizerBar } from '@/components/agents-ui/agent-audio-visualizer-bar';

export function AgentVisualizer() {
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