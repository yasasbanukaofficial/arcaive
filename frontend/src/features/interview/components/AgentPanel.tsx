"use client";

import { useAgent, useSessionMessages, BarVisualizer } from "@livekit/components-react";
import { Mic, MicOff, MessageSquare, X, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InterviewEndModal from "./InterviewEndModal";
import { motion, AnimatePresence } from "framer-motion";
import { useInputControls } from "@/hooks/agents-ui/use-agent-control-bar";
import TranscriptionStream from "./TranscriptionStream";
import { AgentChatTranscript } from "@/components/agents-ui/agent-chat-transcript";
import InterviewLoadingScreen from "./InterviewLoadingScreen";

export default function AgentPanel({ duration }: { duration: string }) {
  const router = useRouter();

  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // LiveKit Hooks
  const { state, microphoneTrack } = useAgent();
  const { messages } = useSessionMessages();
  const {
    microphoneToggle,
    microphoneTrack: localTrack
  } = useInputControls();

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
    if (secs === null) return "00:00";
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  const isAgentLoading = !state || state === 'connecting' || state === 'initializing';

  return (
    <div className="flex flex-col w-full h-full bg-[var(--bg-color)] items-center justify-between relative overflow-hidden text-[var(--text-primary)] font-sans selection:bg-[var(--text-primary)] selection:text-[var(--bg-color)]">
      
      <AnimatePresence>
        {isAgentLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-30"
          >
            <InterviewLoadingScreen message="Initializing Agent..." />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Subtle Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--text-primary)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--text-primary)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <div className="w-full p-8 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
            <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)] opacity-60 mb-1">Session Active</span>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--text-primary)] animate-pulse shadow-[0_0_10px_var(--text-primary)]" />
                    <span className="text-sm font-medium opacity-90">Arcaive Intelligence</span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="px-4 py-2 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl flex items-center gap-3">
                <span className="text-sm font-mono font-bold">
                    {secondsLeft === null ? "00:00" : formatTime(secondsLeft)}
                </span>
            </div>
            <button className="p-2.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-color)] transition-all">
                <Settings className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl z-10 px-6">
        <div className="relative w-[480px] h-48 flex items-center justify-center">
            {/* Official LiveKit Visualizer in Circle Layout */}
            <BarVisualizer 
                trackRef={microphoneTrack} 
                barCount={4} 
                className="w-full h-full flex text-black dark:text-white items-center justify-center gap-6"
            >
                <div className="w-20 min-w-[5rem] min-h-[5rem] rounded-full rounded-3xl bg-current transition-all duration-300 opacity-100" />
            </BarVisualizer>
            {/* Center Glow */}
            <div className="absolute inset-0 rounded-full bg-[var(--text-primary)] opacity-[0.02] blur-2xl pointer-events-none" />
        </div>
        
        <div className="mt-16 w-full flex justify-center">
            <TranscriptionStream />
        </div>
      </div>

      {/* Grouped Bottom Controls */}
      <div className="w-full flex flex-col items-center pb-12 z-20">
        <div className="p-2 px-6 rounded-[2.5rem] bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-3xl shadow-2xl flex items-center gap-4">
            {/* End Call */}
            <button 
                onClick={() => setShowEndModal(true)}
                className="w-14 h-14 rounded-full bg-transparent hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-500 transition-all flex items-center justify-center group"
            >
                <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>

            {/* Mic Toggle */}
            <button 
              onClick={() => microphoneToggle.toggle()}
              disabled={microphoneToggle.pending}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all z-10 ${microphoneToggle.enabled ? 'bg-transparent text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-color)]' : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'}`}
            >
              {microphoneToggle.enabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            {/* User Visualizer (Always Visible) */}
            <div className="h-14 flex items-center justify-center overflow-hidden border-l border-[var(--glass-border)] ml-3 pl-4 pr-2 min-w-[140px]">
                <BarVisualizer 
                    trackRef={localTrack} 
                    barCount={5} 
                    className="w-full h-full flex text-black dark:text-white items-center justify-center gap-1 p-0"
                >
                    <div className="w-2 min-w-[8px] min-h-[8px] rounded-full bg-current transition-all duration-300" />
                </BarVisualizer>
            </div>
        </div>
      </div>

      {/* Side Transcript Overlay */}
      <AnimatePresence>
        {showChat && (
            <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute top-0 right-0 w-full sm:w-[450px] h-full bg-[var(--bg-color)] border-l border-[var(--glass-border)] z-[100] shadow-2xl flex flex-col"
            >
                <div className="p-8 border-b border-[var(--glass-border)] flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold">Full Transcript</h3>
                        <p className="text-xs opacity-40 uppercase tracking-widest mt-1">Live History</p>
                    </div>
                    <button onClick={() => setShowChat(false)} className="p-2.5 hover:bg-[var(--glass-bg)] border border-transparent hover:border-[var(--glass-border)] rounded-xl transition-all group">
                        <X className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                    </button>
                </div>
                <div className="flex-1 overflow-hidden p-4">
                    <AgentChatTranscript agentState={state} messages={messages} className="h-full" />
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <InterviewEndModal isOpen={showEndModal} />
    </div>
  );
}

