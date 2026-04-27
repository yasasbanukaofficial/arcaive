"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, dashboardStagger } from "./animations";
import { DUMMY_ACTIVITIES } from "@/features/dashboard/constants/mockData";
import { ListFilter } from "lucide-react";

const activities = DUMMY_ACTIVITIES;

export default function ActivityFeed() {
  return (
    <motion.div
      variants={fadeUp}
      className="p-10 bg-[var(--glass-bg)] border border-[var(--glass-border)] oryzo-card-glow rounded-[32px] shadow-sm relative overflow-hidden"
    >
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/10 rounded-full blur-[40px] pointer-events-none" />

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[var(--bg-color)] flex items-center justify-center border border-[var(--glass-border)]">
            <ListFilter className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <div>
            <h3 className="font-sans text-[18px] font-medium text-[var(--text-primary)] tracking-tight">
              Recent Activity
            </h3>
            <p className="font-sans text-[12px] text-[var(--text-secondary)] font-medium uppercase tracking-[0.05em]">
              Latest agent logs
            </p>
          </div>
        </div>
        <button className="font-sans text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          View All
        </button>
      </div>

      <motion.div variants={dashboardStagger(0.04, 0.1)} className="space-y-2">
        {activities.map((activity, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="flex items-center gap-5 p-5 transition-all duration-500 hover:bg-[var(--bg-color)] rounded-[24px] group cursor-pointer border border-transparent hover:border-[var(--glass-border)] group"
          >
            <div className="w-10 h-10 rounded-full border border-[var(--glass-border)] flex items-center justify-center shrink-0 bg-[var(--glass-bg)] group-hover:scale-110 group-hover:border-[var(--text-primary)] transition-all duration-500">
              <span className="font-sans text-[14px] font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors italic">→</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-sans text-[15px] font-medium text-[var(--text-primary)] tracking-tight group-hover:text-[var(--text-primary)] transition-colors">
                {activity.title}
              </p>
              <p className="font-sans text-[13px] text-[var(--text-secondary)] truncate font-light">
                {activity.description}
              </p>
            </div>

            <span className="font-sans text-[11px] text-[var(--text-secondary)] font-bold uppercase tracking-[0.05em] whitespace-nowrap">
              {activity.time}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
