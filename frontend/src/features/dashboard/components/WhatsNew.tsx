"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, dashboardStagger } from "./animations";
import { DUMMY_WHATS_NEW } from "@/features/dashboard/constants/mockData";
import { Info } from "lucide-react";

const whatsNew = DUMMY_WHATS_NEW;

export default function WhatsNew() {
  return (
    <motion.div
      variants={fadeUp}
      className="p-10 bg-[var(--glass-bg)] border border-[var(--glass-border)]/[0.05] rounded-[32px] shadow-[var(--shadow-premium)] relative overflow-hidden"
    >
      {/* Background soft glow */}
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[var(--bg-color)] flex items-center justify-center border border-[var(--glass-border)]/[0.03]">
            <Info className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <div>
            <h3 className="font-sans text-[18px] font-medium text-[var(--text-primary)] tracking-tight">
              What&apos;s New
            </h3>
            <p className="font-sans text-[12px] text-[var(--text-secondary)] font-medium tracking-[0.05em]">
              Latest updates
            </p>
          </div>
        </div>
      </div>

      <motion.div
        variants={dashboardStagger(0.06, 0.1)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        {whatsNew.map((item) => (
          <motion.div
            key={item.title}
            variants={fadeUp}
            className="flex items-start gap-5 p-6 bg-[var(--bg-color)] border border-[var(--glass-border)]/[0.03] rounded-[24px] transition-all duration-500 cursor-pointer group hover:bg-[var(--glass-bg)] hover:shadow-[var(--shadow-premium)] hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl border border-[var(--glass-border)] flex items-center justify-center shrink-0 bg-[var(--glass-bg)] group-hover:scale-110 transition-transform duration-500">
              <span className="text-[20px]">{item.icon}</span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h4 className="font-sans text-[15px] font-medium text-[var(--text-primary)] tracking-tight truncate group-hover:text-[var(--text-primary)] transition-colors">
                  {item.title}
                </h4>
                <span className="font-sans text-[9px] font-bold tracking-[0.1em] text-[var(--text-secondary)] bg-[var(--glass-border)] border border-[var(--glass-border)] px-2 py-0.5 rounded-full shrink-0 capitalize">
                  {item.tag}
                </span>
              </div>
              <p className="font-sans text-[13px] leading-relaxed text-[var(--text-secondary)] font-light">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
