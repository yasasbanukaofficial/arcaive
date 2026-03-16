"use client";

import { useSession } from "@livekit/components-react";
import { AgentSessionProvider } from "@/components/agents-ui/agent-session-provider";
import { AgentControlBar } from "@/components/agents-ui/agent-control-bar";
import AgentControls from "./AgentControls";
import { Info, Users, MessageSquare } from "lucide-react";

export default function AgentPanel() {
  const session = useSession();

  return (
    <AgentSessionProvider session={session}>
      <div className="flex flex-col h-full bg-[#0a0a0a] text-[#e3e3e3] overflow-hidden font-sans">
        <div className="flex items-center justify-between px-6 h-16 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-medium">Mock Interview Session</h1>
            <div className="h-4 w-[1px] bg-white/10" />
            <span className="text-xs text-white/50 tabular-nums">10:42 AM | arcaive-interview-room</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <Info className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex px-4 pb-24 gap-4 overflow-hidden relative">
          <AgentControls />
        </div>

        <div className="fixed bottom-0 left-0 right-0 h-24 flex items-center justify-between px-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-50">
          <div className="hidden lg:block w-64" />
          
          <div className="pointer-events-auto flex items-center gap-3">
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
          </div>

          <div className="hidden lg:flex items-center gap-1 pointer-events-auto w-64 justify-end">
            <button className="p-3 hover:bg-white/5 rounded-full text-white/70">
              <Users className="w-5 h-5" />
            </button>
            <button className="p-3 hover:bg-white/5 rounded-full text-white/70">
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </AgentSessionProvider>
  );
}


