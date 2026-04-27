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

const PLAN_CONFIG = {
  strategist: {
    icon: Rocket,
    gradient: "bg-white/5",
    accentColor: "#000",
    bgAccent: "rgba(0, 0, 0, 0.05)",
    borderAccent: "var(--text-primary)",
    priceColor: "#000",
  },
  architect: {
    icon: Crown,
    gradient: "bg-white/5",
    accentColor: "#000",
    bgAccent: "rgba(0, 0, 0, 0.05)",
    borderAccent: "var(--text-primary)",
    priceColor: "#000",
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
    <div className="min-h-screen relative overflow-hidden bg-[#fbfbfb] text-black">
      <div className="noise-overlay opacity-[0.03]" />
      <div className="bg-grid-mat opacity-[0.2]" style={{ backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)' }} />
      
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="relative z-10 max-w-[1200px] mx-auto space-y-8 px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial="hidden"
          animate="show"
          variants={dashboardStagger(0.05, 0.02)}
        >
          <motion.div variants={fadeUp} className="mb-12">
            <Link
              href="/subscription"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-black hover:text-white border border-black mb-12"
              style={{
                borderRadius: "var(--radius)",
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Change Selection
            </Link>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-[1px] bg-black/20"></div>
                <h1 className="text-[11px] font-bold uppercase tracking-[0.25em] text-black/40">
                  Secure Checkout
                </h1>
              </div>
              <h2 className="font-display text-6xl sm:text-8xl font-bold tracking-tighter text-black uppercase leading-[0.9]">
                Order <br /> Summary.
              </h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            <motion.div variants={fadeUp} className="lg:col-span-3 space-y-6">
              <div
                className="p-8 sm:p-12 bg-white border border-black/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]"
                style={{ borderRadius: "var(--radius)" }}
              >
                <h2 className="font-mono text-[11px] font-bold uppercase tracking-widest mb-10 text-black flex items-center gap-3">
                  <span className="w-2 h-2 bg-black"></span>
                  Package Selection
                </h2>

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
                        className={`relative p-6 sm:p-8 cursor-pointer transition-all duration-500 group ${isSelected ? "bg-black text-white shadow-xl shadow-black/10" : "bg-white text-black hover:bg-black/5"}`}
                        style={{
                          border: `1px solid ${isSelected ? "black" : "rgba(0,0,0,0.1)"}`,
                          borderRadius: "var(--radius)",
                        }}
                      >
                          <div className="absolute -top-3 left-8">
                            <span
                              className={`px-3 py-1 text-[9px] font-black tracking-widest uppercase border ${isSelected ? "bg-white text-black border-white" : "bg-black text-white border-black"}`}
                              style={{ borderRadius: "4px" }}
                            >
                              Preferred Selection
                            </span>
                          </div>

                        <div className="flex items-center gap-4">
                          <div
                            className={`w-14 h-14 flex items-center justify-center shrink-0 transition-colors duration-500 ${isSelected ? "bg-white/15" : "bg-black/5"}`}
                            style={{ borderRadius: "var(--radius)" }}
                          >
                            <PlanIcon
                              className={`w-6 h-6 ${isSelected ? "text-white" : "text-black"}`}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-bold uppercase tracking-tight">
                                {plan.name}
                              </h3>
                            </div>
                            <p className={`text-[13px] mt-1 font-medium ${isSelected ? "text-white/50" : "text-black/40"}`}>
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
                            className={`w-5 h-5 border flex items-center justify-center shrink-0 ${isSelected ? "border-white bg-white" : "border-black/20"}`}
                            style={{ borderRadius: "var(--radius)" }}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 text-black" strokeWidth={3} />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div
                className="p-8 sm:p-12 bg-white border border-black/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]"
                style={{ borderRadius: "var(--radius)" }}
              >
                <h2 className="font-mono text-[11px] font-bold uppercase tracking-widest mb-10 text-black flex items-center gap-3">
                  <span className="w-2 h-2 bg-black"></span>
                  Billing Schedule
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBillingChange("month")}
                    className={`p-8 text-left transition-all duration-500 ${billingPeriod === "month" ? "bg-black text-white shadow-xl shadow-black/10" : "bg-white text-black hover:bg-black/5 border border-black/10"}`}
                    style={{
                      borderRadius: "var(--radius)",
                    }}
                  >
                    <div className="font-bold text-lg uppercase tracking-tight">
                      Monthly
                    </div>
                    <div className={`text-[11px] mt-1 font-bold uppercase tracking-widest ${billingPeriod === "month" ? "text-white/40" : "text-black/30"}`}>
                      Standard cycle
                    </div>
                  </motion.button>

                  <div
                    className="p-8 text-left relative opacity-30 grayscale cursor-not-allowed bg-black/[0.02] border border-black/5"
                    style={{
                      borderRadius: "var(--radius)",
                    }}
                  >
                    <div className="absolute -top-3 right-8 bg-white border border-black px-3 py-1 text-[8px] font-bold uppercase tracking-[0.25em]">
                      Locked
                    </div>
                    <div className="font-bold text-lg uppercase tracking-tight">
                      Annual
                    </div>
                    <div className="text-[11px] mt-1 font-bold uppercase tracking-widest text-black/30">
                      Savings plan
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="p-8 sm:p-12 bg-white border border-black/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]"
                style={{ borderRadius: "var(--radius)" }}
              >
                <h2 className="font-mono text-[11px] font-bold uppercase tracking-widest mb-10 text-black flex items-center gap-3">
                  <span className="w-2 h-2 bg-black"></span>
                  Included Utilities
                </h2>

                <div className="space-y-4">
                  {selectedPlanData?.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="flex items-start gap-5 p-5 hover:bg-black/5 transition-all duration-300 border border-transparent hover:border-black/5"
                      style={{ borderRadius: "var(--radius)" }}
                    >
                      <div
                        className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 border border-black/10 bg-white shadow-sm"
                        style={{ borderRadius: "6px" }}
                      >
                        <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
                      </div>
                      <span className="text-sm font-medium leading-[1.6] text-black/80">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="lg:col-span-2">
              <div
                className="p-10 sticky top-12 bg-white border-2 border-black"
                style={{ borderRadius: "var(--radius)" }}
              >
                <h2 className="font-mono text-[11px] font-bold uppercase tracking-widest mb-10 text-black flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-black"></span>
                  Summary
                </h2>
                <div className="flex items-center gap-5 mb-10 pb-10 border-b border-black/5">
                  <div
                    className="w-16 h-16 flex items-center justify-center bg-black text-white shadow-xl shadow-black/10"
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-black leading-none">
                      {selectedPlanData?.name}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 mt-2">
                      Active collection
                    </p>
                  </div>
                </div>

                <div className="space-y-5 mb-10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black/40 font-bold uppercase tracking-widest text-[10px]">
                      Package
                    </span>
                    <span className="font-bold text-black">
                      {selectedPlanData?.priceDisplay}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black/40 font-bold uppercase tracking-widest text-[10px]">
                      Service Charge
                    </span>
                    <span className="font-bold text-black uppercase text-xs">
                      Free
                    </span>
                  </div>
                </div>

                <div className="mb-12 bg-black/[0.02] p-8 -mx-10 border-t border-b border-black/5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/40">
                      Total Due
                    </span>
                    <div className="text-right">
                      <span className="text-6xl font-black text-black tracking-tighter">
                        {selectedPlanData?.price === 0
                          ? "0"
                          : `${selectedPlanData?.price}`}
                      </span>
                      <span className="text-[10px] ml-3 font-bold uppercase tracking-widest text-black/40">
                        USD
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedPlanData?.price === 0 ? (
                    <Button
                      variant="white"
                      size="lg"
                      fullWidth
                      onClick={handleCheckout}
                      className="font-bold"
                    >
                      Continue with Free Plan
                    </Button>
                  ) : (
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full h-16 px-8 font-bold text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-black/90 active:scale-[0.98] bg-black text-white"
                      style={{ borderRadius: "var(--radius)" }}
                    >
                      {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                      {isProcessing ? "Authorizing..." : "Complete Order"}
                    </button>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-black/10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-black/40">
                      <Shield className="w-4 h-4 text-black" />
                      <span>Encrypted Transaction via Stripe</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-black/40">
                      <Zap className="w-4 h-4 text-black" />
                      <span>Instant deployment upon success</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-4">
                  <Link
                    href="/subscription"
                    className="text-xs transition-colors hover:underline text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    Compare Plans
                  </Link>
                  <span style={{ color: "var(--d-border)" }}>|</span>
                  <Link
                    href="/billing"
                    className="text-xs transition-colors hover:underline text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    Manage Billing
                  </Link>
                </div>
              </div>
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-sm text-[var(--text-secondary)]">
            Loading...
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
