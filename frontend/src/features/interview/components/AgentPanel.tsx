"use client";

import { useSession } from "@livekit/components-react";
import { AgentSessionProvider } from "@/components/agents-ui/agent-session-provider";
import { AgentControlBar } from "@/components/agents-ui/agent-control-bar";
import AgentControls from "./AgentControls";
import { ChevronLeft, MoreVertical, Info, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMemberSettings } from "@/features/settings/hooks/useMember";
import { memberAPI } from "@/features/settings/api/memberAPI";

export default function AgentPanel() {
  const session = useSession();
  const router = useRouter();

  const { data: member, isLoading } = useMemberSettings();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    const setTimer = async () => {
      if (!member) return;
      const plan = await memberAPI.getSubscriptionPlan();
      let duration: number;
      duration =
        plan.toLowerCase() === "strategist"
          ? (duration = 300)
          : plan.toLowerCase() === "architect"
            ? (duration = 600)
            : (duration = 120);
      setSecondsLeft(duration);
    };
    setTimer();
  }, [member]);

  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <AgentSessionProvider session={session}>
      <div className="flex flex-col w-full h-full bg-[var(--d-bg)] text-[var(--d-text-primary)] transition-colors duration-300 font-sans p-4 sm:p-6 gap-6 overflow-hidden">
        <header className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[var(--d-surface)] border border-[var(--d-border)] hover:bg-[var(--d-surface-hover)] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                AI Technical Interview
              </h1>
              <p className="text-xs text-[var(--d-text-tertiary)] font-medium">
                Arcaive • Senior Frontend Role
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--d-surface)] border border-[var(--d-border)] min-w-[170px] justify-center">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {isLoading || secondsLeft === null ? (
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Loading...
                </span>
              ) : secondsLeft > 0 ? (
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Remaining Time: {formatTime(secondsLeft)}
                </span>
              ) : (
                <span className="text-xs font-semibold uppercase tracking-wider text-red-500">
                  Mock Interview Ended
                </span>
              )}
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[var(--d-surface)] border border-[var(--d-border)]">
              <LayoutGrid className="w-5 h-5 text-[var(--d-text-secondary)]" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[var(--d-surface)] border border-[var(--d-border)]">
              <MoreVertical className="w-5 h-5 text-[var(--d-text-secondary)]" />
            </button>
          </div>
        </header>

        <main className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
          <AgentControls />
        </main>

        <footer className="shrink-0 flex justify-center py-2">
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
