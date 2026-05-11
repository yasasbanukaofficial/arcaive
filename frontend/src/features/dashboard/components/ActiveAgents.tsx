"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, dashboardStagger } from "./animations";
import { DUMMY_AGENTS } from "@/features/dashboard/constants/mockData";


const agents = DUMMY_AGENTS;

export default function ActiveAgents() {
  return (
    <motion.div
      variants={fadeUp}
      className="p-10 bg-[var(--glass-bg)] border border-[var(--glass-border)]/[0.05] rounded-[32px] shadow-[var(--shadow-premium)] relative overflow-hidden"
    >
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[40px] pointer-events-none" />

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="font-sans text-[18px] font-medium text-[var(--text-primary)] tracking-tight">
              Active Agents
            </h3>
            <p className="font-sans text-[12px] text-[var(--text-secondary)] font-medium tracking-[0.05em]">
              Running workflows
            </p>
          </div>
        </div>
        <button className="font-sans text-[12px] font-bold tracking-[0.1em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Manage
          </button>
      </div>

      <motion.div variants={dashboardStagger(0.04, 0.1)} className="space-y-3">
        {agents.map((agent) => (
          <motion.div
            key={agent.name}
            variants={fadeUp}
            className="flex items-center gap-5 p-5 bg-[var(--bg-color)] border border-[var(--glass-border)]/[0.03] rounded-[24px] transition-all duration-500 hover:bg-[var(--glass-bg)] hover:shadow-[var(--shadow-premium)] hover:-translate-y-1 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full border border-[var(--glass-border)]/[0.05] flex items-center justify-center bg-[var(--glass-bg)] shrink-0 group-hover:border-[var(--glass-border)] transition-all duration-500 group-hover:scale-110">
              <span className="font-sans text-[16px] font-bold text-[var(--text-primary)] italic">
                {agent.name.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <p className="font-sans text-[15px] font-medium text-[var(--text-primary)] tracking-tight">
                  {agent.name}
                </p>
                <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-[var(--glass-border)] border border-[var(--glass-border)]">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    agent.status === "active" ? "bg-green-500 animate-pulse" : "bg-[var(--glass-border)]"
                  }`} />
                  <span className="font-sans text-[9px] font-bold tracking-widest text-[var(--text-secondary)] capitalize">
                    {agent.status}
                  </span>
                </div>
              </div>
              <p className="font-sans text-[13px] text-[var(--text-secondary)] truncate font-light">
                {agent.description}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="font-sans text-[22px] font-medium text-[var(--text-primary)] leading-none">
                {agent.tasks}
              </p>
                <p className="font-sans text-[9px] font-bold tracking-[0.1em] text-[var(--text-secondary)] capitalize">
                  Tasks
                </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
