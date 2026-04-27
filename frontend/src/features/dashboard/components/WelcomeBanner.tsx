"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { fadeUp } from "./animations";
import Link from "next/link";

export default function WelcomeBanner() {
  return (
    <motion.div
      variants={fadeUp}
      className="relative overflow-hidden bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl p-8 lg:p-10 shadow-sm group hover:border-[var(--text-secondary)] transition-colors duration-500"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--text-secondary)] rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-[var(--text-primary)] opacity-5 transition-colors duration-700" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-start gap-6">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-14 h-14 bg-[var(--bg-color)] rounded-full flex items-center justify-center shrink-0 border border-[var(--glass-border)] shadow-inner"
          >
            <Sparkles className="w-6 h-6 text-[var(--text-primary)]" />
          </motion.div>
          <div className="space-y-4">
            <h2 className="font-display text-[24px] sm:text-[28px] uppercase font-bold tracking-tight text-[var(--text-primary)]">
              Welcome back
            </h2>
            <p className="font-sans text-[16px] font-light leading-[1.6] max-w-xl text-[var(--text-secondary)]">
              Your AI agents have been busy.{" "}
              <span className="text-[var(--text-primary)] font-medium">3 new applications</span> submitted and{" "}
              <span className="text-[var(--text-primary)] font-medium">2 interviews</span> scheduled while you were away.
            </p>
          </div>
        </div>

        <Link
          href="/overview"
          className="btn-icon-capsule shrink-0 group/btn !border-[var(--glass-border)] !text-[var(--text-primary)] hover:!border-[var(--text-primary)]"
        >
          <span className="icon-circle !bg-[var(--glass-border)] group-hover/btn:!bg-[var(--text-primary)] group-hover/btn:!text-[var(--bg-color)] transition-colors duration-300">
            <ArrowRight className="w-4 h-4" />
          </span>
          View Summary
        </Link>
      </div>
    </motion.div>
  );
}
