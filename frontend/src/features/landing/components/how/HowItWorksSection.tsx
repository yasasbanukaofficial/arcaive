"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    week: "WEEK 01",
    title: "Onboarding & Analysis",
    description: "Upload your CV. Our multi-agent swarm deconstructs your experience and identifies market-aligned achievements.",
  },
  {
    week: "WEEK 02",
    title: "Discovery & Matching",
    description: "AI bots scan live job markets, matching you with high-signal roles that fit your exact profile and salary goals.",
  },
  {
    week: "WEEK 03",
    title: "Tailored Submission",
    description: "Every application is sent with a bespoke, AI-optimized resume that bypasses ATS and catches human eyes.",
  },
  {
    week: "WEEK 04",
    title: "Interview Prep",
    description: "Prepare with role-specific AI interviewers. Refine your pitch and technical answers until you're ready to land it.",
  },
];

const HowItWorksSection = () => {
  return (
    <section
      id="howitworks"
      className="py-32 px-6 lg:px-10 bg-black border-t border-white/[0.06]"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col gap-5 mb-20">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-[#D1FF00] tracking-[0.15em]">[05]</span>
            <div className="w-12 h-[1px] bg-white/10" />
            <span className="font-mono text-[11px] text-white/30 uppercase tracking-[0.15em]">
              How it works
            </span>
            <span className="font-mono text-[11px] text-white/20">_</span>
          </div>
          <h2 className="font-sans text-[36px] sm:text-[48px] font-bold leading-tight tracking-[-0.03em] text-white uppercase">
            Lightning-quick<br />
            <span className="text-[#D1FF00]">from zero to hired.</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative mt-16">
          {/* Horizontal Line */}
          <div className="hidden md:block absolute top-[44px] left-0 w-full h-[1px] bg-white/[0.08]" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-0">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative flex flex-col items-start md:px-6 first:md:pl-0 last:md:pr-0"
              >
                <span className="font-mono text-[11px] text-[#D1FF00]/60 mb-8 uppercase tracking-[0.2em]">
                  {step.week}
                </span>

                {/* Node */}
                <div className="hidden md:flex absolute top-[40px] left-6 first:left-0 w-3 h-3 bg-black border border-[#D1FF00]/40 z-10 items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#D1FF00]" />
                </div>

                <div className="pt-0 md:pt-12">
                  <h3 className="font-sans text-[20px] font-bold text-white mb-4 uppercase tracking-tight">
                    {step.title}
                  </h3>
                  <p className="font-sans text-[14px] text-white/40 leading-[1.7]">
                    {step.description}
                  </p>
                </div>

                {/* Mobile line */}
                {index !== steps.length - 1 && (
                  <div className="md:hidden absolute top-[24px] left-[6px] w-[1px] h-[calc(100%+24px)] bg-white/[0.08]" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
