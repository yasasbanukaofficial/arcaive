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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="relative group rounded-2xl p-6 overflow-hidden transition-colors duration-300"
            style={{
              backgroundColor: "var(--d-surface)",
              border: "1px solid var(--d-border)",
            }}
          >
            <div
              className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`w-11 h-11 rounded-xl border ${stat.borderColor} flex items-center justify-center`}
                  style={{ backgroundColor: "var(--d-surface-hover)" }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: "var(--d-icon)" }}
                  />
                </div>
                <div
                  className={`flex items-center gap-1 text-[12px] font-medium ${
                    stat.trending === "up"
                      ? "text-emerald-400/70"
                      : "text-blue-400/70"
                  }`}
                >
                  {stat.trending === "up" ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  {stat.change}
                </div>
              </div>

              <p
                className="text-3xl font-semibold tracking-tight mb-1.5"
                style={{ color: "var(--d-text-primary)" }}
              >
                {stat.value}
              </p>
              <p
                className="text-[13px] font-medium"
                style={{ color: "var(--d-text-muted)" }}
              >
                {stat.label}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
