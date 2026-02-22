"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { UserSubscription, SubscriptionPlan } from "@/@types/subscription";
import { useTheme } from "@/features/dashboard/components/ThemeContext";
import Button from "@/components/ui/Button";

interface CurrentSubscriptionProps {
  subscription: UserSubscription;
  plan: SubscriptionPlan;
  onManage: () => void;
}

export default function CurrentSubscription({
  subscription,
  plan,
  onManage,
}: CurrentSubscriptionProps) {
  const { isDark } = useTheme();

  const usagePercentage = plan.maxAgents
    ? (subscription.usage.agentsUsed / plan.maxAgents) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6"
      style={{
        backgroundColor: isDark ? "var(--d-surface)" : "#ffffff",
        border: "1px solid var(--d-border)",
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2
            className="text-xl font-semibold mb-1"
            style={{ color: "var(--d-text-primary)" }}
          >
            Current Subscription
          </h2>
          <p className="text-sm" style={{ color: "var(--d-text-tertiary)" }}>
            Manage your subscription and billing
          </p>
        </div>
        <Button variant="secondary" size="md" onClick={onManage}>
          Manage
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          className="p-4 rounded-xl"
          style={{
            backgroundColor: isDark
              ? "var(--d-surface-hover)"
              : "rgba(0,0,0,0.02)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp
              className="w-4 h-4"
              style={{ color: "var(--d-accent)" }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: "var(--d-text-secondary)" }}
            >
              Plan
            </span>
          </div>
          <p
            className="text-lg font-semibold"
            style={{ color: "var(--d-text-primary)" }}
          >
            {plan.name}
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--d-text-tertiary)" }}
          >
            ${plan.price}/{subscription.billingPeriod}
          </p>
        </div>

        <div
          className="p-4 rounded-xl"
          style={{
            backgroundColor: isDark
              ? "var(--d-surface-hover)"
              : "rgba(0,0,0,0.02)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar
              className="w-4 h-4"
              style={{ color: "var(--d-accent)" }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: "var(--d-text-secondary)" }}
            >
              Renewal Date
            </span>
          </div>
          <p
            className="text-lg font-semibold"
            style={{ color: "var(--d-text-primary)" }}
          >
            {new Date(subscription.renewalDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div
          className="p-4 rounded-xl"
          style={{
            backgroundColor: isDark
              ? "var(--d-surface-hover)"
              : "rgba(0,0,0,0.02)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle
              className="w-4 h-4"
              style={{ color: "var(--d-accent)" }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: "var(--d-text-secondary)" }}
            >
              Status
            </span>
          </div>
          <p
            className="text-lg font-semibold"
            style={{
              color: subscription.isActive
                ? "var(--d-success)"
                : "var(--d-error)",
            }}
          >
            {subscription.isActive ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      {plan.maxAgents && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-sm font-medium"
              style={{ color: "var(--d-text-secondary)" }}
            >
              Agent Usage
            </span>
            <span
              className="text-sm"
              style={{ color: "var(--d-text-tertiary)" }}
            >
              {subscription.usage.agentsUsed} / {plan.maxAgents}
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--d-border)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                backgroundColor:
                  usagePercentage > 80 ? "var(--d-error)" : "var(--d-accent)",
              }}
            />
          </div>
        </div>
      )}

      {subscription.cancelAtPeriodEnd && (
        <div
          className="mt-4 p-3 rounded-lg flex items-start gap-2"
          style={{
            backgroundColor: "var(--d-error)",
            opacity: 0.1,
          }}
        >
          <AlertCircle
            className="w-4 h-4 shrink-0 mt-0.5"
            style={{ color: "var(--d-error)" }}
          />
          <p className="text-sm" style={{ color: "var(--d-error)" }}>
            Your subscription will be cancelled at the end of the billing period
          </p>
        </div>
      )}
    </motion.div>
  );
}
