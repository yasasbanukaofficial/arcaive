"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ArrowLeft, 
  CreditCard, 
  Shield, 
  Zap,
  Rocket,
  Crown,
  ChevronDown,
  Lock,
  Sparkles
} from "lucide-react";
import Button from "@/components/ui/Button";
import { dashboardStagger, fadeUp } from "@/components/animations/animations";
import { checkoutAPI } from "@/features/subscription/api/checkoutAPI";

import { 
  DashboardCard,
} from "@/features/dashboard/components/DashboardLayoutComponents";

const PLAN_CONFIG = {
  strategist: {
    icon: Rocket,
  },
  architect: {
    icon: Crown,
  },
};

const PLANS = [
  {
    id: "strategist",
    name: "Strategist",
    price: 12,
    priceDisplay: "$12",
    description: "Advanced AI-powered features for serious job hunters",
    isPopular: true,
    features: [
      { text: "20 CV analyses/month (multi-agent advanced)", included: true },
      { text: "15 mock interview sessions/month (voice via TTS)", included: true },
      { text: "10 job search sets (20 results each)", included: true },
      { text: "10 auto-applications/month", included: true },
      { text: "AI CV rewriting per job (Refinement Swarm)", included: true },
      { text: "5 CV versions stored", included: true },
      { text: "Agent transparency (React Flow)", included: true },
    ],
  },
  {
    id: "architect",
    name: "Architect",
    price: 29,
    priceDisplay: "$29",
    description: "Unlimited everything for teams and power users",
    features: [
      { text: "Unlimited CV analyses (advanced multi-agent)", included: true },
      { text: "Unlimited mock interviews (voice + priority)", included: true },
      { text: "Unlimited job search sets (50 results each)", included: true },
      { text: "Unlimited auto-applications", included: true },
      { text: "Priority AI queue (faster responses)", included: true },
      { text: "Unlimited CV versions stored", included: true },
      { text: "Full agent transparency", included: true },
      { text: "Early access to new features", included: true },
    ],
  },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>(
    (searchParams.get("plan") === "explorer" ? "strategist" : searchParams.get("plan")) || "strategist"
  );
  const [billingPeriod, setBillingPeriod] = useState<"month" | "year">(
    (searchParams.get("billing") as "month" | "year") || "month"
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedPlanData = PLANS.find((p) => p.id === selectedPlan);
  const planConfig = PLAN_CONFIG[selectedPlan as keyof typeof PLAN_CONFIG];
  const Icon = planConfig?.icon || Sparkles;

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
    router.replace(`/subscription/checkout?plan=${planId}&billing=${billingPeriod}`, { scroll: false });
  };

  const handleBillingChange = (period: "month" | "year") => {
    setBillingPeriod(period);
    router.replace(`/subscription/checkout?plan=${selectedPlan}&billing=${period}`, { scroll: false });
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const resp = await checkoutAPI.checkout(selectedPlan);
      router.push(resp.data?.url);
    } catch {
      setIsProcessing(false);
    }
  };

  const yearlyPrice = selectedPlanData?.price
    ? Math.floor(selectedPlanData.price * 0.8 * 12)
    : 0;
  const savings = selectedPlanData?.price
    ? selectedPlanData.price * 12 - yearlyPrice
    : 0;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0e0e0e] text-[#e4e4e4]">
      {/* Dark Ambient Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
             backgroundSize: '40px 40px' 
           }} 
      />
      
      <div className="relative z-10 max-w-[1200px] mx-auto space-y-8 px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial="hidden"
          animate="show"
          variants={dashboardStagger(0.05, 0.02)}
        >
          <motion.div variants={fadeUp} className="mb-12">
            <Link
              href="/subscription"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-[#1f1f1f] border border-[#2a2a2a] mb-8 rounded-[24px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Change Selection
            </Link>

            <h1 className="font-sans text-[32px] font-medium text-white tracking-tight leading-none capitalize">
              Order Summary
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            <motion.div variants={fadeUp} className="lg:col-span-3 space-y-6">
              <DashboardCard title="Package Selection">
                <div className="space-y-4">
                  {PLANS.map((plan) => {
                    const config = PLAN_CONFIG[plan.id as keyof typeof PLAN_CONFIG];
                    const PlanIcon = config?.icon || Sparkles;
                    const isSelected = selectedPlan === plan.id;

                    return (
                      <motion.div
                        key={plan.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handlePlanChange(plan.id)}
                        className={`relative p-6 sm:p-8 cursor-pointer transition-all duration-300 group rounded-[24px] ${isSelected ? "bg-[#e6efdf] text-[#111111]" : "bg-[#1f1f1f] text-[#e4e4e4] hover:bg-[#2a2a2a]"}`}
                        style={{
                          border: `1px solid ${isSelected ? "transparent" : "#2a2a2a"}`,
                        }}
                      >
                          {isSelected && (
                            <div className="absolute -top-3 left-8">
                              <span
                                className="px-3 py-1 text-[9px] font-black tracking-widest uppercase border bg-[#111111] text-[#e6efdf] border-[#111111] rounded-[6px]"
                              >
                                Preferred Selection
                              </span>
                            </div>
                          )}

                        <div className="flex items-center gap-4">
                          <div
                            className={`w-14 h-14 flex items-center justify-center shrink-0 transition-colors duration-300 rounded-[16px] ${isSelected ? "bg-[#111111]/10" : "bg-[#2a2a2a]"}`}
                          >
                            <PlanIcon
                              className={`w-6 h-6 ${isSelected ? "text-[#111111]" : "text-[#e4e4e4]"}`}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-bold capitalize tracking-tight">
                                {plan.name}
                              </h3>
                            </div>
                            <p className={`text-[13px] mt-1 font-medium ${isSelected ? "text-[#111111]/60" : "text-white/40"}`}>
                              {plan.description}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-2xl font-black">
                              {plan.priceDisplay}
                            </div>
                            <div className={`text-[10px] uppercase tracking-widest opacity-60`}>
                              /month
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 flex items-center justify-center shrink-0 rounded-[6px] border ${isSelected ? "border-[#111111] bg-[#111111]" : "border-[#3a3a3a]"}`}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 text-[#e6efdf]" strokeWidth={3} />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </DashboardCard>

              <DashboardCard title="Billing Schedule">
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBillingChange("month")}
                    className={`p-6 sm:p-8 text-left transition-all duration-300 rounded-[24px] ${billingPeriod === "month" ? "bg-[#e6efdf] text-[#111111]" : "bg-[#1f1f1f] text-[#e4e4e4] border border-[#2a2a2a] hover:bg-[#2a2a2a]"}`}
                  >
                    <div className="font-bold text-lg capitalize tracking-tight">
                      Monthly
                    </div>
                    <div className={`text-[11px] mt-1 font-bold uppercase tracking-widest ${billingPeriod === "month" ? "text-[#111111]/50" : "text-white/30"}`}>
                      Standard cycle
                    </div>
                  </motion.button>

                  <div
                    className="p-6 sm:p-8 text-left relative opacity-40 grayscale cursor-not-allowed bg-[#1f1f1f] border border-[#2a2a2a] rounded-[24px]"
                  >
                    <div className="absolute -top-3 right-6 bg-[#2a2a2a] px-3 py-1 text-[8px] font-bold uppercase tracking-[0.25em] rounded-[6px]">
                      Locked
                    </div>
                    <div className="font-bold text-lg capitalize tracking-tight">
                      Annual
                    </div>
                    <div className="text-[11px] mt-1 font-bold uppercase tracking-widest text-white/30">
                      Savings plan
                    </div>
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard title="Included Utilities">
                <div className="space-y-3">
                  {selectedPlanData?.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="flex items-start gap-4 p-4 hover:bg-[#1f1f1f] transition-all duration-300 rounded-[16px] border border-transparent hover:border-[#2a2a2a]"
                    >
                      <div
                        className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 border border-[#4a7c59] bg-[#4a7c59]/10 rounded-[6px]"
                      >
                        <Check className="w-3 h-3 text-[#e6efdf]" strokeWidth={3} />
                      </div>
                      <span className="text-sm font-medium leading-[1.6] text-white/80">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </DashboardCard>
            </motion.div>

            <motion.div variants={fadeUp} className="lg:col-span-2">
              <DashboardCard title="Summary" className="sticky top-12">
                <div className="flex items-center gap-5 mb-8 pb-8 border-b border-[#2a2a2a]">
                  <div
                    className="w-16 h-16 flex items-center justify-center bg-[#e6efdf] text-[#111111] rounded-[20px] shadow-xl"
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#e4e4e4] leading-none capitalize">
                      {selectedPlanData?.name}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mt-2">
                      Active collection
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">
                      Package
                    </span>
                    <span className="font-bold text-[#e4e4e4]">
                      {selectedPlanData?.priceDisplay}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">
                      Service Charge
                    </span>
                    <span className="font-bold text-[#e4e4e4] uppercase text-xs">
                      Free
                    </span>
                  </div>
                </div>

                <div className="mb-8 bg-[#1f1f1f] p-6 -mx-6 lg:-mx-8 border-t border-b border-[#2a2a2a]">
                  <div className="flex items-baseline justify-between px-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                      Total Due
                    </span>
                    <div className="text-right">
                      <span className="text-5xl font-bold text-[#e4e4e4] tracking-tighter">
                        {selectedPlanData?.price === 0
                          ? "0"
                          : `${selectedPlanData?.price}`}
                      </span>
                      <span className="text-[10px] ml-2 font-bold uppercase tracking-widest text-white/40">
                        USD
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedPlanData?.price === 0 ? (
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full h-14 px-8 font-bold text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-[0.98] bg-[#e6efdf] text-[#111111] rounded-[24px]"
                    >
                      {isProcessing ? "Processing..." : "Continue with Free Plan"}
                    </button>
                  ) : (
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full h-14 px-8 font-bold text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-[0.98] bg-[#e6efdf] text-[#111111] rounded-[24px]"
                    >
                      {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-[#111111]/20 border-t-[#111111] rounded-full animate-spin" />
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                      {isProcessing ? "Authorizing..." : "Complete Order"}
                    </button>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-[#2a2a2a]">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                      <Shield className="w-4 h-4 text-white/40" />
                      <span>Encrypted Transaction via Stripe</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                      <Zap className="w-4 h-4 text-white/40" />
                      <span>Instant deployment upon success</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-4">
                  <Link
                    href="/subscription"
                    className="text-xs transition-colors hover:underline text-white/40 hover:text-white"
                  >
                    Compare Plans
                  </Link>
                  <span className="text-[#2a2a2a]">|</span>
                  <Link
                    href="/billing"
                    className="text-xs transition-colors hover:underline text-white/40 hover:text-white"
                  >
                    Manage Billing
                  </Link>
                </div>
              </DashboardCard>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e]">
          <div className="text-sm text-white/50">
            Loading...
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
