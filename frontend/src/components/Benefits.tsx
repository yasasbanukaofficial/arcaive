"use client";

import { motion } from "framer-motion";
import { Hourglass, Feather, Target, BookOpen, Users, Shield } from "lucide-react";

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
    icon: Users,
  },
  {
    title: "Built-in Trust",
    description: "Protected by design — your data, your ideas, always secure.",
    icon: Shield,
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="py-32 px-6 bg-[#0a0a0a]">
      <div className="max-w-[1240px] mx-auto">
        <div className="mb-20">
          <span className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] block mb-4">• Benefits</span>
          <h2 className="text-[32px] md:text-[52px] font-medium tracking-[-0.03em] leading-[1.1] text-white">
            Invisible power at your side <br />
            <span className="text-white/40">delivering tangible benefits every day.</span>
          </h2>
        </div>

        <motion.div 
           initial="hidden"
           whileInView="show"
           viewport={{ once: true, margin: "-50px" }}
           variants={{
             hidden: { opacity: 0 },
             show: {
               opacity: 1,
               transition: {
                 staggerChildren: 0.1
               }
             }
           }}
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="bg-white/[0.02] border border-white/5 p-10 rounded-[32px] hover:bg-white/[0.04] transition-all duration-500 group"
            >
              <div className="w-12 h-12 rounded-2xl border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 bg-white/[0.01]">
                <b.icon className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl md:text-2xl font-medium text-white mb-4 tracking-tight">{b.title}</h3>
              <p className="text-white/40 font-medium leading-relaxed text-[15px]">{b.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
