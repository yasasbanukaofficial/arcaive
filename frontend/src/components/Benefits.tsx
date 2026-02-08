"use client";

import { motion } from "framer-motion";
import { item } from "@/components/animations/variants";
import {
  Hourglass,
  Feather,
  Target,
  BookOpen,
  Handshake,
  ShieldCheck,
} from "lucide-react";
import SectionHeader from "@/components/layout/SectionHeader";
import BenefitsCard from "@/components/ui/BenefitsCard";

const benefits = [
  {
    title: "Time Returned",
    description:
      "Automate the routine and reclaim hours for what matters most.",
    icon: Hourglass,
  },
  {
    title: "Words with Ease",
    description:
      "Turn thoughts into polished writing — clear, natural, and fast.",
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
    <section id="benefits" className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-[1240px] mx-auto">
        <div className="mb-20">
          <SectionHeader
            label="Benefits"
            title="Invisible power at your side"
            subtitle="delivering tangible benefits every day."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-5 border-t border-l border-white/10">
          {benefits.map((b, i) => (
            <div key={i} className="border-r border-b border-white/10">
              <motion.div
                variants={item}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="h-full"
              >
                <BenefitsCard
                  icon={b.icon}
                  title={b.title}
                  description={b.description}
                />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
