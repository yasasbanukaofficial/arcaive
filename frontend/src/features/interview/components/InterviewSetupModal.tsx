"use client";

import React, { useEffect, useState } from "react";
import { Mic, Shield, RefreshCcw, Database, Play, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InterviewSetupModalProps {
  isOpen: boolean;
  onStart: () => void;
}

const SetupPoint = ({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) => (
  <div className="flex gap-4 p-4 rounded-2xl transition-all" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
    <div 
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" 
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
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-[2.5rem] border p-8 shadow-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--d-surface)",
              borderColor: "var(--d-border)",
            }}
          >
            {/* Background Decor */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[100px] rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 blur-[100px] rounded-full" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-8">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl"
                  style={{ 
                    background: "linear-gradient(135deg, var(--d-accent-blue) 0%, #6366f1 100%)",
                    boxShadow: "0 8px 30px rgba(59, 130, 246, 0.3)"
                  }}
                >
                  <Mic size={32} className="text-white" />
                </div>
                <h2
                  className="text-2xl font-bold tracking-tight mb-2"
                  style={{ color: "var(--d-text-primary)" }}
                >
                  Interview Setup
                </h2>
                <p
                  className="text-[14px] max-w-[300px]"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  Please review these important details before starting your mock interview.
                </p>
              </div>

              {/* Points Grid */}
              <div className="grid gap-3 mb-8">
                <SetupPoint 
                  icon={Mic}
                  title="Allow Microphone Access"
                  description="You need to enable your microphone so the interviewer can hear you clearly."
                  color="#3b82f6"
                />
                <SetupPoint 
                  icon={Shield}
                  title="Privacy Guaranteed"
                  description="Your interview is completely private. No audio or video is recorded during the session."
                  color="#10b981"
                />
                <SetupPoint 
                  icon={Database}
                  title="Temporary Data"
                  description="Any details you provide are temporary and will not be stored in our database."
                  color="#f59e0b"
                />
                <SetupPoint 
                  icon={RefreshCcw}
                  title="Refresh to Reset"
                  description="Refreshing the page clears all session data and automatically ends the call."
                  color="#ef4444"
                />
              </div>

              {/* Action */}
              <button
                onClick={onStart}
                className="group relative w-full py-4 rounded-2xl text-[15px] font-bold text-white transition-all overflow-hidden"
                style={{ backgroundColor: "var(--d-accent-blue)" }}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center gap-2">
                  <Play size={18} fill="currentColor" />
                  Start Mock Interview
                </div>
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-4">
                <Info size={12} className="text-muted-foreground" style={{ color: "var(--d-text-muted)" }} />
                <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--d-text-muted)" }}>
                  Secure Session Powered by Arcaive AI
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
