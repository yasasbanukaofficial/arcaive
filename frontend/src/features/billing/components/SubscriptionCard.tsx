"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SubscriptionPlan } from "@/@types/subscription";
import Button from "@/components/ui/Button";

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
    if (isCurrentPlan) return "Current Plan";
    if (isDowngrade()) return "Downgrade Plan";
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative p-5 sm:p-6 h-full flex flex-col oryzo-card-glow shadow-2xl shadow-black/40"
      style={{
        backgroundColor: "var(--glass-bg)",
        border: plan.isPopular
          ? "2px solid var(--text-primary)"
          : "1px solid var(--glass-border)",
      }}
    >
      {plan.isPopular && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 text-xs sm:text-sm font-black tracking-wide"
          style={{
            backgroundColor: "var(--d-text-primary)",
            color: "var(--d-bg)",
            clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
          }}
        >
          MOST POPULAR
        </div>
      )}

      <div className="mb-5 sm:mb-6">
        <h3
          className="text-lg sm:text-xl font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            ${plan.price}
          </span>
          <span
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            /{plan.billingPeriod}
          </span>
        </div>
      </div>

      <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-1">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 sm:gap-3">
            <Check
              className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5"
              style={{ color: "var(--text-primary)" }}
            />
            <span
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Button
        variant="white"
        size="lg"
        onClick={handleClick}
        disabled={disabled || isCurrentPlan}
        className="w-full h-11 sm:h-12 font-bold"
        style={isCurrentPlan 
          ? undefined 
          : isDowngrade() 
            ? { backgroundColor: "#ef4444", color: "#ffffff", border: "1px solid #ef4444" }
            : { backgroundColor: "var(--d-text-primary)", color: "var(--d-bg)" }
        }
      >
        {getButtonText()}
      </Button>
    </motion.div>
  );
}
