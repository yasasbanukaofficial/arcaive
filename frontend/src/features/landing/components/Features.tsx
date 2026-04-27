"use client";

import { motion } from "framer-motion";
import { bounceIn, staggerContainer } from "@/components/animations/variants";
import Image from "next/image";
import SectionHeader from "@/components/layout/SectionHeader";

const features = [
  {
    title: "Multi-Agent Swarm",
    description:
      "Three specialized AI agents work in parallel. The Recruiter critiques, The Engineer optimizes technical depth, and The Editor polishes tone for perfection.",
    tag: "CV ANALYSIS",
  },
  {
    title: "Auto-Apply Intelligence",
    description:
      "Our AI Agent Bot searches job APIs, displays matches with scores, and automatically applies using hyper tailored CVs while you focus on interviews.",
    tag: "AI-POWERED",
  },
  {
    title: "Real-Time Agent Flow",
    description:
      "Watch your AI agents 'think' in real-time through an interactive React Flow visualization complete transparency in the discovery and refinement process.",
    tag: "LIVE FLOW",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-32 px-6 bg-white border-t border-[#E8E6DE]"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section Index & Label */}
        <div className="flex flex-col gap-4 mb-20">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-[#888880] uppercase tracking-widest">[02]</span>
            <div className="w-12 h-[1px] bg-[#E8E6DE]" />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#888880]">
            WHAT WE DO
          </p>
          <h2 className="font-sans text-[48px] font-bold leading-tight tracking-[-0.03em] text-black">
            The tools that <br />
            get you hired.
          </h2>
        </div>

        {/* Feature List (Numbered Rows) */}
        <div className="border-t border-[#E8E6DE]">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group flex flex-col md:flex-row items-start md:items-center py-10 px-6 border-b border-[#E8E6DE] hover:bg-[#F5F4EF] transition-colors cursor-default"
            >
              <span className="font-mono text-[32px] text-[#888880] md:w-32 mb-4 md:mb-0">
                0{index + 1}
              </span>
              
              <div className="flex-1 space-y-2">
                <h3 className="font-sans text-[24px] font-bold text-black uppercase tracking-tight">
                  {feature.title}
                </h3>
                <p className="font-sans text-[14px] text-[#888880] max-w-[600px]">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 md:mt-0">
                <span className="tag">{feature.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
