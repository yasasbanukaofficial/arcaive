"use client";

import React, { useEffect, useState } from "react";
import { Mic, Shield, RefreshCcw, Database, Play, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InterviewSetupModalProps {
  isOpen: boolean;
  onStart: () => void;
}

const SetupPoint = ({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) => (
  <div className="flex gap-4 p-4  " style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
    <div 
      className="w-10 h-10  flex items-center justify-center shrink-0" 
      style={{ backgroundColor: `${color}15`, color: color }}
    >
      <Icon size={20} />
    </div>
    <div className="space-y-1">
      <h3 className="text-sm font-semibold" style={{ color: "var(--d-text-primary)" }}>{title}</h3>
      <p className="text-[13px] leading-relaxed" style={{ color: "var(--d-text-muted)" }}>{description}</p>
    </div>
  </div>
);

export default function InterviewSetupModal({ isOpen, onStart }: InterviewSetupModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-[560px] bg-[var(--d-surface)] border border-[var(--d-border)] overflow-hidden shadow-2xl rounded-[24px]"
        >
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-8 sm:px-12 py-8 bg-[var(--d-surface)]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--d-text-muted)] mb-1 block">Protocol Initialization</span>
                <h2 className="font-sans text-[20px] sm:text-[24px] font-bold text-[var(--d-text-primary)] uppercase tracking-tight">
                  Interview Setup
                </h2>
              </div>
              <button
                onClick={onStart}
                className="w-10 h-10 flex items-center justify-center text-[var(--d-text-primary)] border border-[var(--d-border)] hover:bg-[var(--d-surface-hover)] transition-all rounded-[var(--radius)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-[1px] bg-[var(--d-border)]" />

            <div className="px-8 sm:px-12 py-10 space-y-10">
              <div className="space-y-4">
                <p className="font-sans text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  Verify your environment and permissions before proceeding to the session.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { title: "Profile Integration", desc: "The agent references the data you provided during signup to personalize your interview." },
                  { title: "Privacy Shield", desc: "Your conversation is not recorded or used for illegal purposes; your data remains secure." },
                  { title: "Standard Protocol", desc: "Enable microphone for high-fidelity communication analysis." },
                  { title: "Network Link", desc: "Refreshing the node will terminate the active session." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-start group">
                    <span className="font-mono text-[11px] text-[var(--text-secondary)] opacity-30 mt-1 shrink-0">0{idx + 1}</span>
                    <div className="space-y-1">
                       <h3 className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-primary)] font-black group-hover:translate-x-1 transition-transform">{item.title}</h3>
                       <p className="font-sans text-[13px] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 sm:p-12 pt-0">
               <button
                  className="w-full py-5 text-[12px] font-black uppercase tracking-[0.3em] transition-all hover:opacity-90 active:scale-95 shadow-xl rounded-[24px]"
                  style={{ backgroundColor: "var(--d-sage)", color: "var(--accent-brand-contrast)" }}
                  onClick={onStart}
                >
                  INITIALIZE SESSION
                </button>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--d-text-muted)] text-center mt-6 opacity-40">
                  ARCAIVE OS | TECHNICAL CORE v2
                </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
