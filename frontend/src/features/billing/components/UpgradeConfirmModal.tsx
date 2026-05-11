"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

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
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-[500px] bg-[var(--bg-color)] border border-[var(--glass-border)] rounded-[24px] overflow-hidden shadow-[var(--shadow-premium)]"
        >
          <div className="p-8 space-y-6">
            <div className="w-12 h-12 rounded-full bg-[var(--accent-brand)] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[var(--accent-brand-contrast)]" />
            </div>

            <div>
              <h2 className="font-sans text-[18px] font-semibold text-[var(--text-primary)] mb-2">
                Upgrade to {targetPlan}
              </h2>
              <p className="font-sans text-[14px] text-[var(--text-secondary)] leading-relaxed">
                You&apos;re upgrading from <span className="text-[var(--text-primary)] font-medium">{currentPlan}</span> to <span className="text-[var(--text-primary)] font-medium">{targetPlan}</span>.
              </p>
              <p className="font-mono text-[15px] text-[var(--text-primary)] font-semibold mt-2">
                ${newPrice}/month
              </p>
            </div>

            {featuresGained.length > 0 && (
              <div className="space-y-3">
                <p className="font-sans text-[12px] text-[var(--text-tertiary)] uppercase tracking-wider">Unlocked features</p>
                <ul className="space-y-2.5">
                  {featuresGained.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2.5 font-sans text-[13px] text-[var(--text-secondary)]"
                    >
                      <span className="text-[var(--accent-brand)] text-[12px]">✓</span>
                      {feature.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-4 rounded-[16px] bg-amber-500/5 border border-amber-500/10">
              <p className="font-sans text-[13px] leading-relaxed text-amber-600/80">
                Your current subscription will be cancelled and the new plan takes effect immediately.
              </p>
            </div>
          </div>

          <div className="border-t border-[var(--glass-border)] px-8 py-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/[0.03] transition-colors font-sans text-[13px] font-medium"
            >
              Maybe later
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 rounded-full bg-[var(--accent-brand)] text-[var(--accent-brand-contrast)] hover:opacity-90 transition-opacity font-sans text-[13px] font-semibold"
            >
              Yes, upgrade now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
