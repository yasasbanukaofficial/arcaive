import { useSession } from "@livekit/components-react";
import { AgentSessionProvider } from "@/components/agents-ui/agent-session-provider";
import { AgentVisualizer } from "./AgentVisualizer";
import { UserControlsBar } from "./UserControlsBar";

export default function AgentUI() {
    const session = useSession();
    return (
      <AgentSessionProvider session={session}>
        <AgentVisualizer />
        <UserControlsBar />
      </AgentSessionProvider>
    )
}