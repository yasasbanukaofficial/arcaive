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
      className="rounded-2xl p-6 transition-colors duration-300"
      style={{
        backgroundColor: "var(--d-surface)",
        border: "1px solid var(--d-border)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3
            className="text-[15px] font-medium tracking-tight"
            style={{ color: "var(--d-text-primary)" }}
          >
            Active Agents
          </h3>
          <p
            className="text-[12px] mt-0.5"
            style={{ color: "var(--d-text-muted)" }}
          >
            Currently running workflows
          </p>
        </div>
        <button
          className="text-[12px] transition-colors"
          style={{ color: "var(--d-text-tertiary)" }}
        >
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
            className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group cursor-pointer"
            style={{
              backgroundColor: "var(--d-surface)",
              border: "1px solid var(--d-border-subtle)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{
                backgroundColor: "var(--d-surface-hover)",
                border: "1px solid var(--d-border)",
              }}
            >
              {agent.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p
                  className="text-[13px] font-medium truncate"
                  style={{ color: "var(--d-text-secondary)" }}
                >
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
              <p
                className="text-[11px] mt-0.5 truncate"
                style={{ color: "var(--d-text-muted)" }}
              >
                {agent.description}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <p
                className="text-[13px] font-medium"
                style={{ color: "var(--d-text-tertiary)" }}
              >
                {agent.tasks}
              </p>
              <p
                className="text-[10px]"
                style={{ color: "var(--d-text-ghost)" }}
              >
                tasks
              </p>
            </div>

            <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1">
              <MoreHorizontal
                className="w-4 h-4"
                style={{ color: "var(--d-text-muted)" }}
              />
            </button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
