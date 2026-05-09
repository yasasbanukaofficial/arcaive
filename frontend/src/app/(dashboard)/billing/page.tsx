"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { BrainCircuit, Mic2, Rocket, FileText, Crown, Infinity, Users, Zap, Briefcase, Layout, FileSearch } from "lucide-react";
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
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
    <div className="p-4 sm:p-5 bg-[#161616] rounded-[16px] border border-[#2a2a2a]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[12px] flex items-center justify-center bg-[#2a2a2a]">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">
              {label}
            </p>
            {sublabel && (
              <p className="text-xs text-white/35">
                {sublabel}
              </p>
            )}
          </div>
        </div>
        {isUnlimited ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold bg-[#e6efdf] text-[#111111] rounded-full">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/>
            </svg>
            Unlimited
          </span>
        ) : (
          <p className="text-xl sm:text-2xl font-bold text-white">
            {used}
            <span className="text-sm font-normal text-white/50">
              /{limit}
            </span>
          </p>
        )}
      </div>
      {!isUnlimited && (
        <div className="h-2 overflow-hidden rounded-full bg-[#2a2a2a]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              backgroundColor: isExhausted ? "var(--d-error)" : "#e6efdf",
            }}
          />
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
      title: "Platform Subscription",
      description:
        "Manage your system access level and upgrade or downgrade your plan.",
    },
    resources: {
      title: "Resource Usage",
      description:
        "Track your monthly consumption across all AI-powered features.",
    },
    payment: {
      title: "Payment Method",
      description:
        "Add or update your payment methods and billing address.",
    },
    invoices: {
      title: "Billing History",
      description:
        "View and download invoices for all your past transactions.",
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
            <div className="bg-[#161616] rounded-[16px] border border-[#2a2a2a] overflow-hidden mb-8">
              <CurrentSubscription
                subscription={subscription}
                plan={currentPlan!}
              />
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 p-1 bg-[#1f1f1f] rounded-[8px] w-fit">
                <span className="px-4 py-1.5 text-[10px] font-black tracking-widest bg-[#e6efdf] text-[#111111] shadow-sm rounded-[6px]">
                  Monthly
                </span>
                <span className="px-4 py-1.5 text-[10px] font-black tracking-widest text-white/30 cursor-not-allowed">
                  Annual
                </span>
              </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <UsageMetric
              icon={<BrainCircuit size={16} className="text-[#e6efdf]" />}
              label="CV Analyses"
              used={usage.cvAnalysisUsed}
              limit={isUnlimited ? -1 : (currentPlan?.cvAnalysisLimit ?? 0)}
            />
            <UsageMetric
              icon={<FileSearch size={16} className="text-[#e6efdf]" />}
              label="Job Searches"
              used={usage.jobSearchUsed}
              limit={isUnlimited ? -1 : (currentPlan?.jobSearchLimit ?? 0)}
              sublabel={currentPlan?.jobResultsPerSearch ? `${currentPlan!.jobResultsPerSearch} results each` : undefined}
            />
            <UsageMetric
              icon={<Mic2 size={16} className="text-[#e6efdf]" />}
              label="Interview Sessions"
              used={usage.interviewUsed}
              limit={isUnlimited ? -1 : (currentPlan?.interviewLimit ?? 0)}
            />
            <UsageMetric
              icon={<Rocket size={16} className="text-[#e6efdf]" />}
              label="Auto Applications"
              used={usage.autoApplyUsed}
              limit={isUnlimited ? -1 : (currentPlan?.autoApplyLimit ?? 0)}
            />
            <UsageMetric
              icon={<FileText size={16} className="text-[#e6efdf]" />}
              label="CV Versions"
              used={usage.cvVersionsStored}
              limit={isUnlimited ? -1 : (currentPlan?.cvVersionsLimit ?? 0)}
            />
          </div>
        );
      case "payment":
        return (
          <div className="bg-[#161616] rounded-[16px] border border-[#2a2a2a] p-8 text-center">
            <p className="text-white/50">Payment method management coming soon</p>
          </div>
        );
      case "invoices":
        return (
          <div className="bg-[#161616] rounded-[16px] border border-[#2a2a2a] p-8 text-center">
            <p className="text-white/50">Invoice history coming soon</p>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={dashboardStagger(0.04, 0.02)}
      className="max-w-7xl mx-auto"
    >
      <div className="mb-12">
        <h1 className="font-sans text-[32px] font-medium text-white tracking-tight leading-none capitalize mb-3">
          System Configuration
        </h1>
        <p className="font-sans text-[15px] max-w-2xl text-[rgba(255,255,255,0.5)] leading-relaxed">
          Manage your platform subscription, billing cycles, and resource allowances.
        </p>
      </div>

      <motion.div variants={fadeUp} className="lg:hidden mb-8">
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
          {(["subscription", "resources", "payment", "invoices"] as BillingSection[]).map((id) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex-shrink-0 px-6 py-3 text-[11px] font-black tracking-[0.2em] border transition-all ${
                  isActive ? "bg-[#e6efdf] text-[#111111] border-[#e6efdf]" : "bg-[#161616] text-white/50 border-[#2a2a2a]"
                }`}
                style={{ borderRadius: "var(--radius)" }}
              >
                {sectionTitles[id].title.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="flex flex-col lg:flex-row gap-8 lg:gap-10"
      >
        <div className="w-60 shrink-0 hidden lg:block">
          <div className="sticky top-24">
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
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25, ease: smoothEase }}
              className="mb-10"
            >
              <div className="flex items-baseline gap-4 mb-2">
                <h2 className="font-display text-3xl font-black tracking-tight text-white capitalize">
                  {title.split(" & ")[0]}
                </h2>
                <span className="text-white/30 font-display text-2xl font-light italic">
                  {title.split(" & ")[1] ? `& ${title.split(" & ")[1]}` : ""}
                </span>
              </div>
              <p className="text-[14px] text-white/50 max-w-xl leading-relaxed">
                {description}
              </p>
              <div className="h-[1px] w-full bg-[#2a2a2a] mt-6" />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${activeSection}`}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
              variants={dashboardStagger(0.03, 0.02)}
            >
              {renderSection(activeSection)}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

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
