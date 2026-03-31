"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileSearch, BrainCircuit, Mic2, Rocket, FileText } from "lucide-react";
import { dashboardStagger, fadeUp } from "@/features/dashboard/components/animations";
import CurrentSubscription from "@/features/billing/components/CurrentSubscription";
import SubscriptionCard from "@/features/billing/components/SubscriptionCard";
import { useSubscription } from "@/features/billing/hooks/useSubscription";
import { subscriptionAPI } from "@/features/billing/api/subscriptionAPI";
import { useToast } from "@/components/ui/Toast";
import {
  MOCK_MEMBER_SUBSCRIPTION,
  MOCK_PLANS,
} from "@/features/billing/constants/mockData";

interface UsageMetricProps {
  icon: React.ReactNode;
  label: string;
  used: number;
  limit: number;
  sublabel?: string;
}

function UsageMetric({ icon, label, used, limit, sublabel }: UsageMetricProps) {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const isExhausted = !isUnlimited && used >= limit;

  return (
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
            {icon}
          </div>
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--d-text-secondary)" }}
            >
              {label}
            </p>
            {sublabel && (
              <p
                className="text-xs"
                style={{ color: "var(--d-text-muted)" }}
              >
                {sublabel}
              </p>
            )}
          </div>
        </div>
        <p
          className="text-xl sm:text-2xl font-bold"
          style={{ color: "var(--d-text-primary)" }}
        >
          {used}
          <span
            className="text-sm font-normal"
            style={{ color: "var(--d-text-muted)" }}
          >
            {isUnlimited ? "" : `/${limit}`}
          </span>
        </p>
      </div>
      {!isUnlimited && (
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--d-border)" }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              backgroundColor: isExhausted ? "var(--d-error)" : "var(--d-accent)",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function BillingPageWrapper() {
  const router = useRouter();
  const { data: memberSubscription, isLoading, error, refetch } = useSubscription();
  const { addToast } = useToast();

  const tierOrder = ["explorer", "strategist", "architect"];

  const handleUpgrade = async (planId: string) => {
    const currentTierIndex = tierOrder.indexOf(subscription.currentPlan);
    const selectedTierIndex = tierOrder.indexOf(planId);

    if (selectedTierIndex < currentTierIndex) {
      try {
        const response = await subscriptionAPI.cancelSubscription();
        addToast({ title: "Success", description: response.message, type: "success" });
        refetch();
      } catch (err: any) {
        addToast({ title: "Error", description: err.response?.data?.message || "Failed to cancel subscription", type: "error" });
      }
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

  const { usage } = subscription;
  const isUnlimited = subscription.currentPlan === "architect";

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
            <FileSearch size={20} style={{ color: "var(--d-accent)" }} />
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
              {new Date(usage.periodStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(usage.periodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <UsageMetric
            icon={<BrainCircuit size={16} style={{ color: "var(--d-accent)" }} />}
            label="CV Analyses"
            used={usage.cvAnalysisUsed}
            limit={isUnlimited ? -1 : (currentPlan.cvAnalysisLimit ?? 0)}
          />
          <UsageMetric
            icon={<FileSearch size={16} style={{ color: "var(--d-accent)" }} />}
            label="Job Searches"
            used={usage.jobSearchUsed}
            limit={isUnlimited ? -1 : (currentPlan.jobSearchLimit ?? 0)}
            sublabel={currentPlan.jobResultsPerSearch ? `${currentPlan.jobResultsPerSearch} results each` : undefined}
          />
          <UsageMetric
            icon={<Mic2 size={16} style={{ color: "var(--d-accent)" }} />}
            label="Interview Sessions"
            used={usage.interviewUsed}
            limit={isUnlimited ? -1 : (currentPlan.interviewLimit ?? 0)}
          />
          <UsageMetric
            icon={<Rocket size={16} style={{ color: "var(--d-accent)" }} />}
            label="Auto Applications"
            used={usage.autoApplyUsed}
            limit={isUnlimited ? -1 : (currentPlan.autoApplyLimit ?? 0)}
          />
          <UsageMetric
            icon={<FileText size={16} style={{ color: "var(--d-accent)" }} />}
            label="CV Versions"
            used={usage.cvVersionsStored}
            limit={isUnlimited ? -1 : (currentPlan.cvVersionsLimit ?? 0)}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
