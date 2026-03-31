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
  disabled?: boolean;
}

const tierOrder = ["explorer", "strategist", "architect"];

export default function SubscriptionCard({
  plan,
  isCurrentPlan,
  currentPlanTier,
  onSelect,
  disabled,
}: SubscriptionCardProps) {
  const getButtonText = () => {
    if (isCurrentPlan) return "Current Plan";
    
    const currentTierIndex = currentPlanTier ? tierOrder.indexOf(currentPlanTier) : -1;
    const planTierIndex = tierOrder.indexOf(plan.id);
    
    if (currentTierIndex > 0 && planTierIndex < currentTierIndex) {
      return "Downgrade Plan";
    }
    
    return "Upgrade";
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative rounded-2xl p-5 sm:p-6 h-full flex flex-col"
      style={{
        backgroundColor: "var(--d-surface-hover)",
        border: plan.isPopular
          ? "2px solid var(--d-accent)"
          : "1px solid var(--d-border)",
      }}
    >
      {plan.isPopular && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold"
          style={{
            backgroundColor: "var(--d-accent)",
            color: "#ffffff",
          }}
        >
          Most Popular
        </div>
      )}

      <div className="mb-5 sm:mb-6">
        <h3
          className="text-lg sm:text-xl font-semibold mb-2"
          style={{ color: "var(--d-text-primary)" }}
        >
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "var(--d-text-primary)" }}
          >
            ${plan.price}
          </span>
          <span
            className="text-sm"
            style={{ color: "var(--d-text-muted)" }}
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
              style={{ color: "var(--d-accent)" }}
            />
            <span
              className="text-sm"
              style={{ color: "var(--d-text-secondary)" }}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Button
        variant={
          isCurrentPlan ? "secondary" : plan.isPopular ? "primary" : "white"
        }
        size="lg"
        onClick={() => onSelect(plan.id)}
        disabled={disabled || isCurrentPlan}
        className="w-full rounded-xl h-11 sm:h-12"
      >
        {getButtonText()}
      </Button>
    </motion.div>
  );
}
