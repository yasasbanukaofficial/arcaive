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
      className="rounded-2xl p-7 transition-colors duration-200"
      style={{
        backgroundColor: "var(--d-surface)",
        border: "1px solid var(--d-border)",
      }}
    >
      <div className="flex items-center justify-between mb-7">
        <div>
          <h3
            className="text-[17px] font-medium tracking-tight"
            style={{ color: "var(--d-text-primary)" }}
          >
            API Usage
          </h3>
          <p
            className="text-[13px] mt-0.5"
            style={{ color: "var(--d-text-muted)" }}
          >
            Last 7 days
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500/60" />
            <span
              className="text-[12px]"
              style={{ color: "var(--d-text-muted)" }}
            >
              Total Requests
            </span>
          </div>
        </div>
      </div>
      <motion.div
        variants={dashboardStagger(0.04, 0)}
        className="flex items-end gap-4 h-52 px-3"
      >
        {data.map((value, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              variants={barGrow}
              className="w-full relative group cursor-pointer"
              style={{ height: `${(value / maxVal) * 100}%` }}
            >
              <div className="absolute inset-0 rounded-lg bg-linear-to-t from-blue-500/40 to-blue-400/10 group-hover:from-blue-500/60 group-hover:to-blue-400/20 transition-all duration-200" />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                <span
                  className="text-[12px] font-medium backdrop-blur-md px-2.5 py-1.5 rounded-md whitespace-nowrap"
                  style={{
                    color: "var(--d-text-primary)",
                    backgroundColor: "var(--d-surface-active)",
                    border: "1px solid var(--d-border-hover)",
                  }}
                >
                  {value} requests
                </span>
              </div>
            </motion.div>
            <span
              className="text-[12px] font-medium"
              style={{ color: "var(--d-text-muted)" }}
            >
              {days[i]}
            </span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
