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
      variants={fadeUp}
      className="rounded-2xl p-7 transition-colors duration-200"
      style={{
        backgroundColor: "var(--d-surface)",
        border: "1px solid var(--d-border)",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            className="text-[17px] font-medium tracking-tight"
            style={{ color: "var(--d-text-primary)" }}
          >
            Quick Actions
          </h3>
          <p
            className="text-[13px] mt-0.5"
            style={{ color: "var(--d-text-muted)" }}
          >
            Start from a template
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={{
            type: "tween",
            duration: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex items-center gap-1.5 text-[13px] transition-colors"
          style={{ color: "var(--d-text-tertiary)" }}
        >
          <Plus className="w-3.5 h-3.5" />
          Create
        </motion.button>
      </div>

      <motion.div
        variants={dashboardStagger(0.04, 0)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <motion.button
              key={template.title}
              variants={fadeUp}
              className={`group relative text-left p-5 rounded-xl bg-linear-to-br ${template.gradient} transition-all duration-200 hover:-translate-y-0.5`}
              style={{ border: "1px solid var(--d-border-subtle)" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--d-surface-active)",
                    border: "1px solid var(--d-border)",
                  }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: "var(--d-icon)" }}
                  />
                </div>
                <span
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  {template.tag}
                </span>
              </div>
              <h4
                className="text-[14px] font-medium mb-1"
                style={{ color: "var(--d-text-secondary)" }}
              >
                {template.title}
              </h4>
              <p
                className="text-[12px] leading-relaxed"
                style={{ color: "var(--d-text-muted)" }}
              >
                {template.description}
              </p>
              <ArrowRight
                className="absolute bottom-4 right-4 w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
                style={{ color: "var(--d-text-tertiary)" }}
              />
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
