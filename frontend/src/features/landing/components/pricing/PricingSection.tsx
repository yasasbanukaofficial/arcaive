"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/components/animations/variants";
import PricingCard from "./PricingCard";
import SectionHeader from "@/components/layout/SectionHeader";

const PricingSection = () => {
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
      className="py-20 sm:py-28 bg-[#0a0a0a]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer(0.1, 0.1)}
          className="text-left mb-12 sm:mb-16"
        >
          <SectionHeader
            label="Pricing"
            title="Simple, transparent"
            subtitle="pricing."
          />
          <p className="text-white/40 text-base sm:text-lg max-w-xl mt-4">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer(0.15, 0.1)}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
