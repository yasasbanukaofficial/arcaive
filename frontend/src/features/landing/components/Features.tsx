"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const features = [
  {
    title: "Multi-Agent Swarm",
    description:
      "Three specialized AI agents work in parallel. The Recruiter critiques, The Engineer optimizes technical depth, and The Editor polishes tone for perfection.",
    tags: ["CV Analysis", "AI Swarm"],
    hoverColor: "hover:bg-[#f9dbbd]/10",
  },
  {
    title: "Auto-Apply Intelligence",
    description:
      "Our AI Agent Bot searches job APIs, displays matches with scores, and automatically applies using hyper-tailored CVs while you focus on interviews.",
    tags: ["Automation", "Matching"],
    hoverColor: "hover:bg-[#c3e6f0]/10",
  },
  {
    title: "Real-Time Agent Flow",
    description:
      "Watch your AI agents 'think' in real-time through an interactive React Flow visualization — complete transparency in the discovery and refinement process.",
    tags: ["Live Flow", "Visual"],
    hoverColor: "hover:bg-[#f0e4c3]/10",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative py-32 px-6 lg:px-12 bg-white"
    >
      {/* Background soft glow */}
      <div className="absolute top-[20%] right-0 w-[400px] h-[400px] bg-[#c3e6f0]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6 mb-24 max-w-[800px]"
        >
          <div className="flex items-center gap-3">
            <span className="label-mono">01 — Services</span>
          </div>
          <h2 className="h2 tracking-tight text-black">
            The intelligent tools that secure your next position.
          </h2>
        </motion.div>

        {/* Feature Rows */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.2 }}
          className="border-t border-black/10"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
              }}
              className={`group flex flex-col md:flex-row items-start md:items-center py-12 px-6 -mx-6 md:px-8 md:-mx-8 border-b border-black/10 transition-colors duration-500 rounded-2xl cursor-default ${feature.hoverColor}`}
            >
              {/* Number */}
              <div className="font-sans text-[24px] font-light text-black/30 md:w-24 mb-6 md:mb-0 group-hover:text-black/60 transition-colors">
                (0{index + 1})
              </div>

              {/* Content */}
              <div className="flex-1 md:pr-12">
                <h3 className="font-sans text-[28px] sm:text-[32px] font-medium text-black tracking-tight mb-3">
                  {feature.title}
                </h3>
                <p className="font-sans text-[16px] sm:text-[18px] text-black/60 max-w-[600px] leading-[1.6] font-light">
                  {feature.description}
                </p>
              </div>

              {/* Tags + Arrow */}
              <div className="flex items-center gap-6 mt-8 md:mt-0">
                <div className="flex flex-wrap gap-3">
                  {feature.tags.map((tag) => (
                    <span key={tag} className="tag bg-white shadow-sm group-hover:border-black/20 transition-colors">{tag}</span>
                  ))}
                </div>
                <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center bg-white shadow-sm group-hover:bg-black group-hover:text-white transition-all duration-400 transform group-hover:scale-105">
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
