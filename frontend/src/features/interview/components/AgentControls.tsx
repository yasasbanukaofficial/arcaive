import { AgentAudioVisualizerBar } from "@/components/agents-ui/agent-audio-visualizer-bar";
import { AgentChatIndicator } from "@/components/agents-ui/agent-chat-indicator";
import { AgentChatTranscript } from "@/components/agents-ui/agent-chat-transcript";
import {
  useAgent,
  useSessionMessages,
} from "@livekit/components-react";

export default function AgentControls() {
  const { state, microphoneTrack } = useAgent();
  const { messages } = useSessionMessages();
  return (
    <div>
      <AgentAudioVisualizerBar
        size="lg"
        color={undefined}
        barCount={5}
        state={state}
        audioTrack={microphoneTrack}
      />
      <AgentChatTranscript agentState={state} messages={messages} />
    </div>
  );
}
