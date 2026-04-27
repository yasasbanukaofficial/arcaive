"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, dashboardStagger } from "./animations";
import { DUMMY_STATS } from "@/features/dashboard/constants/mockData";

const stats = DUMMY_STATS;

const accentColors = [
  "group-hover:bg-blue-200/20",
  "group-hover:bg-orange-200/20",
  "group-hover:bg-green-200/20",
  "group-hover:bg-purple-200/20",
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
          className={`relative group p-8 rounded-[32px] border border-black/[0.03] bg-white transition-all duration-700 hover:shadow-2xl hover:-translate-y-1 cursor-default overflow-hidden`}
        >
          {/* Accent glow on hover */}
          <div className={`absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[60px] pointer-events-none ${accentColors[i % accentColors.length]}`} />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Top row */}
            <div className="flex items-center justify-between mb-10">
              <div className="w-12 h-12 rounded-full border border-black/[0.05] flex items-center justify-center bg-[#FAF9F6] group-hover:scale-110 transition-transform duration-500">
                <span className="font-sans text-[16px] font-bold text-black italic">
                  {stat.label.charAt(0)}
                </span>
              </div>
              <div
                className={`font-sans text-[12px] font-bold tracking-wider flex items-center gap-1.5 px-3 py-1 rounded-full ${
                  stat.trending === "up" ? "bg-green-50 text-green-600" : "bg-black/[0.02] text-black/40"
                }`}
              >
                {stat.change}
              </div>
            </div>

            {/* Value */}
            <div>
              <p className="font-sans text-[48px] font-medium text-black leading-none mb-4 tracking-tighter group-hover:scale-[1.02] transition-transform origin-left">
                {stat.value}
              </p>
              <p className="font-sans text-[14px] font-bold text-black/30 uppercase tracking-[0.1em]">
                {stat.label}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
