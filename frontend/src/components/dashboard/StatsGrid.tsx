"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Users,
  Clock,
} from "lucide-react";
import { fadeUp, dashboardStagger } from "./animations";

const stats = [
  {
    label: "Total API Requests",
    value: "12,847",
    change: "+14.2%",
    trending: "up" as const,
    icon: Activity,
    color: "from-blue-500/20 to-blue-600/5",
    borderColor: "border-blue-500/10",
  },
  {
    label: "Active Agents",
    value: "6",
    change: "+2",
    trending: "up" as const,
    icon: Zap,
    color: "from-amber-500/20 to-amber-600/5",
    borderColor: "border-amber-500/10",
  },
  {
    label: "Applications Sent",
    value: "342",
    change: "+28.5%",
    trending: "up" as const,
    icon: Users,
    color: "from-emerald-500/20 to-emerald-600/5",
    borderColor: "border-emerald-500/10",
  },
  {
    label: "Avg Response Time",
    value: "1.2s",
    change: "-8.3%",
    trending: "down" as const,
    icon: Clock,
    color: "from-purple-500/20 to-purple-600/5",
    borderColor: "border-purple-500/10",
  },
];

export default function StatsGrid() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={dashboardStagger(0.08, 0.2)}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="relative group rounded-2xl p-5 overflow-hidden transition-colors duration-300"
            style={{
              backgroundColor: "var(--d-surface)",
              border: "1px solid var(--d-border)",
            }}
          >
            {/* Subtle gradient bg */}
            <div
              className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-9 h-9 rounded-xl border ${stat.borderColor} flex items-center justify-center`}
                  style={{ backgroundColor: "var(--d-surface-hover)" }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: "var(--d-icon)" }}
                  />
                </div>
                <div
                  className={`flex items-center gap-1 text-[11px] font-medium ${
                    stat.trending === "up"
                      ? "text-emerald-400/70"
                      : "text-blue-400/70"
                  }`}
                >
                  {stat.trending === "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>

              <p
                className="text-2xl font-semibold tracking-tight mb-1"
                style={{ color: "var(--d-text-primary)" }}
              >
                {stat.value}
              </p>
              <p
                className="text-[12px] font-medium"
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
