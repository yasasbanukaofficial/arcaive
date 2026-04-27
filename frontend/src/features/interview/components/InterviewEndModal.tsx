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
          className="absolute inset-0 bg-black/70"
        />

        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          className="relative w-full max-w-[560px] bg-[var(--glass-bg)] border border-[var(--glass-border)] overflow-hidden"
          style={{ borderRadius: 0 }}
        >
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-[48px] py-6">
              <h2 className="font-sans text-[20px] font-bold text-[var(--text-primary)] uppercase">
                Session Complete
              </h2>
              <button
                className="font-mono text-[18px] text-[var(--text-primary)] hover:opacity-60 transition-opacity"
              >
                ×
              </button>
            </div>
            <div className="h-[1px] bg-[#E8E6DE] mx-[48px]" />

            <div className="p-[48px] space-y-8">
              <div className="space-y-2 text-center">
                <p className="font-sans text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  Your performance metrics have been analyzed by Arcaive AI. Excellent work today.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">Communication Clarity</span>
                    <span className="font-mono text-[13px] font-bold text-[var(--text-primary)]">8.5 / 10</span>
                  </div>
                  <div className="h-[2px] w-full bg-[#E8E6DE]">
                    <div className="h-full bg-black" style={{ width: "85%" }} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">Technical Proficiency</span>
                    <span className="font-mono text-[13px] font-bold text-[var(--text-primary)]">7.8 / 10</span>
                  </div>
                  <div className="h-[2px] w-full bg-[#E8E6DE]">
                    <div className="h-full bg-black" style={{ width: "78%" }} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">Strategic Thinking</span>
                    <span className="font-mono text-[13px] font-bold text-[var(--text-primary)]">9.2 / 10</span>
                  </div>
                  <div className="h-[2px] w-full bg-[#E8E6DE]">
                    <div className="h-full bg-black" style={{ width: "92%" }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-4">
                <span className="w-1.5 h-1.5 bg-black" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">
                  Auto-redirecting in {timeLeft}s
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="h-[1px] bg-[#E8E6DE] mx-[48px]" />
              <div className="px-[48px] py-8 flex justify-end gap-4">
                <button
                  className="btn-primary w-full"
                  onClick={() => router.push("/overview")}
                >
                  RETURN TO DASHBOARD
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
