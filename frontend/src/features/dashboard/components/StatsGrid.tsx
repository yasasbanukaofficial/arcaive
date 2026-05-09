"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, dashboardStagger } from "./animations";
import { DUMMY_STATS } from "@/features/dashboard/constants/mockData";

import { useUsageQuota } from "@/features/billing/hooks/useSubscription";
import { Activity, Zap, FileText, Bot } from "lucide-react";

export default function StatsGrid() {
  const { data: usage, isLoading } = useUsageQuota();

  const formatValue = (used: number, limit: number) => limit === -1 ? "Unlimited" : `${used}/${limit}`;
  const formatChange = (used: number, limit: number) => limit === -1 ? "∞" : `${Math.round((used / limit) * 100)}%`;

  const stats = [
    {
      label: "CV Analyses",
      value: usage ? formatValue(usage.cvAnalysisUsed, usage.cvAnalysisLimit) : "...",
      change: usage ? formatChange(usage.cvAnalysisUsed, usage.cvAnalysisLimit) : "0%",
      trending: "up" as const,
      icon: FileText,
    },
    {
      label: "Job Searches",
      value: usage ? formatValue(usage.jobSearchUsed, usage.jobSearchLimit) : "...",
      change: usage ? formatChange(usage.jobSearchUsed, usage.jobSearchLimit) : "0%",
      trending: "up" as const,
      icon: Zap,
    },
    {
      label: "Auto Applications",
      value: usage ? formatValue(usage.autoApplyUsed, usage.autoApplyLimit) : "...",
      change: usage ? formatChange(usage.autoApplyUsed, usage.autoApplyLimit) : "0%",
      trending: "up" as const,
      icon: Bot,
    },
    {
      label: "Interview Sessions",
      value: usage ? formatValue(usage.interviewUsed, usage.interviewLimit) : "...",
      change: usage ? formatChange(usage.interviewUsed, usage.interviewLimit) : "0%",
      trending: "up" as const,
      icon: Activity,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[200px] rounded-[32px] bg-[var(--glass-bg)] border border-[var(--glass-border)] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={dashboardStagger(0.06, 0.2)}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          variants={fadeUp}
          className={`relative group p-8 rounded-[32px] border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl oryzo-card-glow transition-all duration-700 hover:shadow-2xl hover:border-[var(--text-primary)] hover:-translate-y-1 cursor-default`}
        >
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-10">
              <div className="w-12 h-12 rounded-full border border-[var(--glass-border)] flex items-center justify-center bg-[var(--bg-color)] group-hover:scale-110 transition-transform duration-500">
                <stat.icon className="w-5 h-5 text-[var(--text-primary)]" />
              </div>
              <div
                className={`font-mono text-[10px] font-bold tracking-wider flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white`}
              >
                {stat.change}
              </div>
            </div>

            <div>
              <p className="font-display text-[42px] font-bold text-[var(--text-primary)] leading-none mb-4 tracking-tighter group-hover:scale-[1.02] transition-transform origin-left">
                {stat.value}
              </p>
              <p className="font-mono text-[11px] font-bold text-[var(--text-secondary)] tracking-widest capitalize">
                {stat.label}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
