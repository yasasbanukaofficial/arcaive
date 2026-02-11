"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Bot,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Plus,
} from "lucide-react";
import { fadeUp, dashboardStagger } from "./animations";

const templates = [
  {
    title: "Resume Builder",
    description: "AI-powered resume tailoring for specific job descriptions",
    icon: FileText,
    gradient: "from-blue-500/10 to-cyan-500/5",
    tag: "Popular",
  },
  {
    title: "Mock Interview",
    description: "Practice with AI interviewers and get instant feedback",
    icon: MessageSquare,
    gradient: "from-purple-500/10 to-pink-500/5",
    tag: "New",
  },
  {
    title: "Auto Apply",
    description: "Let our agents find and apply to matching roles for you",
    icon: Bot,
    gradient: "from-amber-500/10 to-orange-500/5",
    tag: "Template",
  },
  {
    title: "Cover Letter",
    description: "Generate tailored cover letters in seconds with AI",
    icon: Sparkles,
    gradient: "from-emerald-500/10 to-teal-500/5",
    tag: "Template",
  },
];

export default function QuickActions() {
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
            Quick Actions
          </h3>
          <p
            className="text-[12px] mt-0.5"
            style={{ color: "var(--d-text-muted)" }}
          >
            Start from a template
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 text-[12px] transition-colors"
          style={{ color: "var(--d-text-tertiary)" }}
        >
          <Plus className="w-3.5 h-3.5" />
          Create
        </motion.button>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={dashboardStagger(0.06, 0.15)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <motion.button
              key={template.title}
              variants={fadeUp}
              whileHover={{ y: -1, transition: { duration: 0.15 } }}
              className={`group relative text-left p-4 rounded-xl bg-linear-to-br ${template.gradient} transition-all duration-300`}
              style={{ border: "1px solid var(--d-border-subtle)" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--d-surface-active)",
                    border: "1px solid var(--d-border)",
                  }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: "var(--d-icon)" }}
                  />
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  {template.tag}
                </span>
              </div>
              <h4
                className="text-[13px] font-medium mb-1"
                style={{ color: "var(--d-text-secondary)" }}
              >
                {template.title}
              </h4>
              <p
                className="text-[11px] leading-relaxed"
                style={{ color: "var(--d-text-muted)" }}
              >
                {template.description}
              </p>
              <ArrowRight
                className="absolute bottom-4 right-4 w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-all duration-300 -translate-x-1 group-hover:translate-x-0"
                style={{ color: "var(--d-text-tertiary)" }}
              />
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
