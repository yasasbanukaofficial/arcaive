"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { fadeUp } from "@/components/dashboard/animations";

export default function JobPromoBanner() {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl overflow-hidden relative p-7 flex flex-col justify-between min-h-[250px]"
      style={{
        background:
          "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(16,185,129,0.06) 100%)",
        border: "1px solid var(--d-border)",
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl bg-blue-500/10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-3xl bg-purple-500/8 pointer-events-none" />

      <div className="relative z-10">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
          style={{
            backgroundColor: "var(--d-surface-active)",
            border: "1px solid var(--d-border-hover)",
          }}
        >
          <Sparkles className="w-6 h-6 text-blue-400/60" />
        </motion.div>

        <h3
          className="text-[18px] font-semibold tracking-tight leading-snug mb-2.5"
          style={{ color: "var(--d-text-primary)" }}
        >
          Get your best
          <br />
          career match with
          <br />
          <span className="text-blue-400/70">AI Discovery</span>
        </h3>
        <p
          className="text-[13px] leading-relaxed mb-5"
          style={{ color: "var(--d-text-muted)" }}
        >
          Our agents scan 50+ sources daily to surface the roles you'd thrive
          in.
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="relative z-10 flex items-center gap-2.5 px-5 py-3 rounded-xl text-[13px] font-semibold w-fit transition-all duration-200"
        style={{
          backgroundColor: "var(--d-surface-active)",
          border: "1px solid var(--d-border-hover)",
          color: "var(--d-text-secondary)",
        }}
      >
        Learn more
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
