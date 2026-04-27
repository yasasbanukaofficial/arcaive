"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const steps = [
  {
    week: "Phase 01",
    title: "Onboarding & Analysis",
    description: "Upload your CV. Our multi-agent swarm deconstructs your experience and identifies market-aligned achievements.",
    color: "bg-[#f9dbbd]",
  },
  {
    week: "Phase 02",
    title: "Discovery & Matching",
    description: "AI bots scan live job markets, matching you with high-signal roles that fit your exact profile and salary goals.",
    color: "bg-[#c3e6f0]",
  },
  {
    week: "Phase 03",
    title: "Tailored Submission",
    description: "Every application is sent with a bespoke, AI-optimized resume that bypasses ATS and catches human eyes.",
    color: "bg-[#f0e4c3]",
  },
  {
    week: "Phase 04",
    title: "Interview Prep",
    description: "Prepare with role-specific AI interviewers. Refine your pitch and technical answers until you're ready.",
    color: "bg-[#e0d6f5]",
  },
];

const HowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section
      id="howitworks"
      ref={containerRef}
      className="py-32 px-6 lg:px-12 bg-[#FAF9F6] relative overflow-hidden"
    >
      {/* Background soft glows */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-orange-100/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6 mb-32 max-w-[800px]"
        >
          <div className="flex items-center gap-3">
            <span className="label-mono">03 — Process</span>
          </div>
          <h2 className="h2 tracking-tight text-black">
            Lightning-quick from zero to hired.
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Progress Line */}
          <div className="hidden md:block absolute top-[44px] left-0 w-full h-[1px] bg-black/5" />
          <motion.div 
            style={{ scaleX }}
            className="hidden md:block absolute top-[44px] left-0 w-full h-[1px] bg-black origin-left z-20"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col items-start md:px-6 first:md:pl-0 last:md:pr-0"
              >
                <motion.div 
                  className={`w-fit px-3 py-1 rounded-full ${step.color} bg-opacity-30 border border-black/5 font-sans text-[11px] font-bold text-black uppercase tracking-wider mb-8 transition-all group-hover:scale-105`}
                >
                  {step.week}
                </motion.div>

                {/* Node */}
                <div className="hidden md:flex absolute top-[38px] left-6 first:left-0 w-3 h-3 rounded-full bg-white border border-black/20 z-30 items-center justify-center transition-all duration-500 group-hover:border-black group-hover:scale-110">
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="w-1.5 h-1.5 rounded-full bg-black" 
                  />
                </div>

                <div className="pt-0 md:pt-16 space-y-4">
                  <h3 className="font-sans text-[22px] font-medium text-black tracking-tight group-hover:translate-x-1 transition-transform">
                    {step.title}
                  </h3>
                  <p className="font-sans text-[16px] font-light text-black/50 leading-[1.6]">
                    {step.description}
                  </p>
                </div>

                {/* Mobile line */}
                {index !== steps.length - 1 && (
                  <div className="md:hidden absolute top-[40px] left-[6px] w-[1px] h-[calc(100%+40px)] bg-black/5" />
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
