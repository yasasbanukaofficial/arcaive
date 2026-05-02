"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, barGrow, dashboardStagger } from "./animations";
import { USAGE_DAYS, USAGE_DATA } from "@/features/dashboard/constants/mockData";
import { BarChart3 } from "lucide-react";

const days = USAGE_DAYS;
const data = USAGE_DATA;
const maxVal = Math.max(...data);

export default function UsageChart() {
  return (
    <motion.div
      variants={fadeUp}
      className="p-10 bg-[var(--glass-bg)] border border-[var(--glass-border)] oryzo-card-glow rounded-[32px] shadow-sm relative overflow-hidden"
    >
      {/* Background subtle mono glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-[var(--radius)] blur-[40px] pointer-events-none" />

      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[var(--bg-color)] flex items-center justify-center border border-[var(--glass-border)]">
            <BarChart3 className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <div>
            <h3 className="font-sans text-[18px] font-medium text-[var(--text-primary)] tracking-tight">
              API Usage
            </h3>
            <p className="font-sans text-[12px] text-[var(--text-secondary)] font-medium tracking-[0.05em]">
              Last 7 days
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[var(--glass-border)] rounded-full border border-[var(--glass-border)]">
            <span className="font-sans text-[10px] font-bold tracking-widest text-[var(--text-secondary)]">
              Total requests
            </span>
        </div>
      </div>

      <motion.div
        variants={dashboardStagger(0.06, 0.1)}
        className="flex items-end gap-3 h-56 px-2"
      >
        {data.map((value, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-6 group">
            <div className="w-full relative flex-1 flex items-end">
              <motion.div
                variants={barGrow}
                className="w-full relative rounded-t-[12px] overflow-hidden transition-all duration-500 group-hover:shadow-lg origin-bottom"
                style={{ height: `${(value / maxVal) * 100}%` }}
              >
                <div className="absolute inset-0 bg-[var(--text-secondary)]/10 border-t border-x border-[var(--glass-border)] group-hover:bg-gradient-to-t group-hover:from-white/20 group-hover:to-white/5 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[var(--text-primary)] transition-all group-hover:bg-white" />
              </motion.div>
              
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 translate-y-2 group-hover:translate-y-0">
                <span className="font-sans text-[11px] font-bold text-white bg-black px-3 py-1.5 rounded-full shadow-xl whitespace-nowrap tracking-widest">
                  {value} req
                </span>
              </div>
            </div>
            <span className="font-sans text-[10px] font-bold text-[var(--text-secondary)] tracking-widest transition-colors group-hover:text-[var(--text-primary)]">
              {days[i]}
            </span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
