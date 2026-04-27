"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fadeUp, dashboardStagger } from "./animations";
import { DUMMY_QUICK_ACTIONS } from "@/features/dashboard/constants/mockData";
import Link from "next/link";

const templates = DUMMY_QUICK_ACTIONS;

export default function QuickActions() {
  return (
    <motion.div
      variants={fadeUp}
      className="p-8 bg-[#0A0A0A] border border-white/[0.06]"
    >
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
        <div>
          <h3 className="font-sans text-[16px] font-bold text-white uppercase tracking-tight">
            Quick Actions
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/25 mt-1">
            Start from a template
          </p>
        </div>
        <Link
          href="/create"
          className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/30 hover:text-[#D1FF00] transition-colors border border-white/[0.06] hover:border-[#D1FF00]/30 px-3 py-1.5"
        >
          CREATE
        </Link>
      </div>

      <motion.div
        variants={dashboardStagger(0.04, 0)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {templates.map((template) => (
          <motion.button
            key={template.title}
            variants={fadeUp}
            className="group relative text-left p-6 bg-transparent border border-white/[0.06] transition-all duration-300 hover:bg-white/[0.02] hover:border-[#D1FF00]/20"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-white/20 border border-white/[0.06] px-2 py-0.5 group-hover:border-[#D1FF00]/30 group-hover:text-[#D1FF00] transition-colors">
                {template.tag}
              </span>
            </div>
            <h4 className="font-sans text-[14px] font-bold mb-1.5 text-white uppercase tracking-tight group-hover:text-[#D1FF00] transition-colors">
              {template.title}
            </h4>
            <p className="font-sans text-[12px] leading-relaxed text-white/30">
              {template.description}
            </p>
            <ArrowUpRight className="absolute bottom-4 right-4 w-4 h-4 text-white/10 group-hover:text-[#D1FF00] opacity-0 group-hover:opacity-100 transition-all" />
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
