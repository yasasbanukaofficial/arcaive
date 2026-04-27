"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Rocket, Sparkles, ArrowUp, Info } from "lucide-react";
import Button from "@/components/ui/Button";

interface FeatureGain {
  label: string;
  icon: React.ReactNode;
}

interface UpgradeConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentPlan: string;
  targetPlan: string;
  featuresGained: FeatureGain[];
  newPrice: string;
}

export default function UpgradeConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  currentPlan,
  targetPlan,
  featuresGained,
  newPrice,
}: UpgradeConfirmModalProps) {
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
          style={{ borderRadius: 0 }}
        >
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-[48px] py-6">
              <h2 className="font-sans text-[20px] font-bold text-[var(--text-primary)] uppercase">
                Upgrade to {targetPlan}
              </h2>
              <button
                onClick={onClose}
                className="font-mono text-[18px] text-[var(--text-primary)] hover:opacity-60 transition-opacity"
              >
                ×
              </button>
            </div>
            <div className="h-[1px] bg-[#E8E6DE] mx-[48px]" />

            <div className="p-[48px] space-y-8">
              <div className="space-y-4">
                <p className="font-sans text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  You&apos;re about to upgrade from <span className="text-[var(--text-primary)] font-bold uppercase">{currentPlan}</span> to <span className="text-[var(--text-primary)] font-bold uppercase">{targetPlan}</span>.
                </p>
                <p className="font-mono text-[18px] text-[var(--text-primary)] font-bold">
                  NEW_PRICE: ${newPrice}/MONTH
                </p>
              </div>

              {featuresGained.length > 0 && (
                <div className="space-y-4">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
                    UNLOCKED_FEATURES
                  </span>
                  <ul className="space-y-3">
                    {featuresGained.map((feature, index) => (
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

              <div className="p-4 border border-[var(--glass-border)] bg-[var(--glass-border)]">
                <p className="font-mono text-[11px] leading-relaxed text-[var(--text-primary)]">
                  [!] Your current subscription will be cancelled and the new plan will take effect immediately. No refunds for unused credits.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="h-[1px] bg-[#E8E6DE] mx-[48px]" />
              <div className="px-[48px] py-8 flex justify-end gap-4">
                <button
                  className="btn-ghost"
                  onClick={onClose}
                >
                  MAYBE LATER
                </button>
                <button
                  className="btn-primary"
                  onClick={onConfirm}
                >
                  YES, UPGRADE NOW
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
