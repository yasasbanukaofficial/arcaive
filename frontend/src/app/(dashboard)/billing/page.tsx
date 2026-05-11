"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { BrainCircuit, Mic2, Rocket, FileText, Crown, Infinity, Users, Zap, Briefcase, Layout, FileSearch, TrendingUp, Calendar, AlertCircle, CreditCard, Receipt } from "lucide-react";
import { dashboardStagger, fadeUp } from "@/features/dashboard/components/animations";
import BillingNav, {
  type BillingSection,
} from "@/features/billing/components/BillingNav";
import CurrentSubscription from "@/features/billing/components/CurrentSubscription";
import SubscriptionCard from "@/features/billing/components/SubscriptionCard";
import DowngradeConfirmModal from "@/features/billing/components/DowngradeConfirmModal";
import UpgradeConfirmModal from "@/features/billing/components/UpgradeConfirmModal";
import { useSubscription } from "@/features/billing/hooks/useSubscription";
import { subscriptionAPI } from "@/features/billing/api/subscriptionAPI";
import { useToast } from "@/components/ui/Toast";
import {
  MOCK_MEMBER_SUBSCRIPTION,
  MOCK_PLANS,
} from "@/features/billing/constants/mockData";

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
    <div className="p-6 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[24px] hover:bg-[var(--glass-bg)]/80 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--text-primary)]/[0.03] border border-[var(--glass-border)] transition-colors group-hover:bg-[var(--accent-brand)] group-hover:border-[var(--accent-brand)] group-hover:text-[var(--accent-brand-contrast)]">
            {icon}
          </div>
          <div>
            <p className="text-[14px] font-bold text-[var(--text-primary)] tracking-tight">
              {label}
            </p>
            {sublabel && (
              <p className="text-[11px] font-medium text-[var(--text-tertiary)] mt-0.5">
                {sublabel}
              </p>
            )}
          </div>
        </div>
        {isUnlimited ? (
          <div className="px-3 py-1 rounded-full bg-[var(--accent-brand)]/10 border border-[var(--accent-brand)]/20">
             <span className="text-[10px] font-bold text-[var(--accent-brand)] uppercase tracking-widest flex items-center gap-1.5">
               <Infinity size={10} /> Unlimited
             </span>
          </div>
        ) : (
          <div className="flex flex-col items-end">
             <p className="text-[20px] font-bold text-[var(--text-primary)] tracking-tighter leading-none">
               {used}
             </p>
             <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-1">
               Of {limit}
             </p>
          </div>
        )}
      </div>
      {!isUnlimited && (
        <div className="space-y-3">
          <div className="h-[4px] w-full bg-[var(--text-primary)]/[0.03] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full rounded-full transition-all duration-500 ${isExhausted ? 'bg-red-500' : 'bg-[var(--accent-brand)] shadow-[0_0_12px_rgba(223,231,216,0.3)]'}`}
            />
          </div>
          <div className="flex justify-between items-center">
             <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">{Math.round(percentage)}% capacity used</span>
             {isExhausted && <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Exhausted</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BillingPage() {
  const router = useRouter();
  const { data: memberSubscription, isLoading, error, refetch } = useSubscription();
  const { addToast } = useToast();

  const [activeSection, setActiveSection] = useState<BillingSection>("subscription");

  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [targetDowngradePlan, setTargetDowngradePlan] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [targetUpgradePlan, setTargetUpgradePlan] = useState<string | null>(null);

  const sectionTitles: Record<
    BillingSection,
    { title: string; description: string }
  > = {
    subscription: {
      title: "Available Architecture",
      description: "Select a node tier for your system operations.",
    },
    resources: {
      title: "Resource Allocation",
      description: "Temporal consumption of AI-powered system units.",
    },
    payment: {
      title: "Financial Interface",
      description: "Secure management of transaction protocols and entities.",
    },
    invoices: {
      title: "Transaction Ledger",
      description: "Archival record of platform value exchanges.",
    },
  };

  const { title, description } = sectionTitles[activeSection];

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

    if (fromPlan === "strategist" || toPlan === "architect") {
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

  function renderSection(section: BillingSection) {
    switch (section) {
      case "subscription":
        return (
          <>
            <div className="mb-10">
              <CurrentSubscription
                subscription={subscription}
                plan={currentPlan!}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </>
        );
      case "resources":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <UsageMetric
              icon={<BrainCircuit size={16} />}
              label="CV Analyses"
              used={usage.cvAnalysisUsed}
              limit={isUnlimited ? -1 : (currentPlan?.cvAnalysisLimit ?? 0)}
            />
            <UsageMetric
              icon={<FileSearch size={16} />}
              label="Job Searches"
              used={usage.jobSearchUsed}
              limit={isUnlimited ? -1 : (currentPlan?.jobSearchLimit ?? 0)}
              sublabel={currentPlan?.jobResultsPerSearch ? `${currentPlan!.jobResultsPerSearch} results each` : undefined}
            />
            <UsageMetric
              icon={<Mic2 size={16} />}
              label="Interview Sessions"
              used={usage.interviewUsed}
              limit={isUnlimited ? -1 : (currentPlan?.interviewLimit ?? 0)}
            />
            <UsageMetric
              icon={<Rocket size={16} />}
              label="Auto Applications"
              used={usage.autoApplyUsed}
              limit={isUnlimited ? -1 : (currentPlan?.autoApplyLimit ?? 0)}
            />
            <UsageMetric
              icon={<FileText size={16} />}
              label="CV Versions"
              used={usage.cvVersionsStored}
              limit={isUnlimited ? -1 : (currentPlan?.cvVersionsLimit ?? 0)}
            />
          </div>
        );
      case "payment":
        return (
          <div className="bg-[var(--glass-bg)] rounded-[32px] border border-[var(--glass-border)] p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--text-primary)]/[0.03] border border-[var(--glass-border)] flex items-center justify-center mx-auto mb-6">
               <CreditCard className="text-[var(--text-tertiary)]" size={24} />
            </div>
            <h3 className="text-[20px] font-bold text-[var(--text-primary)] mb-2">Financial Interface Offline</h3>
            <p className="text-[var(--text-secondary)] font-medium max-w-xs mx-auto">Payment method management is currently undergoing maintenance.</p>
          </div>
        );
      case "invoices":
        return (
          <div className="bg-[var(--glass-bg)] rounded-[32px] border border-[var(--glass-border)] p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--text-primary)]/[0.03] border border-[var(--glass-border)] flex items-center justify-center mx-auto mb-6">
               <Receipt className="text-[var(--text-tertiary)]" size={24} />
            </div>
            <h3 className="text-[20px] font-bold text-[var(--text-primary)] mb-2">Archive Records</h3>
            <p className="text-[var(--text-secondary)] font-medium max-w-xs mx-auto">Invoice history will be available shortly after your first transaction.</p>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="w-full flex flex-col gap-8 pb-20 px-4 md:px-8"
    >
      <motion.div 
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: smoothEase } }
        }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
      >
        <div className="space-y-1">
          <h1 className="text-[44px] md:text-[56px] font-semibold text-[var(--text-primary)] tracking-[-0.04em] leading-none">
            Billing
          </h1>
          <p className="text-[var(--text-secondary)] text-[14px] font-medium tracking-tight">System tiers and resource synchronization</p>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-10 mt-4">
        <div className="w-full lg:w-72 shrink-0">
          <div className="sticky top-28 space-y-6">
            <BillingNav
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: smoothEase }}
              className="mb-6"
            >
              <div className="flex items-baseline gap-4 mb-2">
                <h2 className="text-[32px] font-bold tracking-tight text-[var(--text-primary)] leading-none capitalize">
                  {title}
                </h2>
              </div>
              <p className="text-[15px] text-[var(--text-secondary)] max-w-xl leading-relaxed font-medium">
                {description}
              </p>
              <div className="h-[1px] w-full bg-[var(--glass-border)] mt-6" />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${activeSection}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: smoothEase }}
            >
              {renderSection(activeSection)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

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
