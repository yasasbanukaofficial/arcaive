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
      className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-500/8 via-purple-500/5 to-transparent border border-white/5 p-6 lg:p-8"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-blue-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-linear-to-t from-purple-500/8 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 rounded-2xl bg-white/6 border border-white/8 flex items-center justify-center shrink-0"
          >
            <Sparkles className="w-5 h-5 text-blue-400/60" />
          </motion.div>
          <div>
            <h2 className="text-lg sm:text-xl font-medium text-white/90 tracking-tight mb-1">
              Welcome back
            </h2>
            <p className="text-[13px] text-white/30 leading-relaxed max-w-md">
              Your AI agents have been busy. 3 new applications submitted and 2
              interviews scheduled while you were away.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03, x: 2 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/6 border border-white/8 text-[13px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300 whitespace-nowrap"
        >
          View Summary
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
