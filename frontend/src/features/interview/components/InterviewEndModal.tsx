"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Clock, ArrowRight, Sparkles, TrendingUp, Brain, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface InterviewEndModalProps {
  isOpen: boolean;
}

const ScoreBar = ({ icon: Icon, title, score, color, delay }: { icon: any, title: string, score: number, color: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="group relative"
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8  flex items-center justify-center bg-[var(--glass-bg)]/5 border border-white/10 group-hover:border-white/20 transition-colors">
          <Icon size={16} className="text-white/70" />
        </div>
        <span className="text-[13px] font-medium tracking-tight text-white/90">{title}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-bold text-white">{score}</span>
        <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">/ 10</span>
      </div>
    </div>
    <div className="h-1.5 w-full bg-[var(--glass-bg)]/5  overflow-hidden border border-white/5">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${score * 10}%` }}
        transition={{ delay: delay + 0.2, duration: 1, ease: "easeOut" }}
        className="h-full  relative"
        style={{ 
          background: `linear-gradient(90deg, ${color}cc, ${color})`,
          boxShadow: `0 0 12px ${color}40`
        }}
      >
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            ease: "linear",
          }}
          className="absolute inset-0 bg-[var(--glass-bg)]/10" 
        />
      </motion.div>
    </div>
  </motion.div>
);

export default function InterviewEndModal({ isOpen }: InterviewEndModalProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;
    
    if (timeLeft <= 0) {
      router.push("/overview");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, router]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-[600px] bg-[var(--bg-color)] border border-[var(--glass-border)] overflow-hidden shadow-2xl"
          style={{ borderRadius: "var(--radius)" }}
        >
          <div className="flex flex-col">
            <div className="flex flex-col items-center justify-center px-8 py-12 bg-[var(--glass-bg)] text-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
               <motion.div 
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 className="w-20 h-20 bg-[var(--text-primary)] text-[var(--bg-color)] flex items-center justify-center rounded-full mb-6 shadow-xl"
               >
                 <CheckCircle2 className="w-10 h-10" />
               </motion.div>
               <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--text-secondary)] mb-2">Protocol Finalized</span>
               <h2 className="font-sans text-[28px] sm:text-[32px] font-bold text-[var(--text-primary)] uppercase tracking-tighter">
                 Session Complete
               </h2>
            </div>
            
            <div className="h-[1px] bg-[var(--glass-border)]" />

            <div className="p-10 sm:p-14 space-y-10">
              <p className="font-sans text-[15px] leading-relaxed text-[var(--text-secondary)] text-center max-w-sm mx-auto">
                Performance metrics have been synthesized by the Arcaive Neural Engine.
              </p>

              <div className="space-y-8">
                {[
                  { label: "Communication Clarity", score: 8.5, icon: MessageSquare },
                  { label: "Technical Proficiency", score: 7.8, icon: Brain },
                  { label: "Strategic Thinking", score: 9.2, icon: TrendingUp },
                ].map((stat, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3">
                        <stat.icon className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-bold">{stat.label}</span>
                      </div>
                      <span className="font-mono text-[12px] font-black">{stat.score} <span className="opacity-20">/ 10</span></span>
                    </div>
                    <div className="h-[2px] w-full bg-[var(--glass-border)] overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${stat.score * 10}%` }}
                         transition={{ delay: 0.5 + (i * 0.2), duration: 1 }}
                         className="h-full bg-[var(--text-primary)]" 
                       />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 pt-6 opacity-40">
                <Clock className="w-3 h-3" />
                <p className="font-mono text-[9px] uppercase tracking-widest">
                  Auto-routing in {timeLeft}s
                </p>
              </div>
            </div>

            <div className="p-10 sm:p-14 pt-0">
               <button
                  className="w-full py-5 text-[12px] font-black uppercase tracking-[0.3em] transition-all bg-[var(--text-primary)] text-[var(--bg-color)] hover:opacity-90 active:scale-95 shadow-xl"
                  style={{ borderRadius: "var(--radius)" }}
                  onClick={() => router.push("/overview")}
                >
                  CONSOLIDATE & EXIT
                </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
