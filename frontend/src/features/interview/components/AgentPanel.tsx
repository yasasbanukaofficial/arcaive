"use client";

import { useSession } from "@livekit/components-react";
import { AgentSessionProvider } from "@/components/agents-ui/agent-session-provider";
import { AgentControlBar } from "@/components/agents-ui/agent-control-bar";
import AgentControls from "./AgentControls";
import { ChevronLeft, MoreVertical, Info, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AgentPanel() {
  const session = useSession();
  const router = useRouter();

  return (
    <AgentSessionProvider session={session}>
      <div className="flex flex-col h-full bg-[var(--d-bg)] text-[var(--d-text-primary)] transition-colors duration-300 font-sans p-4 sm:p-6 gap-6">
        
        <header className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[var(--d-surface)] border border-[var(--d-border)] hover:bg-[var(--d-surface-hover)] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">AI Technical Interview</h1>
              <p className="text-xs text-[var(--d-text-tertiary)] font-medium">Arcaive • Senior Frontend Role</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--d-surface)] border border-[var(--d-border)]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider">Recording in Progress</span>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[var(--d-surface)] border border-[var(--d-border)]">
              <LayoutGrid className="w-5 h-5 text-[var(--d-text-secondary)]" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[var(--d-surface)] border border-[var(--d-border)]">
              <MoreVertical className="w-5 h-5 text-[var(--d-text-secondary)]" />
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
          <AgentControls />
        </main>

        <footer className="shrink-0 flex justify-center pb-2">
          <div className="bg-[var(--d-surface)] border border-[var(--d-border)] p-2 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
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
        </footer>
      </div>
    </AgentSessionProvider>
  );
}



