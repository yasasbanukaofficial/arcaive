import { useAgent, useSession } from "@livekit/components-react";
import { AgentSessionProvider } from "@/components/agents-ui/agent-session-provider";
import { AgentControlBar } from "@/components/agents-ui/agent-control-bar";
import { AgentAudioVisualizerBar } from "@/components/agents-ui/agent-audio-visualizer-bar";
import AgentControls from "./AgentControls";

export default function AgentPanel() {
  const session = useSession();
  return (
    <AgentSessionProvider session={session}>
      <AgentControls />
      <AgentControlBar
        variant="livekit"
        isChatOpen={false}
        isConnected={true}
        controls={{
          leave: true,
          microphone: true,
          screenShare: true,
          camera: true,
          chat: true,
        }}
      />
    </AgentSessionProvider>
  );
}
