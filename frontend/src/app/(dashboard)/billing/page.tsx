"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BrainCircuit, Mic2, Rocket, FileText, Crown, Infinity, Users, Zap, Briefcase, Layout, FileSearch } from "lucide-react";
import { dashboardStagger, fadeUp } from "@/features/dashboard/components/animations";
import CurrentSubscription from "@/features/billing/components/CurrentSubscription";
import SubscriptionCard from "@/features/billing/components/SubscriptionCard";
import DowngradeConfirmModal from "@/features/billing/components/DowngradeConfirmModal";
import UpgradeConfirmModal from "@/features/billing/components/UpgradeConfirmModal";
import Card from "@/components/ui/Card";
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
      className="p-4 sm:p-5  sm:"
      style={{ backgroundColor: "var(--bg-color)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 sm:w-10 sm:h-10  sm: flex items-center justify-center"
            style={{ backgroundColor: "var(--bg-color)" }}
          >
            {icon}
          </div>
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {label}
            </p>
            {sublabel && (
              <p
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                {sublabel}
              </p>
            )}
          </div>
        </div>
        {isUnlimited ? (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5  text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, var(--text-primary) 0%, #a855f7 100%)",
              color: "var(--bg-color)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/>
            </svg>
            Unlimited
          </span>
        ) : (
          <p
            className="text-xl sm:text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {used}
            <span
              className="text-sm font-normal"
              style={{ color: "var(--text-secondary)" }}
            >
              /{limit}
            </span>
          </p>
        )}
      </div>
      {!isUnlimited && (
        <div
          className="h-2  overflow-hidden"
          style={{ backgroundColor: "var(--glass-border)" }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full "
            style={{
              backgroundColor: isExhausted ? "var(--d-error)" : "var(--text-primary)",
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

  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [targetDowngradePlan, setTargetDowngradePlan] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [targetUpgradePlan, setTargetUpgradePlan] = useState<string | null>(null);

  const tierOrder = ["explorer", "strategist", "architect"];

  const getFeaturesLostOnDowngrade = (fromPlan: string, toPlan: string) => {
    const featuresLost = [];
    
    if (fromPlan === "architect") {
      if (toPlan === "strategist" || toPlan === "explorer") {
        featuresLost.push({ label: "Priority Queue Access", icon: <Zap size={16} /> });
      }
      if (toPlan === "strategist" || toPlan === "explorer") {
        featuresLost.push({ label: "Early Access to New Features", icon: <Crown size={16} /> });
      }
      if (toPlan === "explorer") {
        featuresLost.push({ label: "Full Agent Transparency", icon: <Users size={16} /> });
      }
    }
    
    if (fromPlan === "strategist") {
      featuresLost.push({ label: "React Flow Agent Transparency", icon: <Users size={16} /> });
    }

    if (fromPlan === "architect" || fromPlan === "strategist") {
      featuresLost.push({ label: "Unlimited CV Analyses", icon: <BrainCircuit size={16} /> });
      featuresLost.push({ label: "Unlimited Mock Interviews", icon: <Mic2 size={16} /> });
      featuresLost.push({ label: "Unlimited Job Searches", icon: <FileSearch size={16} /> });
      featuresLost.push({ label: "Unlimited Auto-Applications", icon: <Rocket size={16} /> });
      featuresLost.push({ label: "Unlimited CV Versions", icon: <FileText size={16} /> });
    }

    return featuresLost;
  };

  const getFeaturesGainedOnUpgrade = (fromPlan: string, toPlan: string) => {
    const featuresGained = [];

    if (fromPlan === "explorer") {
      featuresGained.push({ label: "20 CV analyses/month (from 3)", icon: <BrainCircuit size={16} /> });
      featuresGained.push({ label: "15 mock interviews/month (from 1)", icon: <Mic2 size={16} /> });
      featuresGained.push({ label: "10 job searches with 20 results (from 1)", icon: <FileSearch size={16} /> });
      featuresGained.push({ label: "10 auto-applications/month (from 0)", icon: <Rocket size={16} /> });
      featuresGained.push({ label: "5 CV versions stored (from 1)", icon: <FileText size={16} /> });
    }

    if (fromPlan === "strategist" || fromPlan === "explorer") {
      if (toPlan === "architect") {
        featuresGained.push({ label: "Unlimited CV analyses", icon: <BrainCircuit size={16} /> });
        featuresGained.push({ label: "Unlimited mock interviews", icon: <Mic2 size={16} /> });
        featuresGained.push({ label: "Unlimited job searches", icon: <FileSearch size={16} /> });
        featuresGained.push({ label: "Unlimited auto-applications", icon: <Rocket size={16} /> });
        featuresGained.push({ label: "Unlimited CV versions", icon: <FileText size={16} /> });
      }
    }

    if (fromPlan === "strategist" && toPlan === "architect") {
      featuresGained.push({ label: "Priority Queue Access", icon: <Zap size={16} /> });
      featuresGained.push({ label: "Early Access to New Features", icon: <Crown size={16} /> });
    }

    return featuresGained;
  };

  const handleDowngrade = (planId: string) => {
    setTargetDowngradePlan(planId);
    setShowDowngradeModal(true);
  };

  const confirmDowngrade = async () => {
    if (!targetDowngradePlan) return;
    
    try {
      const response = await subscriptionAPI.cancelSubscription();
      addToast({ title: "Success", description: "Your plan has been downgraded", type: "success" });
      refetch();
    } catch (err: any) {
      addToast({ title: "Error", description: err.response?.data?.message || "Failed to downgrade subscription", type: "error" });
    }
    
    setShowDowngradeModal(false);
    setTargetDowngradePlan(null);
  };

  const handleUpgrade = (planId: string) => {
    setTargetUpgradePlan(planId);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = async () => {
    if (!targetUpgradePlan) return;
    
    if (targetUpgradePlan === "explorer") {
      try {
        const response = await subscriptionAPI.cancelSubscription();
        addToast({ title: "Success", description: "Your plan has been updated", type: "success" });
        refetch();
      } catch (err: any) {
        addToast({ title: "Error", description: err.response?.data?.message || "Failed to update subscription", type: "error" });
      }
    } else {
      router.push(`/subscription/checkout?plan=${targetUpgradePlan}&billing=month`);
    }
    
    setShowUpgradeModal(false);
    setTargetUpgradePlan(null);
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
      className="max-w-7xl mx-auto space-y-8 pb-20 px-4 sm:px-6"
    >
      <motion.div variants={fadeUp} className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <h1 className="text-[11px] font-black tracking-[0.3em] text-[var(--text-secondary)]">
            Billing & fiscal
          </h1>
        </div>
        <h2 className="font-display text-5xl sm:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[0.9] capitalize">
          Platform <br /> subscription
        </h2>
        <p className="text-[15px] mt-6 max-w-2xl text-[var(--text-secondary)] leading-relaxed">
          Manage your system access level, billing cycles, and resource allowances. 
          All transactions are processed through encrypted channels.
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <CurrentSubscription
          subscription={subscription}
          plan={currentPlan!}
        />
      </motion.div>

      <Card
        title="Available Packages"
        description="Select the architectural tier that best aligns with your career objectives."
        icon={<Zap className="w-4 h-4" />}
        actions={
          <div className="flex items-center gap-2 p-1 bg-[var(--d-border)]" style={{ borderRadius: "6px" }}>
            <span className="px-4 py-1.5 text-[10px] font-black tracking-widest bg-[var(--d-text-primary)] text-[var(--d-bg)] shadow-sm" style={{ borderRadius: "4px" }}>
              Monthly
            </span>
            <span className="px-4 py-1.5 text-[10px] font-black tracking-widest text-[var(--d-text-tertiary)] cursor-not-allowed">
              Annual
            </span>
          </div>
        }
      >

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
              onDowngrade={handleDowngrade}
            />
          ))}
        </div>
      </Card>

      <Card
        title="System Resource Usage"
        description={`${new Date(usage.periodStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(usage.periodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} cycle`}
        icon={<BrainCircuit className="w-4 h-4" />}
      >

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <UsageMetric
            icon={<BrainCircuit size={16} style={{ color: "var(--text-primary)" }} />}
            label="CV Analyses"
            used={usage.cvAnalysisUsed}
            limit={isUnlimited ? -1 : (currentPlan?.cvAnalysisLimit ?? 0)}
          />
          <UsageMetric
            icon={<FileSearch size={16} style={{ color: "var(--text-primary)" }} />}
            label="Job Searches"
            used={usage.jobSearchUsed}
            limit={isUnlimited ? -1 : (currentPlan?.jobSearchLimit ?? 0)}
            sublabel={currentPlan?.jobResultsPerSearch ? `${currentPlan!.jobResultsPerSearch} results each` : undefined}
          />
          <UsageMetric
            icon={<Mic2 size={16} style={{ color: "var(--text-primary)" }} />}
            label="Interview Sessions"
            used={usage.interviewUsed}
            limit={isUnlimited ? -1 : (currentPlan?.interviewLimit ?? 0)}
          />
          <UsageMetric
            icon={<Rocket size={16} style={{ color: "var(--text-primary)" }} />}
            label="Auto Applications"
            used={usage.autoApplyUsed}
            limit={isUnlimited ? -1 : (currentPlan?.autoApplyLimit ?? 0)}
          />
          <UsageMetric
            icon={<FileText size={16} style={{ color: "var(--text-primary)" }} />}
            label="CV Versions"
            used={usage.cvVersionsStored}
            limit={isUnlimited ? -1 : (currentPlan?.cvVersionsLimit ?? 0)}
          />
        </div>
      </Card>

      <DowngradeConfirmModal
        isOpen={showDowngradeModal}
        onClose={() => {
          setShowDowngradeModal(false);
          setTargetDowngradePlan(null);
        }}
        onConfirm={confirmDowngrade}
        currentPlan={currentPlan?.name || "Current"}
        targetPlan={
          targetDowngradePlan
            ? MOCK_PLANS.find(
                (p) => p.id === targetDowngradePlan && p.billingPeriod === "month"
              )?.name || "Lower"
            : "Lower"
        }
        featuresLost={getFeaturesLostOnDowngrade(
          subscription.currentPlan,
          targetDowngradePlan || "explorer"
        )}
      />

      <UpgradeConfirmModal
        isOpen={showUpgradeModal}
        onClose={() => {
          setShowUpgradeModal(false);
          setTargetUpgradePlan(null);
        }}
        onConfirm={confirmUpgrade}
        currentPlan={currentPlan?.name || "Current"}
        targetPlan={
          targetUpgradePlan
            ? MOCK_PLANS.find(
                (p) => p.id === targetUpgradePlan && p.billingPeriod === "month"
              )?.name || "Higher"
            : "Higher"
        }
        featuresGained={getFeaturesGainedOnUpgrade(
          subscription.currentPlan,
          targetUpgradePlan || "strategist"
        )}
        newPrice={
          targetUpgradePlan
            ? MOCK_PLANS.find(
                (p) => p.id === targetUpgradePlan && p.billingPeriod === "month"
              )?.price.toString() || "0"
            : "0"
        }
      />
    </motion.div>
  );
}
