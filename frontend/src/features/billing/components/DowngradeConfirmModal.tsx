"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Sparkles, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";

interface FeatureLoss {
  label: string;
  icon: React.ReactNode;
}

interface DowngradeConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentPlan: string;
  targetPlan: string;
  featuresLost: FeatureLoss[];
}

export default function DowngradeConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  currentPlan,
  targetPlan,
  featuresLost,
}: DowngradeConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
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
                Downgrade to {targetPlan}
              </h2>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center font-mono text-[18px] text-[var(--text-primary)] border border-[var(--glass-border)] hover:bg-[var(--glass-border)] transition-all rounded-[var(--radius)]"
                  >
                    ×
                  </button>
            </div>
            <div className="h-[1px] bg-[#E8E6DE] mx-[48px]" />

            <div className="p-[48px] space-y-8">
              <div className="space-y-4">
                <p className="font-sans text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  You&apos;re about to downgrade from <span className="text-[var(--text-primary)] font-bold uppercase">{currentPlan}</span> to <span className="text-[var(--text-primary)] font-bold uppercase">{targetPlan}</span>.
                </p>
                <p className="font-sans text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  We&apos;re sorry to see you go. Before you proceed, please review the changes.
                </p>
              </div>

              {featuresLost.length > 0 && (
                <div className="space-y-4">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
                    Features you will miss
                  </span>
                  <ul className="space-y-3">
                    {featuresLost.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 font-mono text-[12px] uppercase text-[var(--text-primary)]"
                      >
                        <span className="text-[var(--text-secondary)]">→</span>
                        {feature.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 border border-[#D83B2A] bg-[#D83B2A]/5">
                <p className="font-mono text-[11px] leading-relaxed text-[#D83B2A]">
                  [!] Proceeding will cancel your current billing cycle immediately. This action is permanent. Your new plan takes effect right away.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="h-[1px] bg-[#E8E6DE] mx-[48px]" />
              <div className="px-[48px] py-8 flex justify-end gap-4">
                <button
                  className="px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  onClick={onClose}
                >
                  Keep my plan
                </button>
                <button
                  className="px-6 py-3 text-[12px] font-bold uppercase tracking-widest bg-black text-[#D83B2A] border border-[#D83B2A] hover:bg-[#D83B2A] hover:text-white transition-all rounded-[var(--radius)]"
                  onClick={onConfirm}
                >
                  Yes, Downgrade
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
