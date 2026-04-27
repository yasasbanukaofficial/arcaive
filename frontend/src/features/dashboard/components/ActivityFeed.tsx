"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, dashboardStagger } from "./animations";
import { DUMMY_ACTIVITIES } from "@/features/dashboard/constants/mockData";

const activities = DUMMY_ACTIVITIES;

export default function ActivityFeed() {
  return (
    <motion.div
      variants={fadeUp}
      className="p-8 bg-[#0A0A0A] border border-white/[0.06]"
    >
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
        <div>
          <h3 className="font-sans text-[16px] font-bold text-white uppercase tracking-tight">
            Recent Activity
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/25 mt-1">
            Latest agent logs
          </p>
        </div>
        <button className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/30 hover:text-[#D1FF00] transition-colors">
          VIEW ALL
        </button>
      </div>

      <motion.div variants={dashboardStagger(0.04, 0)} className="space-y-1">
        {activities.map((activity, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="flex items-start gap-4 p-4 transition-all duration-200 hover:bg-white/[0.02] group cursor-pointer"
          >
            <div className="w-8 h-8 border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:border-[#D1FF00]/30 transition-colors">
              <span className="font-mono text-[12px] text-white/20 group-hover:text-[#D1FF00] transition-colors">→</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-sans text-[13px] font-bold text-white uppercase truncate tracking-tight group-hover:text-[#D1FF00] transition-colors">
                {activity.title}
              </p>
              <p className="font-sans text-[11px] text-white/25 truncate mt-1">
                {activity.description}
              </p>
            </div>

            <span className="font-mono text-[9px] text-white/15 uppercase tracking-[0.1em] whitespace-nowrap mt-1">
              {activity.time}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
