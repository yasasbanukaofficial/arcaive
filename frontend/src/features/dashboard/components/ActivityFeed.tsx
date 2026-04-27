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
      className="p-8 border border-[#E8E6DE] bg-white transition-[border-color] duration-200"
      style={{ borderRadius: 0 }}
    >
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8E6DE]">
        <div>
          <h3 className="font-sans text-[18px] font-bold text-black uppercase tracking-tight">
            Recent Activity
          </h3>
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#888880] mt-1">
            Latest agent logs
          </p>
        </div>
        <button className="font-mono text-[11px] uppercase tracking-widest text-[#888880] hover:text-black transition-colors">
          [ VIEW_ALL ]
        </button>
      </div>

      <motion.div variants={dashboardStagger(0.04, 0)} className="space-y-2">
        {activities.map((activity, i) => {
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              className="flex items-start gap-4 p-4 border border-transparent hover:border-[#E8E6DE] hover:bg-[#F5F4EF] transition-[background-color,border-color] duration-200 group cursor-pointer"
              style={{ borderRadius: 0 }}
            >
              <div className="w-10 h-10 border border-[#E8E6DE] bg-[#F5F4EF] flex items-center justify-center shrink-0 group-hover:border-black transition-colors">
                <span className="font-mono text-[14px] text-black">→</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-sans text-[14px] font-bold text-black uppercase truncate tracking-tight">
                  {activity.title}
                </p>
                <p className="font-mono text-[11px] text-[#888880] uppercase tracking-tighter truncate mt-1">
                  {activity.description}
                </p>
              </div>

              <span className="font-mono text-[10px] text-[#888880] uppercase tracking-widest whitespace-nowrap mt-1">
                {activity.time}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
