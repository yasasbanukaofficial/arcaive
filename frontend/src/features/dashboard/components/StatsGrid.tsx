"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { fadeUp, dashboardStagger } from "./animations";
import { DUMMY_STATS } from "@/features/dashboard/constants/mockData";

const stats = DUMMY_STATS;

export default function StatsGrid() {
  return (
    <motion.div
      variants={dashboardStagger(0.04, 0)}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {stats.map((stat) => {
        return (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            className="relative group p-8 border border-[#E8E6DE] bg-white transition-[background-color,border-color] duration-200 hover:bg-[#F5F4EF] hover:border-black"
            style={{ borderRadius: 0 }}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8E6DE]">
                <div className="w-10 h-10 border border-black flex items-center justify-center bg-[#F5F4EF]">
                  <span className="font-sans text-[16px] font-bold text-black uppercase">
                    {stat.label.charAt(0)}
                  </span>
                </div>
                <div
                  className={`font-mono text-[10px] font-bold uppercase tracking-widest ${
                    stat.trending === "up"
                      ? "text-black"
                      : "text-[#888880]"
                  }`}
                >
                  {stat.trending === "up" ? "↑" : "↓"} {stat.change}
                </div>
              </div>

              <p className="font-sans text-[32px] font-bold text-black leading-none mb-2">
                {stat.value}
              </p>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#888880]">
                {stat.label}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
