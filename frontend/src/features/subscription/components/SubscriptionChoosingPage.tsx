"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Crown, Rocket, Sparkles, ArrowRight } from "lucide-react";
import { MOCK_PLANS } from "@/features/billing/constants/mockData";

const MONTHLY_PLANS = MOCK_PLANS.filter((p) => p.billingPeriod === "month");

const PLAN_CONFIG = {
  explorer: {
    icon: Sparkles,
    gradient: "from-slate-500/20 to-slate-600/10",
    accentColor: "var(--d-text-muted)",
  },
  strategist: {
    icon: Rocket,
    gradient: "from-violet-500/20 via-fuchsia-500/10 to-purple-500/20",
    accentColor: "var(--d-accent)",
  },
  architect: {
    icon: Crown,
    gradient: "from-amber-500/20 via-orange-500/10 to-yellow-500/20",
    accentColor: "#f59e0b",
  },
};

const PLAN_DESCRIPTIONS: Record<string, string> = {
  explorer: "Essential tools to kickstart your job search journey",
  strategist: "Advanced AI-powered features for serious job hunters",
  architect: "Unlimited everything for teams and power users",
};

export default function SubscriptionChoosingPage() {
  const router = useRouter();

  const handleSelect = (planId: string) => {
    router.push(`/subscription/checkout?plan=${planId}&billing=month`);
  };

  return (
    <div className="space-y-6">
      <motion.div
        variants={{
          show: {
            transition: { staggerChildren: 0.1 },
          },
        }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6"
      >
        {MONTHLY_PLANS.map((plan: any) => {
          const config = PLAN_CONFIG[plan.id as keyof typeof PLAN_CONFIG];
          const Icon = config?.icon || Sparkles;

          return (
            <motion.div
              key={plan.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className={`relative group rounded-2xl p-6 lg:p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                plan.isPopular ? "md:-mt-4 md:mb-[-16px]" : ""
              }`}
              style={{
                backgroundColor: "#ffffff",
                border: plan.isPopular ? "2px solid #000000" : "1px solid #e5e7eb",
              }}
            >
              {plan.isPopular && (
                <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent rounded-2xl pointer-events-none" />
              )}

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100"
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: "#000000" }}
                    />
                  </div>

                  {plan.isPopular && (
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: "#000000",
                        color: "#ffffff",
                      }}
                    >
                      Most Popular
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <h3
                    className="text-lg font-semibold tracking-tight mb-1 text-black"
                  >
                    {plan.name}
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-600">
                    {PLAN_DESCRIPTIONS[plan.id] || "Great value for your needs"}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="text-4xl lg:text-5xl font-bold tracking-tight text-black"
                    >
                      {plan.price === 0 ? "Free" : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-sm text-gray-600">
                        /mo
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-3 mb-8">
                  {plan.features.slice(0, 4).map((feature: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 bg-black"
                      >
                        <Check
                          className="w-3 h-3 text-white"
                        />
                      </div>
                      <span
                        className="text-xs leading-relaxed text-gray-700"
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                  {plan.features.length > 4 && (
                    <p className="text-xs pl-7 text-gray-500">
                      +{plan.features.length - 4} more features
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleSelect(plan.id)}
                  className="mt-auto w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-black text-white"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
