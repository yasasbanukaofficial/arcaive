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
    gradient: "bg-[var(--glass-bg)]/5",
    accentColor: "var(--d-text-muted)",
  },
  strategist: {
    icon: Rocket,
    gradient: "bg-[var(--glass-bg)]/5",
    accentColor: "var(--d-accent)",
  },
  architect: {
    icon: Crown,
    gradient: "bg-[var(--glass-bg)]/5",
    accentColor: "#000",
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
          return (
            <motion.div
              key={plan.id}
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1 },
              }}
              className={`relative group p-10 flex flex-col transition-[background-color,border-color] duration-200 cursor-pointer border ${
                plan.isPopular ? "bg-[var(--glass-border)] border-[var(--glass-border)] border-2" : "bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--glass-border)]"
              }`}
              style={{ borderRadius: 0 }}
              onClick={() => handleSelect(plan.id)}
            >
              {plan.isPopular && (
                <div className="absolute top-6 right-6 bg-black px-2 py-1">
                  <span className="font-mono text-[10px] text-white font-bold uppercase tracking-widest">
                    SELECTED
                  </span>
                </div>
              )}

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-10">
                  <div className="w-12 h-12 border border-[var(--glass-border)] flex items-center justify-center bg-[var(--glass-bg)] mb-6">
                    <span className="font-sans text-[20px] font-bold text-[var(--text-primary)] uppercase">{plan.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-sans text-[20px] font-bold text-[var(--text-primary)] uppercase tracking-tight mb-2">
                    {plan.name}
                  </h3>
                  <p className="font-mono text-[11px] text-[var(--text-secondary)] uppercase tracking-widest">
                    {PLAN_DESCRIPTIONS[plan.id] || "Great value for your needs"}
                  </p>
                </div>

                <div className="mb-10">
                  <div className="flex items-baseline gap-1">
                    <span className="font-sans text-[48px] font-bold text-[var(--text-primary)] tracking-tighter">
                      {plan.price === 0 ? "0€" : `€${plan.price}`}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
                      /month
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-4 mb-10">
                  <div className="h-[1px] bg-[#E8E6DE] w-full" />
                  <ul className="space-y-4">
                    {plan.features.slice(0, 4).map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 font-sans text-[14px] text-[var(--text-primary)]">
                        <span className="text-[var(--text-secondary)]">—</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-widest pl-7">
                        + {plan.features.length - 4} MORE_FEATURES
                      </li>
                    )}
                  </ul>
                </div>

                <button
                  className="btn-primary w-full"
                >
                  GET_STARTED
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
