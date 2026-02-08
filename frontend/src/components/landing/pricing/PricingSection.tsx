"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import PricingCard from "./PricingCard";
import SectionHeader from "@/components/layout/SectionHeader";

const PricingSection: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  const pricingPlans = [
    {
      plan: "Starter",
      price: 0,
      description:
        "Perfect to explore AI with essential tools for individuals and small projects.",
      buttonText: "Start for Free",
      features: [
        "Basic access to AI core",
        "Limited prompts per month",
        "Community support",
      ],
    },
    {
      plan: "Pro",
      price: 29,
      description:
        "Advanced features and flexibility to scale productivity and handle bigger workloads.",
      buttonText: "Upgrade to Pro",
      popular: true,
      features: [
        "Unlimited AI prompts",
        "Priority response time",
        "Early access to new models",
      ],
    },
    {
      plan: "Lifetime",
      price: "Custom",
      description:
        "Full power with custom options, priority support, and team-ready collaboration.",
      buttonText: "Contact Sales",
      features: [
        "Dedicated workspace",
        "Advanced model tuning",
        "Premium support & SLA",
      ],
    },
  ];

  return (
    <section
      id="pricing"
      className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 bg-[#0a0a0a]"
    >
      <div className="max-w-[1240px] mx-auto">
        <div className="text-left mb-6 sm:mb-8 md:mb-10">
          <SectionHeader
            label="Pricing Plans"
            title="Simple, transparent"
            subtitle="pricing."
          />
          <p className="text-white/40 text-sm sm:text-base md:text-lg max-w-2xl font-medium leading-relaxed tracking-tight">
            Choose the plan that best fits your needs and start your journey
            with Message today.
          </p>
        </div>

        <div className="mb-6 sm:mb-8 flex items-center justify-center">
          <div className="mt-2 sm:mt-4 flex items-center gap-3 sm:gap-4">
            <span
              className={`text-[13px] sm:text-sm transition-colors cursor-pointer ${!isYearly ? "text-white" : "text-gray-500"}`}
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="w-10 sm:w-11 h-[22px] sm:h-6 rounded-full bg-white/10 relative transition-colors hover:bg-white/20"
            >
              <motion.div
                initial={false}
                animate={{ x: isYearly ? 18 : 0 }}
                className="absolute top-[3px] sm:top-1 left-1 w-4 h-4 rounded-full bg-white"
              />
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <span
                className={`text-[13px] sm:text-sm transition-colors cursor-pointer ${isYearly ? "text-white" : "text-gray-500"}`}
                onClick={() => setIsYearly(true)}
              >
                Yearly
              </span>
              <span className="text-[9px] sm:text-[10px] bg-white/5 border border-white/10 px-1.5 sm:px-2 py-0.5 rounded-full text-white/60">
                20% OFF
              </span>
            </div>
          </div>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} {...plan} isYearly={isYearly} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
