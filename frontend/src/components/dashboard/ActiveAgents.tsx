"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, Zap, Pause, MoreHorizontal } from "lucide-react";
import { fadeUp, dashboardStagger, pulseGlow } from "./animations";

const agents = [
  {
    name: "Recruiter Agent",
    description: "Screening roles & scoring fit",
    status: "active" as const,
    tasks: 24,
    icon: "🎯",
  },
  {
    name: "Resume Agent",
    description: "Tailoring CVs for applications",
    status: "active" as const,
    tasks: 18,
    icon: "📄",
  },
  {
    name: "Interview Prep",
    description: "Generating mock questions",
    status: "paused" as const,
    tasks: 7,
    icon: "🎤",
  },
];

export default function ActiveAgents() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-6 hover:border-white/[0.08] transition-colors duration-300"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-medium text-white/90 tracking-tight">
            Active Agents
          </h3>
          <p className="text-[12px] text-white/30 mt-0.5">
            Currently running workflows
          </p>
        </div>
        <button className="text-[12px] text-white/30 hover:text-white/60 transition-colors">
          Manage
        </button>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={dashboardStagger(0.08, 0.15)}
        className="space-y-3"
      >
        {agents.map((agent) => (
          <motion.div
            key={agent.name}
            variants={fadeUp}
            whileHover={{ x: 2, transition: { duration: 0.15 } }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:border-white/[0.06] hover:bg-white/[0.02] transition-all duration-300 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-lg flex-shrink-0">
              {agent.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-medium text-white/70 truncate">
                  {agent.name}
                </p>
                <div className="flex items-center gap-1">
                  {agent.status === "active" ? (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    />
                  ) : (
                    <Pause className="w-2.5 h-2.5 text-amber-400/60" />
                  )}
                  <span
                    className={`text-[10px] font-medium ${agent.status === "active" ? "text-emerald-400/60" : "text-amber-400/50"}`}
                  >
                    {agent.status}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-white/20 mt-0.5 truncate">
                {agent.description}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-[13px] font-medium text-white/50">
                {agent.tasks}
              </p>
              <p className="text-[10px] text-white/15">tasks</p>
            </div>

            <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1">
              <MoreHorizontal className="w-4 h-4 text-white/20" />
            </button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
