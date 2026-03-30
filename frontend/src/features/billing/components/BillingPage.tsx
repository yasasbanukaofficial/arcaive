"use client";

import React from "react";
import { motion } from "framer-motion";
import CurrentSubscription from "@/features/billing/components/CurrentSubscription";
import SubscriptionCard from "@/features/billing/components/SubscriptionCard";
import BillingHistorySection from "@/features/billing/components/BillingHistorySection";
import PaymentMethods from "@/features/billing/components/PaymentMethods";
import {
  MemberSubscription,
  SubscriptionPlan,
  BillingHistory,
  PaymentMethod,
} from "@/@types/subscription";
import { useTheme } from "@/features/dashboard/components/ThemeContext";

interface BillingPageProps {
  memberSubscription: MemberSubscription;
  availablePlans: SubscriptionPlan[];
  billingHistory?: BillingHistory[];
  paymentMethods?: PaymentMethod[];
  onUpgrade?: (planId: string) => void;
  onManageSubscription?: () => void;
  onAddPaymentMethod?: () => void;
  onRemovePaymentMethod?: (id: string) => void;
  onSetDefaultPaymentMethod?: (id: string) => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function BillingPage({
  memberSubscription,
  availablePlans,
  billingHistory = [],
  paymentMethods = [],
  onUpgrade = () => {},
  onManageSubscription = () => {},
  onAddPaymentMethod = () => {},
  onRemovePaymentMethod = () => {},
  onSetDefaultPaymentMethod = () => {},
}: BillingPageProps) {
  const { isDark } = useTheme();
  const selectedPeriod: "month" | "year" = "month";

  const filteredPlans = availablePlans.filter(
    (plan) => plan.billingPeriod === "month",
  );

  const currentPlan =
    availablePlans.find(
      (plan) =>
        plan.id === memberSubscription.currentPlan &&
        plan.billingPeriod === "month",
    ) || filteredPlans.find((p) => p.id === "explorer");

  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="mb-6">
          <h1
            className="text-3xl font-semibold mb-2"
            style={{ color: "var(--d-text-primary)" }}
          >
            Billing & Subscription
          </h1>
          <p className="text-base" style={{ color: "var(--d-text-tertiary)" }}>
            Manage your subscription, billing, and payment methods
          </p>
        </motion.div>

        <div className="space-y-6">
          {currentPlan && (
            <CurrentSubscription
              subscription={memberSubscription}
              plan={currentPlan}
              onManage={onManageSubscription}
            />
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6"
            style={{
              backgroundColor: isDark ? "var(--d-surface)" : "#ffffff",
              border: "1px solid var(--d-border)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className="text-xl font-semibold mb-1"
                  style={{ color: "var(--d-text-primary)" }}
                >
                  Available Plans
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "var(--d-text-tertiary)" }}
                >
                  Choose the plan that fits your needs
                </p>
              </div>

              <div
                className="flex items-center gap-2 p-1 rounded-lg"
                style={{
                  backgroundColor: isDark
                    ? "var(--d-surface-hover)"
                    : "rgba(0,0,0,0.04)",
                }}
              >
                <span
                  className="px-4 py-2 rounded-md text-sm font-medium"
                  style={{
                    backgroundColor: "var(--d-accent)",
                    color: "#ffffff",
                  }}
                >
                  Monthly
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => (
                <SubscriptionCard
                  key={`${plan.id}-${plan.billingPeriod}`}
                  plan={plan}
                  isCurrentPlan={
                    plan.id === memberSubscription.currentPlan &&
                    plan.billingPeriod === selectedPeriod
                  }
                  currentPlanTier={memberSubscription.currentPlan}
                  onSelect={onUpgrade}
                />
              ))}
            </div>
          </motion.div>

          {paymentMethods.length > 0 && billingHistory.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PaymentMethods
                methods={paymentMethods}
                onAdd={onAddPaymentMethod}
                onRemove={onRemovePaymentMethod}
                onSetDefault={onSetDefaultPaymentMethod}
              />
              <BillingHistorySection history={billingHistory} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
