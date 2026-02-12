"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { fadeUp } from "./animations";

export default function WelcomeBanner() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-500/8 via-purple-500/5 to-transparent p-8 lg:p-10 transition-colors duration-300"
      style={{ border: "1px solid var(--d-border)" }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-blue-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-linear-to-t from-purple-500/8 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "var(--d-surface-active)",
              border: "1px solid var(--d-border-hover)",
            }}
          >
            <Sparkles className="w-6 h-6 text-blue-400/60" />
          </motion.div>
          <div>
            <h2
              className="text-xl sm:text-2xl font-medium tracking-tight mb-1.5"
              style={{ color: "var(--d-text-primary)" }}
            >
              Welcome back
            </h2>
            <p
              className="text-[15px] leading-relaxed max-w-lg"
              style={{ color: "var(--d-text-tertiary)" }}
            >
              Your AI agents have been busy. 3 new applications submitted and 2
              interviews scheduled while you were away.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03, x: 2 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-[14px] font-medium transition-all duration-300 whitespace-nowrap"
          style={{
            backgroundColor: "var(--d-surface-active)",
            border: "1px solid var(--d-border-hover)",
            color: "var(--d-text-secondary)",
          }}
        >
          View Summary
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
