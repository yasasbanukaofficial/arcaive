"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "98%", label: "SUCCESS RATE" },
  { value: "14k", label: "APPLICATIONS AUTOMATED" },
  { value: "48h", label: "AVG. TIME TO INTERVIEW" },
  { value: "3.2x", label: "SALARY INCREASE" },
];

export default function StatsSection() {
  return (
    <section className="section-cream py-24 px-6 lg:px-10 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`flex flex-col items-center justify-center py-14 px-6 ${
                i !== stats.length - 1 ? "md:border-r border-black/10" : ""
              } ${i % 2 === 0 && i < stats.length - 1 ? "border-r md:border-r-0" : ""} ${i < 2 ? "border-b md:border-b-0 border-black/10" : ""}`}
            >
              <motion.span
                className="font-sans text-[48px] md:text-[72px] font-bold leading-none tracking-[-0.04em] text-black"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              >
                {stat.value}
              </motion.span>
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-black/40 mt-3 text-center">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
