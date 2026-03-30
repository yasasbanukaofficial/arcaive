"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bot, FileText, Zap } from "lucide-react";
import { dashboardStagger, fadeUp } from "@/features/dashboard/components/animations";
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
      <motion.div variants={fadeUp} className="text-center sm:text-left">
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
      </motion.div>

      <motion.div variants={fadeUp}>
        <CurrentSubscription
          subscription={subscription}
          plan={currentPlan!}
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

      <motion.div
        variants={fadeUp}
        className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10"
        style={{
          backgroundColor: "var(--d-surface)",
          border: "1px solid var(--d-border)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "var(--d-surface-hover)" }}
          >
            <Zap size={20} style={{ color: "var(--d-accent)" }} />
          </div>
          <div>
            <h2
              className="text-lg sm:text-xl lg:text-2xl font-semibold"
              style={{ color: "var(--d-text-primary)" }}
            >
              Usage This Month
            </h2>
            <p
              className="text-sm sm:text-base"
              style={{ color: "var(--d-text-muted)" }}
            >
              Track your resource consumption
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div
            className="p-4 sm:p-5 rounded-xl sm:rounded-2xl"
            style={{ backgroundColor: "var(--d-surface-hover)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "var(--d-accent-subtle)" }}
                >
                  <Bot size={16} style={{ color: "var(--d-accent)" }} />
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--d-text-secondary)" }}
                  >
                    Active Agents
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--d-text-muted)" }}
                  >
                    {currentPlan.maxAgents ? "Limited" : "Unlimited"}
                  </p>
                </div>
              </div>
              <p
                className="text-xl sm:text-2xl font-bold"
                style={{ color: "var(--d-text-primary)" }}
              >
                {subscription.usage.agentsUsed}
                {currentPlan.maxAgents && (
                  <span
                    className="text-sm font-normal"
                    style={{ color: "var(--d-text-muted)" }}
                  >
                    /{currentPlan.maxAgents}
                  </span>
                )}
              </p>
            </div>
            {currentPlan.maxAgents && (
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--d-border)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((subscription.usage.agentsUsed / currentPlan.maxAgents) * 100, 100)}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor:
                      subscription.usage.agentsUsed >= currentPlan.maxAgents
                        ? "var(--d-error)"
                        : "var(--d-accent)",
                  }}
                />
              </div>
            )}
          </div>

          <div
            className="p-4 sm:p-5 rounded-xl sm:rounded-2xl"
            style={{ backgroundColor: "var(--d-surface-hover)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "var(--d-accent-subtle)" }}
                >
                  <FileText size={16} style={{ color: "var(--d-accent)" }} />
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--d-text-secondary)" }}
                  >
                    Job Applications
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--d-text-muted)" }}
                  >
                    {currentPlan.maxJobs ? "Limited" : "Unlimited"}
                  </p>
                </div>
              </div>
              <p
                className="text-xl sm:text-2xl font-bold"
                style={{ color: "var(--d-text-primary)" }}
              >
                {subscription.usage.jobsApplied}
                {currentPlan.maxJobs && (
                  <span
                    className="text-sm font-normal"
                    style={{ color: "var(--d-text-muted)" }}
                  >
                    /{currentPlan.maxJobs}
                  </span>
                )}
              </p>
            </div>
            {currentPlan.maxJobs && (
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--d-border)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((subscription.usage.jobsApplied / currentPlan.maxJobs) * 100, 100)}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor:
                      subscription.usage.jobsApplied >= currentPlan.maxJobs
                        ? "var(--d-error)"
                        : "var(--d-accent)",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
