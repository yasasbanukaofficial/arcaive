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
    if (isCurrentPlan) return "Current plan";
    if (isDowngrade()) return "Downgrade";
    return "Upgrade";
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
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`relative p-6 h-full flex flex-col rounded-[24px] border transition-colors ${
        plan.isPopular 
          ? "border-[#e6efdf] bg-[#161616]" 
          : "border-[#2a2a2a] bg-[#161616]"
      }`}
    >
      {plan.isPopular && (
        <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-[#e6efdf] text-[#111] text-[11px] font-semibold">
          Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-[16px] font-semibold text-white/90 mb-2">
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">
            ${plan.price}
          </span>
          <span className="text-[13px] text-white/40">
            /{plan.billingPeriod}
          </span>
        </div>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2.5">
            <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#4a7c59]" />
            <span className="text-[13px] text-white/50">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleClick}
        disabled={disabled || isCurrentPlan}
        className={`w-full py-3 rounded-full text-[13px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
          isCurrentPlan
            ? "bg-[#2a2a2a] text-white/40 cursor-default"
            : isDowngrade()
              ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
              : "bg-[#e6efdf] text-[#111] hover:opacity-90"
        }`}
      >
        {getButtonText()}
      </button>
    </motion.div>
  );
}
