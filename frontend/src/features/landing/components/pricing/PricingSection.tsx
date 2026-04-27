"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/components/animations/variants";
import PricingCard from "./PricingCard";
import SectionHeader from "@/components/layout/SectionHeader";

const PricingSection = () => {
  const router = useRouter();
  const [isYearly, setIsYearly] = React.useState(false);

  const planIdMap: Record<string, string> = {
    Explorer: "explorer",
    Strategist: "strategist",
    Architect: "architect",
  };

  const handlePlanSelect = (planName: string) => {
    const planId = planIdMap[planName];
    if (planId) {
      router.push(`/subscription/checkout?plan=${planId}&billing=${isYearly ? "year" : "month"}`);
    }
  };

  const pricingPlans = [
    {
      plan: "Explorer",
      price: 0,
      description:
        "Essential AI tools to get started with AI-powered job hunting.",
      buttonText: "Start for Free",
      features: [
        "3 CV analyses/month",
        "1 mock interview/month",
        "5 job results/set",
        "Manual job input",
        "1 CV version stored",
      ],
    },
    {
      plan: "Strategist",
      price: 12,
      description:
        "Advanced AI tools for serious job seekers who want to scale.",
      buttonText: "Upgrade to Strategist",
      popular: true,
      features: [
        "20 CV analyses/month",
        "15 mock interviews/month",
        "20 job results/set",
        "10 auto-applications/month",
        "AI CV rewriting",
        "5 CV versions stored",
        "Agent transparency",
      ],
    },
    {
      plan: "Architect",
      price: 29,
      description:
        "Unlimited access with priority processing for maximum productivity.",
      buttonText: "Get Architect",
      features: [
        "Unlimited CV analyses",
        "Unlimited mock interviews",
        "50 job results/set",
        "Unlimited auto-apply",
        "Priority AI queue",
        "Unlimited CV versions",
        "Early feature access",
      ],
    },
  ];

  return (
    <section
      id="pricing"
      className="py-32 px-6 bg-white border-t border-[#E8E6DE]"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] text-[#888880] uppercase tracking-widest">[04]</span>
              <div className="w-12 h-[1px] bg-[#E8E6DE]" />
            </div>
            <h2 className="font-sans text-[48px] font-bold leading-tight tracking-[-0.03em] text-black">
              Flexible pricing <br />
              for every stage.
            </h2>
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-8 pb-2">
            <button
              onClick={() => setIsYearly(false)}
              className={`font-mono text-[11px] uppercase tracking-widest transition-[color,border-color] duration-200 pb-1 border-b ${
                !isYearly ? "text-black border-black" : "text-[#888880] border-transparent"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`font-mono text-[11px] uppercase tracking-widest transition-[color,border-color] duration-200 pb-1 border-b ${
                isYearly ? "text-black border-black" : "text-[#888880] border-transparent"
              }`}
            >
              Annual (-20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#E8E6DE]">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`relative ${index !== 2 ? "md:border-r border-[#E8E6DE]" : ""} border-b md:border-b-0 border-[#E8E6DE]`}>
              <PricingCard {...plan} isYearly={isYearly} onSelect={handlePlanSelect} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
