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
      className="p-8 border border-[#E8E6DE] bg-white transition-[border-color] duration-200"
      style={{ borderRadius: 0 }}
    >
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#E8E6DE]">
        <div>
          <h3 className="font-sans text-[18px] font-bold text-black uppercase tracking-tight">
            API Usage
          </h3>
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#888880] mt-1">
            Last 7 days
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-black border border-black px-2 py-0.5">
            [ TOTAL_REQUESTS ]
          </div>
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
              <div className="absolute inset-0 bg-black group-hover:bg-[#D4F461] transition-colors duration-200" style={{ borderRadius: 0 }} />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                <span className="font-mono text-[10px] font-bold text-white bg-black px-2 py-1 whitespace-nowrap border border-black uppercase tracking-widest">
                  {value}_REQ
                </span>
              </div>
            </motion.div>
            <span className="font-mono text-[10px] font-bold text-[#888880] uppercase tracking-widest">
              {days[i]}
            </span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
