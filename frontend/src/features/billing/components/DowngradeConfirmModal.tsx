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
          className="relative w-full max-w-[560px] bg-white border border-[#E8E6DE] overflow-hidden"
          style={{ borderRadius: 0 }}
        >
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-[48px] py-6">
              <h2 className="font-sans text-[20px] font-bold text-black uppercase">
                Downgrade to {targetPlan}
              </h2>
              <button
                onClick={onClose}
                className="font-mono text-[18px] text-black hover:opacity-60 transition-opacity"
              >
                ×
              </button>
            </div>
            <div className="h-[1px] bg-[#E8E6DE] mx-[48px]" />

            <div className="p-[48px] space-y-8">
              <div className="space-y-4">
                <p className="font-sans text-[15px] leading-relaxed text-[#888880]">
                  You&apos;re about to downgrade from <span className="text-black font-bold uppercase">{currentPlan}</span> to <span className="text-black font-bold uppercase">{targetPlan}</span>.
                </p>
                <p className="font-sans text-[15px] leading-relaxed text-[#888880]">
                  We&apos;re sorry to see you go. Before you proceed, please review the changes.
                </p>
              </div>

              {featuresLost.length > 0 && (
                <div className="space-y-4">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#888880]">
                    FEATURES_YOU_WILL_MISS
                  </span>
                  <ul className="space-y-3">
                    {featuresLost.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 font-mono text-[12px] uppercase text-black"
                      >
                        <span className="text-[#888880]">→</span>
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
                  className="btn-ghost"
                  onClick={onClose}
                >
                  KEEP MY PLAN
                </button>
                <button
                  className="btn-ghost border-[#D83B2A] text-[#D83B2A] hover:bg-[#D83B2A] hover:text-white"
                  onClick={onConfirm}
                >
                  YES, DOWNGRADE
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
