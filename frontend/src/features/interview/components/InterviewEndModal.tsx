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
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
          <Icon size={16} className="text-white/70" />
        </div>
        <span className="text-[13px] font-medium tracking-tight text-white/90">{title}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-bold text-white">{score}</span>
        <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">/ 10</span>
      </div>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${score * 10}%` }}
        transition={{ delay: delay + 0.2, duration: 1, ease: "easeOut" }}
        className="h-full rounded-full relative"
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
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent" 
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
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-lg rounded-[2.5rem] border shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
          style={{ 
            backgroundColor: "var(--d-bg)",
            borderColor: "var(--d-border)"
          }}
        >
          {/* Subtle Background Gradients */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" 
               style={{ background: "var(--d-glow-blue)" }} />
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]"
               style={{ background: "var(--d-glow-purple)" }} />
          
          <div className="relative z-10 p-10">
            {/* Header Section */}
            <div className="flex flex-col items-center text-center mb-10">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 relative"
                style={{ 
                  background: "linear-gradient(135deg, var(--d-text-primary) 0%, var(--d-text-secondary) 100%)",
                  boxShadow: "0 10px 40px rgba(255, 255, 255, 0.1)"
                }}
              >
                <div className="absolute inset-0 rounded-3xl animate-pulse blur-md" style={{ background: "var(--d-surface-active)" }} />
                <CheckCircle2 size={40} className="relative z-10" style={{ color: "var(--d-bg)" }} />
              </motion.div>
              
              <h2 className="text-3xl font-bold tracking-tight mb-3" style={{ color: "var(--d-text-primary)" }}>
                Session Complete
              </h2>
              <p className="text-[15px] leading-relaxed max-w-[320px]" style={{ color: "var(--d-text-tertiary)" }}>
                Your performance metrics have been analyzed by Arcaive AI. Excellent work today.
              </p>
            </div>

            {/* Metrics Section */}
            <div className="rounded-3xl p-6 mb-8 backdrop-blur-md border"
                 style={{ backgroundColor: "var(--d-surface)", borderColor: "var(--d-border-subtle)" }}>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={14} className="text-blue-400" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--d-text-muted)" }}>Performance Overview</span>
              </div>
              
              <div className="space-y-6">
                <ScoreBar 
                  icon={MessageSquare} 
                  title="Communication Clarity" 
                  score={8.5} 
                  color="var(--d-text-primary)" 
                  delay={0.1} 
                />
                <ScoreBar 
                  icon={Brain} 
                  title="Technical Proficiency" 
                  score={7.8} 
                  color="var(--d-text-primary)" 
                  delay={0.2} 
                />
                <ScoreBar 
                  icon={TrendingUp} 
                  title="Strategic Thinking" 
                  score={9.2} 
                  color="var(--d-text-primary)" 
                  delay={0.3} 
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="space-y-4">
              <button
                onClick={() => router.push("/overview")}
                className="group relative w-full py-4.5 rounded-2xl text-[15px] font-bold transition-all overflow-hidden flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: "var(--d-text-primary)", color: "var(--d-bg)" }}
              >
                Return to Dashboard
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center justify-center gap-3 py-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
                     style={{ backgroundColor: "var(--d-surface)", borderColor: "var(--d-border)" }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <p className="text-[12px] font-medium" style={{ color: "var(--d-text-muted)" }}>
                    Auto-redirecting in <span className="font-bold" style={{ color: "var(--d-text-primary)" }}>{timeLeft}s</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
