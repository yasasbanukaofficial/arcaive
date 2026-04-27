"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, barGrow, dashboardStagger } from "./animations";
import { USAGE_DAYS, USAGE_DATA } from "@/features/dashboard/constants/mockData";

const days = USAGE_DAYS;
const data = USAGE_DATA;
const maxVal = Math.max(...data);

export default function UsageChart() {
  return (
    <motion.div
      variants={fadeUp}
      className="p-8 bg-[#0A0A0A] border border-white/[0.06]"
    >
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/[0.06]">
        <div>
          <h3 className="font-sans text-[16px] font-bold text-white uppercase tracking-tight">
            API Usage
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/25 mt-1">
            Last 7 days
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#D1FF00] border border-[#D1FF00]/30 px-3 py-1">
            TOTAL REQUESTS
          </span>
        </div>
      </div>

      <motion.div
        variants={dashboardStagger(0.04, 0)}
        className="flex items-end gap-3 h-52 px-1"
      >
        {data.map((value, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-4">
            <motion.div
              variants={barGrow}
              className="w-full relative group cursor-pointer"
              style={{ height: `${(value / maxVal) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/[0.08] group-hover:bg-[#D1FF00] transition-colors duration-300" />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <span className="font-mono text-[10px] font-bold text-black bg-[#D1FF00] px-2 py-1 whitespace-nowrap uppercase tracking-[0.1em]">
                  {value}
                </span>
              </div>
            </motion.div>
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.1em]">
              {days[i]}
            </span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
