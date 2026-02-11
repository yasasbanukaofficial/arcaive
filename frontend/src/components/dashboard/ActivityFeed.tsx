"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, FileText, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { fadeUp, dashboardStagger } from "./animations";

const activities = [
  {
    icon: Bot,
    title: "Resume Agent completed tailoring",
    description: "Tailored CV for Senior Frontend role at Stripe",
    time: "2 min ago",
    status: "success" as const,
  },
  {
    icon: Send,
    title: "Auto-apply submitted",
    description: "Application sent to Google — ML Engineer",
    time: "15 min ago",
    status: "success" as const,
  },
  {
    icon: AlertCircle,
    title: "API rate limit warning",
    description: "Approaching daily limit — 92% usage",
    time: "1 hr ago",
    status: "warning" as const,
  },
  {
    icon: FileText,
    title: "Cover letter generated",
    description: "For Product Designer position at Figma",
    time: "3 hrs ago",
    status: "success" as const,
  },
  {
    icon: CheckCircle2,
    title: "Interview prep completed",
    description: "Mock interview for System Design round",
    time: "5 hrs ago",
    status: "success" as const,
  },
];

export default function ActivityFeed() {
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
            Recent Activity
          </h3>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--d-text-muted)" }}>
            Latest agent logs
          </p>
        </div>
        <button className="text-[12px] transition-colors" style={{ color: "var(--d-text-tertiary)" }}>
          View all
        </button>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={dashboardStagger(0.06, 0.2)}
        className="space-y-1"
      >
        {activities.map((activity, i) => {
          const Icon = activity.icon;
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              className="flex items-start gap-3 p-3 rounded-xl transition-colors duration-200 group cursor-pointer"
            >
              <div
                className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                  activity.status === "warning"
                    ? "bg-amber-500/10 border border-amber-500/10"
                    : ""
                }`}
                style={
                  activity.status !== "warning"
                    ? {
                        backgroundColor: "var(--d-surface-hover)",
                        border: "1px solid var(--d-border)",
                      }
                    : undefined
                }
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    activity.status === "warning" ? "text-amber-400/60" : ""
                  }`}
                  style={activity.status !== "warning" ? { color: "var(--d-icon)" } : undefined}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-[13px] font-medium transition-colors truncate"
                  style={{ color: "var(--d-text-secondary)" }}
                >
                  {activity.title}
                </p>
                <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--d-text-muted)" }}>
                  {activity.description}
                </p>
              </div>

              <span className="text-[10px] flex-shrink-0 mt-0.5" style={{ color: "var(--d-text-ghost)" }}>
                {activity.time}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
