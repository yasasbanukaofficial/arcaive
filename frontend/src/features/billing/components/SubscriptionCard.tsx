"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SubscriptionPlan } from "@/@types/subscription";

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  currentPlanTier?: string;
  onSelect: (planId: string) => void;
  onDowngrade?: (planId: string) => void;
  disabled?: boolean;
}

const tierOrder = ["explorer", "strategist", "architect"];

export default function SubscriptionCard({
  plan,
  isCurrentPlan,
  currentPlanTier,
  onSelect,
  onDowngrade,
  disabled,
}: SubscriptionCardProps) {
  const isDowngrade = () => {
    if (isCurrentPlan || !currentPlanTier) return false;
    const currentTierIndex = tierOrder.indexOf(currentPlanTier);
    const planTierIndex = tierOrder.indexOf(plan.id);
    return currentTierIndex > 0 && planTierIndex < currentTierIndex;
  };

  const getButtonText = () => {
    if (isCurrentPlan) return "Active Level";
    if (isDowngrade()) return "Initialize Downgrade";
    return "Initialize Upgrade";
  };

  const handleClick = () => {
    if (isDowngrade() && onDowngrade) {
      onDowngrade(plan.id);
    } else {
      onSelect(plan.id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`relative p-8 h-full flex flex-col rounded-[32px] border transition-all duration-300 ${
        plan.isPopular 
          ? "border-[var(--accent-brand)] bg-[var(--d-surface)] shadow-2xl shadow-[var(--accent-brand)]/5" 
          : "border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--text-primary)]/20"
      }`}
    >
      {plan.isPopular && (
        <div className="absolute -top-3.5 left-8 px-4 py-1 rounded-full bg-[var(--accent-brand)] text-[var(--accent-brand-contrast)] text-[10px] font-bold uppercase tracking-widest shadow-lg">
          Peak Performance
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight mb-2 capitalize">
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-[44px] font-bold text-[var(--text-primary)] tracking-tighter leading-none">
            ${plan.price}
          </span>
          <span className="text-[14px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
            /{plan.billingPeriod}
          </span>
        </div>
      </div>

      <div className="h-[1px] w-full bg-[var(--glass-border)] mb-8" />

      <ul className="space-y-4 mb-10 flex-1">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[var(--accent-brand)]/10 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-[var(--accent-brand)]" />
            </div>
            <span className="text-[14px] font-medium text-[var(--text-secondary)] leading-snug">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleClick}
        disabled={disabled || isCurrentPlan}
        className={`w-full py-4 rounded-full text-[12px] font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed ${
          isCurrentPlan
            ? "bg-[var(--text-primary)]/[0.05] text-[var(--text-tertiary)] cursor-default border border-[var(--glass-border)]"
            : isDowngrade()
              ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"
              : "bg-[var(--text-primary)] text-[var(--bg-color)] hover:opacity-90 shadow-xl"
        }`}
      >
        {getButtonText()}
      </button>
    </motion.div>
  );
}
