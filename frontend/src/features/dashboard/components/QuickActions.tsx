"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Zap } from "lucide-react";
import { fadeUp, dashboardStagger } from "./animations";
import { DUMMY_QUICK_ACTIONS } from "@/features/dashboard/constants/mockData";
import Link from "next/link";

const templates = DUMMY_QUICK_ACTIONS;

export default function QuickActions() {
  return (
    <motion.div
      variants={fadeUp}
      className="p-10 bg-white border border-black/[0.05] rounded-[32px] shadow-sm relative overflow-hidden"
    >
      {/* Background soft glow */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-blue-100/10 rounded-full blur-[60px] pointer-events-none" />

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-beige flex items-center justify-center border border-black/[0.03]">
            <Zap className="w-5 h-5 text-black/60" />
          </div>
          <div>
            <h3 className="font-sans text-[18px] font-medium text-black tracking-tight">
              Quick Actions
            </h3>
            <p className="font-sans text-[12px] text-black/30 font-medium uppercase tracking-[0.05em]">
              Start from a template
            </p>
          </div>
        </div>
        <Link
          href="/create"
          className="font-sans text-[12px] font-bold uppercase tracking-[0.1em] text-black/40 hover:text-black transition-colors border-b border-black/10 hover:border-black"
        >
          Create New
        </Link>
      </div>

      <motion.div
        variants={dashboardStagger(0.06, 0.1)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        {templates.map((template) => (
          <motion.button
            key={template.title}
            variants={fadeUp}
            className="group relative text-left p-6 bg-[#FAF9F6] border border-black/[0.03] rounded-[24px] transition-all duration-500 hover:bg-white hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-6">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-black/30 border border-black/[0.05] px-3 py-1 rounded-full group-hover:bg-black group-hover:text-white transition-all">
                {template.tag}
              </span>
            </div>
            <h4 className="font-sans text-[16px] font-medium mb-2 text-black tracking-tight group-hover:text-black transition-colors">
              {template.title}
            </h4>
            <p className="font-sans text-[13px] leading-relaxed text-black/40 font-light">
              {template.description}
            </p>
            <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full border border-black/[0.05] flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-black group-hover:text-white transition-all duration-500">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
