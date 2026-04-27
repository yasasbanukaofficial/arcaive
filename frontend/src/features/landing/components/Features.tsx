"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const features = [
  {
    title: "Multi-Agent Swarm",
    description:
      "Three specialized AI agents work in parallel. The Recruiter critiques, The Engineer optimizes technical depth, and The Editor polishes tone for perfection.",
    tags: ["CV ANALYSIS", "AI SWARM"],
  },
  {
    title: "Auto-Apply Intelligence",
    description:
      "Our AI Agent Bot searches job APIs, displays matches with scores, and automatically applies using hyper tailored CVs while you focus on interviews.",
    tags: ["AI-POWERED", "AUTOMATION"],
  },
  {
    title: "Real-Time Agent Flow",
    description:
      "Watch your AI agents 'think' in real-time through an interactive React Flow visualization — complete transparency in the discovery and refinement process.",
    tags: ["LIVE FLOW", "VISUAL"],
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-32 px-6 lg:px-10 bg-black border-t border-white/[0.06]"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col gap-5 mb-20">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-[#D1FF00] tracking-[0.15em]">[02]</span>
            <div className="w-12 h-[1px] bg-white/10" />
            <span className="font-mono text-[11px] text-white/30 uppercase tracking-[0.15em]">
              What we do
            </span>
            <span className="font-mono text-[11px] text-white/20">_</span>
          </div>
          <h2 className="font-sans text-[36px] sm:text-[48px] font-bold leading-tight tracking-[-0.03em] text-white uppercase">
            The tools that<br />
            <span className="text-[#D1FF00]">get you hired.</span>
          </h2>
        </div>

        {/* Feature Rows */}
        <div className="border-t border-white/[0.06]">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col md:flex-row items-start md:items-center py-10 px-0 md:px-6 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors cursor-default"
            >
              {/* Number */}
              <span className="font-mono text-[40px] font-bold text-[#D1FF00]/30 md:w-32 mb-4 md:mb-0 group-hover:text-[#D1FF00] transition-colors">
                0{index + 1}
              </span>

              {/* Content */}
              <div className="flex-1 space-y-3">
                <h3 className="font-sans text-[22px] sm:text-[26px] font-bold text-white uppercase tracking-tight group-hover:text-[#D1FF00] transition-colors">
                  {feature.title}
                </h3>
                <p className="font-sans text-[14px] sm:text-[15px] text-white/40 max-w-[600px] leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Tags + Arrow */}
              <div className="flex items-center gap-4 mt-6 md:mt-0">
                <div className="flex flex-wrap gap-2">
                  {feature.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <ArrowUpRight className="w-5 h-5 text-white/10 group-hover:text-[#D1FF00] transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
