"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SubscriptionPlan } from "@/@types/subscription";
import Button from "@/components/ui/Button";
import { useTheme } from "@/features/dashboard/components/ThemeContext";

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  onSelect: (planId: string) => void;
  disabled?: boolean;
}

export default function SubscriptionCard({
  plan,
  isCurrentPlan,
  onSelect,
  disabled,
}: SubscriptionCardProps) {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl p-6 h-full flex flex-col"
      style={{
        backgroundColor: plan.isPopular
          ? isDark
            ? "var(--d-surface)"
            : "#ffffff"
          : isDark
            ? "var(--d-surface)"
            : "#ffffff",
        border: plan.isPopular
          ? "2px solid var(--d-accent)"
          : "1px solid var(--d-border)",
      }}
    >
      {plan.isPopular && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
          style={{
            backgroundColor: "#ffffff",
            color: "#000000",
          }}
        >
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3
          className="text-xl font-semibold mb-2"
          style={{ color: "var(--d-text-primary)" }}
        >
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span
            className="text-4xl font-bold"
            style={{ color: "var(--d-text-primary)" }}
          >
            ${plan.price}
          </span>
          <span className="text-sm" style={{ color: "var(--d-text-tertiary)" }}>
            /{plan.billingPeriod}
          </span>
        </div>
      </div>

      <ul className="space-y-3 mb-6 flex-1">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check
              className="w-5 h-5 shrink-0 mt-0.5"
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
        className="w-full"
      >
        {isCurrentPlan ? "Current Plan" : "Upgrade"}
      </Button>
    </motion.div>
  );
}
