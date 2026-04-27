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
    <section className="bg-[#111111] text-white py-20 px-6 border-y border-[#222]">
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className={`flex flex-col items-center justify-center py-10 px-6 ${
              i !== stats.length - 1 ? "md:border-r border-[#222]" : ""
            } ${i % 2 === 0 ? "border-r md:border-r-0" : ""} ${i < 2 ? "border-b md:border-b-0" : ""}`}
          >
            <span className="font-sans text-[48px] md:text-[64px] font-bold leading-tight tracking-tight">
              {stat.value}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#888880] mt-2">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
