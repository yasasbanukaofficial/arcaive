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
import InterviewEndModal from "./InterviewEndModal";

export default function AgentPanel({ duration }: { duration: string }) {
  const session = useSession();
  const router = useRouter();

  // const { data: member, isLoading } = useMemberSettings();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);

  useEffect(() => {
    setSecondsLeft(Number(duration));
  }, [duration]);

  useEffect(() => {
    if (secondsLeft === 0) {
      setShowEndModal(true);
    }
  }, [secondsLeft]);

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
      <div className="flex flex-col w-full h-full bg-white text-black font-sans p-6 gap-8 overflow-hidden">
        <header className="flex items-center justify-between shrink-0 border-b border-[#E8E6DE] pb-6">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center bg-[#F5F4EF] border border-[#E8E6DE] hover:border-black transition-colors"
              style={{ borderRadius: 0 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-sans text-[20px] font-bold text-black uppercase tracking-tight">
                AI Technical Interview
              </h1>
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#888880] mt-0.5">
                Arcaive • Mock Interview Session
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-black border border-black min-w-[200px] justify-center" style={{ borderRadius: 0 }}>
              <div className={`w-2 h-2 ${secondsLeft && secondsLeft > 0 ? 'bg-[#D4F461]' : 'bg-red-500'}`} style={{ borderRadius: 0 }} />
              {secondsLeft === null ? (
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white">
                  CONNECTING...
                </span>
              ) : secondsLeft > 0 ? (
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white">
                  REMAINING: {formatTime(secondsLeft)}
                </span>
              ) : (
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-red-500">
                  SESSION_ENDED
                </span>
              )}
            </div>
            <button className="w-10 h-10 flex items-center justify-center border border-[#E8E6DE] hover:border-black transition-colors" style={{ borderRadius: 0 }}>
              <LayoutGrid className="w-5 h-5 text-black" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-[#E8E6DE] hover:border-black transition-colors" style={{ borderRadius: 0 }}>
              <MoreVertical className="w-5 h-5 text-black" />
            </button>
          </div>
        </header>

        <main className="flex-1 min-h-0 flex flex-col lg:flex-row gap-8">
          <AgentControls />
        </main>

        <footer className="shrink-0 flex justify-center py-4 border-t border-[#E8E6DE]">
          <div className="bg-[#F5F4EF] border border-black p-3" style={{ borderRadius: 0 }}>
            <AgentControlBar
              variant="livekit"
              isChatOpen={false}
              isConnected={true}
              onDisconnect={() => setShowEndModal(true)}
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
        <InterviewEndModal isOpen={showEndModal} />
      </div>
    </AgentSessionProvider>
  );
}
