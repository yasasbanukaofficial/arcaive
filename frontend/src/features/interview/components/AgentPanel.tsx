"use client";

import { AgentControlBar } from "@/components/agents-ui/agent-control-bar";
import AgentControls from "./AgentControls";
import { ChevronLeft, MoreVertical, LayoutGrid, Info, Clock, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InterviewEndModal from "./InterviewEndModal";
import { motion, AnimatePresence } from "framer-motion";

export default function AgentPanel({ duration }: { duration: string }) {
  const router = useRouter();

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
    if (secondsLeft === null || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <div className="flex flex-col w-full h-full bg-[var(--bg-color)] text-[var(--text-primary)] font-sans p-4 sm:p-8 gap-6 sm:gap-8 overflow-hidden relative">
        {/* Aesthetic Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--text-primary)] opacity-[0.02] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[var(--text-primary)] opacity-[0.03] rounded-full blur-[80px] pointer-events-none" />

        <header className="relative z-10 flex items-center justify-between shrink-0 border-b border-[var(--glass-border)] pb-6 sm:pb-8">
          <div className="flex items-center gap-6 sm:gap-8">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 flex items-center justify-center bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--text-primary)] transition-all duration-300"
              style={{ borderRadius: "var(--radius)" }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--text-secondary)]">Live Protocol</span>
              </div>
              <h1 className="font-sans text-[24px] sm:text-[28px] font-bold text-[var(--text-primary)] uppercase tracking-tight leading-none">
                AI Technical Interview
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-1">System Entropy</span>
              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] min-w-[200px] justify-between" style={{ borderRadius: "var(--radius)" }}>
                 <div className={`w-2 h-2 rounded-full ${secondsLeft && secondsLeft > 0 ? 'bg-[var(--text-primary)]' : 'bg-red-500'} animate-pulse`} />
                 <span className="font-mono text-[12px] font-black uppercase tracking-widest">
                   {secondsLeft === null ? "Initializing..." : secondsLeft > 0 ? formatTime(secondsLeft) : "Node Terminated"}
                 </span>
                 <ShieldCheck className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="w-12 h-12 flex items-center justify-center border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] transition-colors" style={{ borderRadius: "var(--radius)" }}>
                <LayoutGrid className="w-5 h-5 text-[var(--text-primary)]" />
              </button>
              <button className="w-12 h-12 flex items-center justify-center border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] transition-colors" style={{ borderRadius: "var(--radius)" }}>
                <MoreVertical className="w-5 h-5 text-[var(--text-primary)]" />
              </button>
            </div>
          </div>
        </header>

        <main className="relative z-10 flex-1 min-h-0 flex flex-col lg:flex-row gap-8">
          <AgentControls />
        </main>

        <footer className="relative z-10 shrink-0 flex items-center justify-between pt-6 border-t border-[var(--glass-border)]">
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[var(--glass-bg)] px-4 py-2 border border-[var(--glass-border)]" style={{ borderRadius: "var(--radius)" }}>
               <div className="w-2 h-2 rounded-full bg-green-500" />
               <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Network Stable</span>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] p-2.5 shadow-xl" style={{ borderRadius: "var(--radius)" }}>
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
          </div>

          <div className="hidden lg:flex items-center gap-4 group cursor-help">
            <Info className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Session: AD-912A</span>
          </div>
        </footer>
        <InterviewEndModal isOpen={showEndModal} />
      </div>
  );
}
