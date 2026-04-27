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
      className="py-32 px-6 lg:px-12 bg-white"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col gap-6 mb-24 max-w-[800px]">
          <div className="flex items-center gap-3">
            <span className="label-mono">04 — Benefits</span>
          </div>
          <h2 className="h2 tracking-tight text-black">
            Invisible power constantly at your side.
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-black/5">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="p-12 border-r border-b border-black/5 hover:bg-off-white transition-colors duration-500 group cursor-default"
              >
                <div className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center mb-8 bg-white group-hover:border-black/30 transition-colors duration-400 shadow-sm">
                  <Icon className="w-5 h-5 text-black/40 group-hover:text-black transition-colors duration-400" />
                </div>
                <h4 className="font-sans text-[20px] font-medium text-black tracking-tight mb-3">
                  {b.title}
                </h4>
                <p className="font-sans text-[15px] font-light text-black/60 leading-[1.6]">
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
