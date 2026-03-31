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
  Lock
} from "lucide-react";
import Button from "@/components/ui/Button";
import { dashboardStagger, fadeUp } from "@/components/animations/animations";
import { checkoutAPI } from "@/features/subscription/api/checkoutAPI";

const PLAN_CONFIG = {
  strategist: {
    icon: Rocket,
    gradient: "from-blue-500/12 via-purple-500/8 to-transparent",
    accentColor: "#8b5cf6",
    bgAccent: "rgba(59, 130, 246, 0.15)",
    borderAccent: "rgba(139, 92, 246, 0.6)",
    priceColor: "#ffffff",
  },
  architect: {
    icon: Crown,
    gradient: "from-blue-500/8 via-purple-500/5 to-transparent",
    accentColor: "#fbbf24",
    bgAccent: "rgba(245, 158, 11, 0.15)",
    borderAccent: "rgba(245, 158, 11, 0.6)",
    priceColor: "#ffffff",
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
    <div className="min-h-screen">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-[-10%] right-[5%] w-[60vw] h-[60vh] blur-[100px]"
          style={{
            background: `radial-gradient(circle, var(--d-glow-purple) 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[10%] w-[50vw] h-[50vh] blur-[100px]"
          style={{
            background: `radial-gradient(circle, var(--d-glow-blue) 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto space-y-8 px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial="hidden"
          animate="show"
          variants={dashboardStagger(0.05, 0.02)}
        >
          <motion.div variants={fadeUp} className="mb-8">
            <Link
              href="/subscription"
              className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80 mb-6 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Plans
            </Link>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="text-center sm:text-left">
                <h1
                  className="text-2xl sm:text-3xl lg:text-[36px] font-semibold text-white"
                >
                  Checkout
                </h1>
                <p className="text-sm sm:text-base mt-1 text-gray-400">
                  Complete your subscription
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            <motion.div variants={fadeUp} className="lg:col-span-3 space-y-6">
              <div
                className="rounded-2xl p-6 sm:p-8"
                style={{
                  backgroundColor: "var(--d-surface)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                <h2
                  className="text-lg font-semibold mb-6 text-white"
                >
                  Select Plan
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
                        className={`relative p-4 sm:p-5 rounded-xl cursor-pointer transition-all duration-200`}
                        style={{
                          backgroundColor: isSelected
                            ? config?.bgAccent
                            : "rgba(255, 255, 255, 0.04)",
                          border: `1px solid ${
                            isSelected ? config?.borderAccent : "rgba(255, 255, 255, 0.15)"
                          }`,
                        }}
                      >
                        {plan.isPopular && (
                          <div className="absolute -top-2.5 right-4">
                            <span
                              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                              style={{
                                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                                color: "#ffffff",
                              }}
                            >
                              Most Popular
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: isSelected
                                ? config?.bgAccent
                                : "rgba(255, 255, 255, 0.06)",
                              border: `1px solid ${
                                isSelected ? config?.borderAccent : "rgba(255, 255, 255, 0.1)"
                              }`,
                            }}
                          >
                            <PlanIcon
                              className="w-5 h-5"
                              style={{ color: config?.accentColor }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3
                                className="font-semibold text-white"
                              >
                                {plan.name}
                              </h3>
                            </div>
                            <p
                              className="text-xs mt-0.5 truncate text-gray-300"
                            >
                              {plan.description}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <div
                              className="text-xl font-bold text-white"
                            >
                              {plan.priceDisplay}
                            </div>
                            <div
                              className="text-xs text-gray-400"
                            >
                              /month
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all`}
                            style={{
                              backgroundColor: isSelected
                                ? config?.accentColor
                                : "transparent",
                              borderColor: isSelected
                                ? config?.accentColor
                                : "rgba(255, 255, 255, 0.3)",
                            }}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 text-black" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div
                className="rounded-2xl p-6 sm:p-8"
                style={{
                  backgroundColor: "var(--d-surface)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                <h2
                  className="text-lg font-semibold mb-6 text-white"
                >
                  Billing Period
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBillingChange("month")}
                    className={`p-4 rounded-xl transition-all text-left`}
                    style={{
                      backgroundColor:
                        billingPeriod === "month"
                          ? "rgba(59, 130, 246, 0.15)"
                          : "rgba(255, 255, 255, 0.04)",
                      border: `1px solid ${
                        billingPeriod === "month"
                          ? "rgba(59, 130, 246, 0.5)"
                          : "rgba(255, 255, 255, 0.15)"
                      }`,
                    }}
                  >
                    <div
                      className="font-semibold text-white"
                    >
                      Monthly
                    </div>
                    <div
                      className="text-sm mt-1 text-gray-300"
                    >
                      Billed monthly
                    </div>
                  </motion.button>

                  <motion.button
                    disabled
                    className={`p-4 rounded-xl transition-all text-left relative opacity-50 cursor-not-allowed`}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <div
                      className="absolute -top-2 right-3"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        color: "#9ca3af",
                      }}
                    >
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                        Coming soon
                      </span>
                    </div>
                    <div
                      className="font-semibold text-white"
                    >
                      Yearly
                    </div>
                    <div
                      className="text-sm mt-1 text-gray-400"
                    >
                      On the way
                    </div>
                  </motion.button>
                </div>
              </div>

              <div
                className="rounded-2xl p-6 sm:p-8"
                style={{
                  backgroundColor: "var(--d-surface)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                <h2
                  className="text-lg font-semibold mb-6 text-white"
                >
                  Features Included
                </h2>

                <div className="space-y-4">
                  {selectedPlanData?.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                          feature.included ? "" : "opacity-40"
                        }`}
                        style={{
                          backgroundColor: feature.included
                            ? "rgba(59, 130, 246, 0.2)"
                            : "rgba(255, 255, 255, 0.06)",
                        }}
                      >
                        <Check
                          className="w-3 h-3 text-white"
                        />
                      </div>
                      <span
                        className={`text-sm leading-relaxed ${
                          feature.included ? "" : "line-through opacity-50"
                        } text-gray-200`}
                      >
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="lg:col-span-2">
              <div
                className="rounded-2xl p-6 sm:p-8 sticky top-8"
                style={{
                  backgroundColor: "rgba(30, 30, 30, 0.95)",
                  border: `1px solid ${
                    selectedPlan === "strategist"
                      ? "rgba(59, 130, 246, 0.5)"
                      : selectedPlan === "architect"
                      ? "rgba(245, 158, 11, 0.5)"
                      : "rgba(255, 255, 255, 0.15)"
                  }`,
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: planConfig?.bgAccent }}
                  >
                    <Icon className="w-5 h-5" style={{ color: planConfig?.accentColor }} />
                  </div>
                  <div>
                    <h3
                      className="font-semibold text-white"
                    >
                      {selectedPlanData?.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {billingPeriod === "year" ? "Yearly billing" : "Monthly billing"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-b py-6 my-6 border-gray-600">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">
                        {selectedPlanData?.name} plan
                      </span>
                      <span className="text-white font-medium">
                        {selectedPlanData?.priceDisplay}/mo
                      </span>
                    </div>
                    {billingPeriod === "year" && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">
                          Billing period
                        </span>
                        <span className="text-white font-medium">
                          12 months
                        </span>
                      </div>
                    )}
                    {billingPeriod === "year" && savings > 0 && (
                      <div className="flex items-center justify-between">
                        <span style={{ color: "#60a5fa" }}>
                          Yearly discount
                        </span>
                        <span style={{ color: "#60a5fa" }}>
                          -€{savings}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-gray-300">
                      Total
                    </span>
                    <div className="text-right">
                      <span
                        className="text-3xl font-bold text-white"
                      >
                        {billingPeriod === "year"
                          ? `€${yearlyPrice}`
                          : selectedPlanData?.price === 0
                          ? "Free"
                          : `€${selectedPlanData?.price}`}
                      </span>
                      {billingPeriod === "year" && (
                        <span
                          className="text-sm ml-1 text-gray-400"
                        >
                          /year
                        </span>
                      )}
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
                      className="font-semibold"
                    >
                      Continue with Free Plan
                    </Button>
                  ) : (
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full h-12 px-6 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                      {isProcessing ? "Processing..." : "Complete Purchase"}
                    </button>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-600">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <Shield className="w-3.5 h-3.5 text-gray-400" />
                      <span>Secure checkout powered by Stripe</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <Zap className="w-3.5 h-3.5 text-gray-400" />
                      <span>Cancel anytime, no questions asked</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                      <span>Your data is encrypted and secure</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-4">
                  <Link
                    href="/subscription"
                    className="text-xs transition-colors hover:underline text-gray-400 hover:text-gray-200"
                  >
                    Compare Plans
                  </Link>
                  <span className="text-gray-600">|</span>
                  <Link
                    href="/billing"
                    className="text-xs transition-colors hover:underline text-gray-400 hover:text-gray-200"
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
          <div className="animate-pulse text-sm text-gray-400">
            Loading...
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
