"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp } from "@/components/animations/animations";

export default function JobPromoBanner() {
  return (
    <motion.div
      variants={fadeUp}
      className="overflow-hidden relative p-7 flex flex-col justify-between min-h-[250px] bg-[#e6efdf] rounded-[24px]"
    >
      <div className="relative z-10">
        <img
          src="/images/icon.png"
          alt="Arcaive"
          className="w-10 h-10 object-contain mb-5"
        />

        <h3 className="text-[18px] font-semibold tracking-tight leading-snug mb-2.5 text-[#111]">
          Get your best
          <br />
          career match with
          <br />
          AI Discovery
        </h3>
        <p className="text-[13px] leading-relaxed mb-5 text-[#111]/60">
          Our agents scan 50+ sources daily to surface the roles you'd thrive
          in.
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "tween", duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex items-center gap-2.5 px-5 py-3 text-[13px] font-semibold w-fit rounded-full bg-[#111] text-[#e6efdf] hover:opacity-90 transition-opacity"
      >
        Learn more
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
