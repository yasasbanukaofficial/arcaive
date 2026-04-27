"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, dashboardStagger } from "./animations";
import { DUMMY_WHATS_NEW } from "@/features/dashboard/constants/mockData";

const whatsNew = DUMMY_WHATS_NEW;

export default function WhatsNew() {
  return (
    <motion.div
      variants={fadeUp}
      className="p-8 bg-[#0A0A0A] border border-white/[0.06]"
    >
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
        <div>
          <h3 className="font-sans text-[16px] font-bold text-white uppercase tracking-tight">
            What&apos;s New
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/25 mt-1">
            Latest features & updates
          </p>
        </div>
      </div>

      <motion.div
        variants={dashboardStagger(0.04, 0)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {whatsNew.map((item) => (
          <motion.div
            key={item.title}
            variants={fadeUp}
            className="flex items-start gap-4 p-5 bg-transparent border border-white/[0.04] transition-all duration-300 cursor-pointer group hover:bg-white/[0.02] hover:border-white/[0.08]"
          >
            <div className="w-10 h-10 border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:border-[#D1FF00]/30 transition-colors">
              <span className="font-sans text-[16px]">{item.icon}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                <h4 className="font-sans text-[13px] font-bold text-white uppercase truncate tracking-tight group-hover:text-[#D1FF00] transition-colors">
                  {item.title}
                </h4>
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#D1FF00] border border-[#D1FF00]/30 px-1.5 py-0.5 shrink-0">
                  {item.tag}
                </span>
              </div>
              <p className="font-sans text-[12px] leading-relaxed text-white/30">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
