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
      className="rounded-2xl bg-white/2 border border-white/5 p-6 hover:border-white/8 transition-colors duration-300"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-medium text-white/90 tracking-tight">
            Quick Actions
          </h3>
          <p className="text-[12px] text-white/30 mt-0.5">
            Start from a template
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors"
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
              className={`group relative text-left p-4 rounded-xl bg-linear-to-br ${template.gradient} border border-white/4 hover:border-white/8 transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/6 border border-white/6 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white/50" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/20">
                  {template.tag}
                </span>
              </div>
              <h4 className="text-[13px] font-medium text-white/80 mb-1">
                {template.title}
              </h4>
              <p className="text-[11px] text-white/25 leading-relaxed">
                {template.description}
              </p>
              <ArrowRight className="absolute bottom-4 right-4 w-3.5 h-3.5 text-white/0 group-hover:text-white/30 transition-all duration-300 -translate-x-1 group-hover:translate-x-0" />
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
