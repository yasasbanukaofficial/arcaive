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
          className="absolute inset-0 bg-black/50 backdrop-blur-md"
          style={{ backgroundColor: "var(--d-bg-alpha, rgba(0,0,0,0.5))" }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border shadow-xl"
          style={{
            backgroundColor: "var(--d-surface)",
            borderColor: "var(--d-border)",
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg transition-colors z-10"
            style={{ color: "var(--d-text-muted)" }}
          >
            <X size={20} />
          </button>

          <div className="p-6 pt-8">
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
              >
                <ArrowUp
                  size={32}
                  style={{ color: "rgb(34, 197, 94)" }}
                  className="fill-green-200/20"
                />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-xl sm:text-2xl font-semibold mb-2"
                style={{ color: "var(--d-text-primary)" }}
              >
                Upgrade to {targetPlan}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm leading-relaxed"
                style={{ color: "var(--d-text-muted)" }}
              >
                You&apos;re about to upgrade from <span className="font-medium" style={{ color: "var(--d-text-secondary)" }}>{currentPlan}</span> to <span className="font-medium" style={{ color: "var(--d-text-secondary)" }}>{targetPlan}</span> at $<span className="font-semibold" style={{ color: "var(--d-accent)" }}>{newPrice}/month</span>.
              </motion.p>
            </div>

            {featuresGained.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-4 p-4 rounded-xl"
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.08)",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} style={{ color: "rgb(34, 197, 94)" }} />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "rgb(34, 197, 94)" }}
                  >
                    New Features Unlocked
                  </span>
                </div>
                <ul className="space-y-2">
                  {featuresGained.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-sm font-medium"
                      style={{ color: "var(--d-text-secondary)" }}
                    >
                      <span style={{ color: "rgb(34, 197, 94)" }}>
                        {feature.icon}
                      </span>
                      {feature.label}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl mb-6"
              style={{
                backgroundColor: "rgba(251, 191, 36, 0.08)",
                border: "1px solid rgba(251, 191, 36, 0.15)",
              }}
            >
              <div className="flex items-start gap-3">
                <Info
                  size={18}
                  style={{ color: "rgb(251, 191, 36)" }}
                  className="shrink-0 mt-0.5"
                />
                <p className="text-sm leading-relaxed font-semibold" style={{ color: "var(--d-text-secondary)" }}>
                  Your current subscription will be cancelled and the new plan will take effect immediately. Any unused credits from your current billing cycle will not be refunded.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-col gap-3"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={onConfirm}
                className="w-full h-12 text-sm font-medium rounded-xl"
                backgroundColor="rgba(34, 197, 94, 0.1)"
                textColor="rgba(34, 197, 94, 0.9)"
              >
                Yes, Upgrade My Plan
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={onClose}
                className="w-full h-12 text-sm font-medium rounded-xl"
              >
                Maybe Later
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-center mt-4"
              style={{ color: "var(--d-text-muted)" }}
            >
              Need help?{" "}
              <span
                className="underline cursor-pointer transition-colors"
                style={{ color: "var(--d-text-secondary)" }}
              >
                Contact support
              </span>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
