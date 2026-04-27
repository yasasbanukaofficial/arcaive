"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, dashboardStagger } from "./animations";
import { DUMMY_STATS } from "@/features/dashboard/constants/mockData";

const stats = DUMMY_STATS;

export default function StatsGrid() {
  return (
    <motion.div
      variants={dashboardStagger(0.04, 0)}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-white/[0.06]"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={fadeUp}
          className="relative group p-8 border-r border-b border-white/[0.06] bg-[#0A0A0A] transition-all duration-300 hover:bg-[#111111] cursor-default"
        >
          <div className="relative z-10">
            {/* Top row */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-9 h-9 border border-white/[0.08] flex items-center justify-center bg-transparent group-hover:border-[#D1FF00]/30 transition-colors">
                <span className="font-sans text-[14px] font-bold text-white/30 group-hover:text-[#D1FF00] transition-colors uppercase">
                  {stat.label.charAt(0)}
                </span>
              </div>
              <div
                className={`font-mono text-[10px] font-bold uppercase tracking-[0.1em] flex items-center gap-1 ${
                  stat.trending === "up" ? "text-[#D1FF00]" : "text-white/30"
                }`}
              >
                <span className={`w-0 h-0 border-l-[3px] border-r-[3px] border-transparent ${
                  stat.trending === "up"
                    ? "border-b-[5px] border-b-[#D1FF00]"
                    : "border-t-[5px] border-t-white/30"
                }`} />
                {stat.change}
              </div>
            </div>

            {/* Value */}
            <p className="font-sans text-[36px] font-bold text-white leading-none mb-2 tracking-tight">
              {stat.value}
            </p>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-white/25">
              {stat.label}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
