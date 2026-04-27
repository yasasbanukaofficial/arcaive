"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { bounceIn, staggerContainer } from "@/components/animations/variants";
import HowItWorksVisual from "./HowItWorksVisual";
import HowItWorksStepper from "./HowItWorksStepper";
import SectionHeader from "@/components/layout/SectionHeader";
import { MessageSquare, Sparkles, CheckCircle2 } from "lucide-react";

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
    title: "Mock Interview Prep",
    description: "Prepare with role-specific AI interviewers. Refine your pitch and technical answers until you're ready to land it.",
  },
];

const HowItWorksSection = () => {
  return (
    <section
      id="howitworks"
      className="py-32 px-6 bg-white border-t border-[#E8E6DE]"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section Index & Label */}
        <div className="flex flex-col gap-4 mb-20">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-[#888880] uppercase tracking-widest">[03]</span>
            <div className="w-12 h-[1px] bg-[#E8E6DE]" />
          </div>
          <h2 className="font-sans text-[48px] font-bold leading-tight tracking-[-0.03em] text-black">
            Lightning-quick <br />
            from zero to hired.
          </h2>
        </div>

        {/* Timeline Layout */}
        <div className="relative mt-24">
          {/* Horizontal Line (Desktop) */}
          <div className="hidden md:block absolute top-[44px] left-0 w-full h-[1px] bg-[#E8E6DE]" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-start">
                <span className="font-mono text-[11px] text-[#888880] mb-8 uppercase tracking-widest">
                  {step.week}
                </span>

                {/* Node Circle (Desktop) */}
                <div className="hidden md:block absolute top-[40px] left-0 w-2 h-2  bg-black z-10" />

                <div className="pt-0 md:pt-12">
                  <h3 className="font-sans text-[20px] font-bold text-black mb-4 uppercase">
                    {step.title}
                  </h3>
                  <p className="font-sans text-[14px] text-[#888880] leading-[1.6]">
                    {step.description}
                  </p>
                </div>

                {/* Vertical Line (Mobile) */}
                {index !== steps.length - 1 && (
                  <div className="md:hidden absolute top-[24px] left-[4px] w-[1px] h-[calc(100%+24px)] bg-[#E8E6DE]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
