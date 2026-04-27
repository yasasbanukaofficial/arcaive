"use client";

import { motion } from "framer-motion";
import {
  Hourglass,
  Feather,
  Target,
  BookOpen,
  Handshake,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  {
    title: "Time Returned",
    description: "Automate the routine and reclaim hours for what matters most.",
    icon: Hourglass,
  },
  {
    title: "Words with Ease",
    description: "Turn thoughts into polished writing — clear, natural, and fast.",
    icon: Feather,
  },
  {
    title: "Guided Focus",
    description: "Stay sharp with gentle nudges that keep distractions away.",
    icon: Target,
  },
  {
    title: "Instant Knowledge",
    description: "Condense research and insights into clarity within seconds.",
    icon: BookOpen,
  },
  {
    title: "Always Available",
    description: "Your silent partner, ready to help whenever you need it.",
    icon: Handshake,
  },
  {
    title: "Built-in Trust",
    description: "Protected by design — your data, your ideas, always secure.",
    icon: ShieldCheck,
  },
];

export default function Benefits() {
  return (
    <section
      id="benefits"
      className="py-32 px-6 lg:px-10 bg-black border-t border-white/[0.06]"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col gap-5 mb-20">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-[#D1FF00] tracking-[0.15em]">[06]</span>
            <div className="w-12 h-[1px] bg-white/10" />
            <span className="font-mono text-[11px] text-white/30 uppercase tracking-[0.15em]">
              Benefits
            </span>
            <span className="font-mono text-[11px] text-white/20">_</span>
          </div>
          <h2 className="font-sans text-[36px] sm:text-[48px] font-bold leading-tight tracking-[-0.03em] text-white uppercase">
            Invisible power<br />
            <span className="text-[#D1FF00]">at your side.</span>
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-white/[0.06]">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-10 border-r border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors group cursor-default"
              >
                <div className="w-12 h-12 border border-white/[0.08] flex items-center justify-center mb-8 group-hover:border-[#D1FF00]/30 transition-colors">
                  <Icon className="w-5 h-5 text-white/30 group-hover:text-[#D1FF00] transition-colors" />
                </div>
                <h4 className="font-sans text-[18px] font-bold text-white uppercase tracking-tight mb-3 group-hover:text-[#D1FF00] transition-colors">
                  {b.title}
                </h4>
                <p className="font-sans text-[14px] text-white/40 leading-relaxed">
                  {b.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
