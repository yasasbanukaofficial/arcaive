"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, barGrow, dashboardStagger } from "./animations";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const data = [72, 56, 63, 48, 38, 34, 42];
const maxVal = Math.max(...data);

export default function UsageChart() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="rounded-2xl bg-white/2 border border-white/5 p-6 hover:border-white/8 transition-colors duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[15px] font-medium text-white/90 tracking-tight">
            API Usage
          </h3>
          <p className="text-[12px] text-white/30 mt-0.5">Last 7 days</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500/60" />
            <span className="text-[11px] text-white/30">Total Requests</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={dashboardStagger(0.06, 0.3)}
        className="flex items-end gap-3 h-45 px-2"
      >
        {data.map((value, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              variants={barGrow}
              className="w-full relative group cursor-pointer"
              style={{ height: `${(value / maxVal) * 100}%` }}
            >
              <div className="absolute inset-0 rounded-lg bg-linear-to-t from-blue-500/40 to-blue-400/10 group-hover:from-blue-500/60 group-hover:to-blue-400/20 transition-all duration-300" />
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <span className="text-[11px] font-medium text-white bg-white/10 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 whitespace-nowrap">
                  {value} requests
                </span>
              </div>
            </motion.div>
            <span className="text-[10px] text-white/20 font-medium">
              {days[i]}
            </span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
