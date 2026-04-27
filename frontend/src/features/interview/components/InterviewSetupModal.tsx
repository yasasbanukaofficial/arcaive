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
          className="absolute inset-0 bg-black/70"
        />

        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          className="relative w-full max-w-[560px] bg-[var(--glass-bg)] border border-[var(--glass-border)] overflow-hidden"
          style={{ borderRadius: "var(--radius)" }}
        >
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-[48px] py-6">
              <h2 className="font-sans text-[20px] font-bold text-[var(--text-primary)] uppercase">
                Interview Setup
              </h2>
                  <button
                    onClick={onStart}
                    className="w-8 h-8 flex items-center justify-center font-mono text-[18px] text-[var(--text-primary)] border border-[var(--glass-border)] hover:bg-[var(--glass-border)] transition-all rounded-[var(--radius)]"
                  >
                    ×
                  </button>
            </div>
            <div className="h-[1px] bg-[#E8E6DE] mx-[48px]" />

            <div className="p-[48px] space-y-8">
              <div className="space-y-2">
                <p className="font-sans text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  Please review these important details before starting your mock interview.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="flex gap-4">
                  <span className="font-mono text-[14px] text-[var(--text-primary)]">→</span>
                  <div className="space-y-1">
                    <h3 className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-primary)]">Allow Microphone Access</h3>
                    <p className="font-sans text-[13px] text-[var(--text-secondary)]">Enable your microphone so the interviewer can hear you clearly.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="font-mono text-[14px] text-[var(--text-primary)]">→</span>
                  <div className="space-y-1">
                    <h3 className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-primary)]">Privacy Guaranteed</h3>
                    <p className="font-sans text-[13px] text-[var(--text-secondary)]">Your interview is private. No audio or video is recorded.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="font-mono text-[14px] text-[var(--text-primary)]">→</span>
                  <div className="space-y-1">
                    <h3 className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-primary)]">Temporary Data</h3>
                    <p className="font-sans text-[13px] text-[var(--text-secondary)]">Details provided are temporary and not stored in our database.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="font-mono text-[14px] text-[var(--text-primary)]">→</span>
                  <div className="space-y-1">
                    <h3 className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-primary)]">Refresh to Reset</h3>
                    <p className="font-sans text-[13px] text-[var(--text-secondary)]">Refreshing clears session data and ends the call.</p>
                  </div>
                </div>
              </div>

              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)] text-center pt-4">
                Secure session powered by Arcaive AI
              </p>
            </div>

            <div className="mt-4">
              <div className="h-[1px] bg-[#E8E6DE] mx-[48px]" />
              <div className="px-[48px] py-8 flex justify-end gap-4">
                <button
                  className="w-full py-4 text-[13px] font-bold uppercase tracking-widest transition-transform active:scale-95"
                  style={{ 
                    backgroundColor: "#000000", 
                    color: "#ffffff",
                    borderRadius: "var(--radius)"
                  }}
                  onClick={onStart}
                >
                  START MOCK INTERVIEW
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
