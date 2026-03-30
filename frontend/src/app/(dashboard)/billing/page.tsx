"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { dashboardStagger, fadeUp } from "@/features/dashboard/components/animations";
import Button from "@/components/ui/Button";
import CurrentSubscription from "@/features/billing/components/CurrentSubscription";
import SubscriptionCard from "@/features/billing/components/SubscriptionCard";
import { useSubscription } from "@/features/billing/hooks/useSubscription";
import {
  MOCK_MEMBER_SUBSCRIPTION,
  MOCK_PLANS,
} from "@/features/billing/constants/mockData";

export default function BillingPageWrapper() {
  const router = useRouter();
  const { data: memberSubscription, isLoading, error } = useSubscription();

  const tierOrder = ["explorer", "strategist", "architect"];

  const handleUpgrade = (planId: string) => {
    const currentTierIndex = tierOrder.indexOf(subscription.currentPlan);
    const selectedTierIndex = tierOrder.indexOf(planId);

    if (selectedTierIndex < currentTierIndex) {
      router.push("/subscription?action=cancel");
    } else {
      router.push(`/subscription/checkout?plan=${planId}&billing=month`);
    }
  };

  const handleManageSubscription = () => {
    router.push("/subscription");
  };

  const subscription = isLoading || error ? MOCK_MEMBER_SUBSCRIPTION : (memberSubscription ?? MOCK_MEMBER_SUBSCRIPTION);
  const filteredPlans = MOCK_PLANS.filter((plan) => plan.billingPeriod === "month");
  const selectedPeriod: "month" | "year" = "month";

  const currentPlan =
    MOCK_PLANS.find(
      (plan) =>
        plan.id === subscription.currentPlan &&
        plan.billingPeriod === "month",
    ) || filteredPlans.find((p) => p.id === "explorer");

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={dashboardStagger(0.04, 0.02)}
      className="max-w-[1200px] mx-auto space-y-6 sm:space-y-8 pb-20 px-3 sm:px-6"
    >
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="text-center sm:text-left">
          <h1
            className="text-2xl sm:text-3xl lg:text-[36px] font-semibold"
            style={{ color: "var(--d-text-primary)" }}
          >
            Billing & Subscription
          </h1>
          <p
            className="text-sm sm:text-base mt-1"
            style={{ color: "var(--d-text-muted)" }}
          >
            Manage your subscription, billing, and payment methods
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={handleManageSubscription}
            icon={<Settings size={16} />}
            className="rounded-xl h-10 sm:h-12 px-4 sm:px-6 border font-medium text-sm sm:text-base"
          >
            Settings
          </Button>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <CurrentSubscription
          subscription={subscription}
          plan={currentPlan!}
          onManage={handleManageSubscription}
        />
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10"
        style={{
          backgroundColor: "var(--d-surface)",
          border: "1px solid var(--d-border)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="text-center sm:text-left">
            <h2
              className="text-lg sm:text-xl lg:text-2xl font-semibold"
              style={{ color: "var(--d-text-primary)" }}
            >
              Available Plans
            </h2>
            <p
              className="text-sm sm:text-base mt-1"
              style={{ color: "var(--d-text-muted)" }}
            >
              Choose the plan that fits your needs
            </p>
          </div>

          <div
            className="flex items-center gap-2 p-1 rounded-lg"
            style={{
              backgroundColor: "var(--d-surface-hover)",
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {filteredPlans.map((plan) => (
            <SubscriptionCard
              key={`${plan.id}-${plan.billingPeriod}`}
              plan={plan}
              isCurrentPlan={
                plan.id === subscription.currentPlan &&
                plan.billingPeriod === selectedPeriod
              }
              currentPlanTier={subscription.currentPlan}
              onSelect={handleUpgrade}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
