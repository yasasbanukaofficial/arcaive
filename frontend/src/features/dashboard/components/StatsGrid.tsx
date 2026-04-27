"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, dashboardStagger } from "./animations";
import { DUMMY_STATS } from "@/features/dashboard/constants/mockData";

const stats = DUMMY_STATS;

const accentColors = [
  "group-hover:bg-white/5",
  "group-hover:bg-white/5",
  "group-hover:bg-white/5",
  "group-hover:bg-white/5",
];

export default function StatsGrid() {
  return (
    <motion.div
      variants={dashboardStagger(0.06, 0.2)}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      {stats.map((stat, i) => (
          <motion.div
          key={stat.label}
          variants={fadeUp}
          className={`relative group p-8 rounded-[32px] border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl oryzo-card-glow transition-all duration-700 hover:shadow-2xl hover:border-[var(--text-primary)] hover:-translate-y-1 cursor-default`}
        >
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Top row */}
            <div className="flex items-center justify-between mb-10">
              <div className="w-12 h-12 rounded-full border border-[var(--glass-border)] flex items-center justify-center bg-[var(--bg-color)] group-hover:scale-110 transition-transform duration-500">
                <span className="font-display text-[16px] font-bold text-[var(--text-primary)] italic">
                  {stat.label.charAt(0)}
                </span>
              </div>
              <div
                className={`font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 px-3 py-1 rounded-full ${
                  stat.trending === "up" ? "bg-white/10 text-white" : "bg-[var(--glass-border)] text-[var(--text-secondary)]"
                }`}
              >
                {stat.change}
              </div>
            </div>

            {/* Value */}
            <div>
              <p className="font-display text-[48px] font-bold text-[var(--text-primary)] leading-none mb-4 tracking-tighter group-hover:scale-[1.02] transition-transform origin-left">
                {stat.value}
              </p>
              <p className="font-mono text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
