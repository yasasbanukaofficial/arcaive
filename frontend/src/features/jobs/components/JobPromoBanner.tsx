"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp } from "@/components/animations/animations";

export default function JobPromoBanner() {
  return (
    <motion.div
      variants={fadeUp}
      className=" overflow-hidden relative p-7 flex flex-col justify-between min-h-[250px] bg-[var(--glass-bg)] border border-[var(--glass-border)]"
    >
      <div className="relative z-10">
        <img
          src="/images/icon.png"
          alt="Arcaive"
          className="w-10 h-10 object-contain mb-5"
        />

        <h3
          className="text-[18px] font-semibold tracking-tight leading-snug mb-2.5 text-[var(--text-primary)]"
        >
          Get your best
          <br />
          career match with
          <br />
          AI Discovery
        </h3>
        <p
          className="text-[13px] leading-relaxed mb-5 text-[var(--text-secondary)]"
        >
          Our agents scan 50+ sources daily to surface the roles you'd thrive
          in.
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "tween", duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex items-center gap-2.5 px-5 py-3  text-[13px] font-semibold w-fit transition-[background-color,border-color,color] duration-150 ease-out"
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
