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
      className="p-8 border border-[#E8E6DE] bg-white transition-[border-color] duration-200"
      style={{ borderRadius: 0 }}
    >
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8E6DE]">
        <div>
          <h3 className="font-sans text-[18px] font-bold text-black uppercase tracking-tight">
            What&apos;s New
          </h3>
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#888880] mt-1">
            Latest features & updates
          </p>
        </div>
      </div>

      <motion.div
        variants={dashboardStagger(0.04, 0)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {whatsNew.map((item) => (
          <motion.div
            key={item.title}
            variants={fadeUp}
            className="flex items-start gap-4 p-5 border border-[#E8E6DE] bg-white transition-[background-color,border-color] duration-200 cursor-pointer group hover:bg-[#F5F4EF] hover:border-black"
            style={{ borderRadius: 0 }}
          >
            <div className="w-10 h-10 border border-[#E8E6DE] bg-[#F5F4EF] flex items-center justify-center shrink-0 group-hover:border-black transition-colors">
              <span className="font-sans text-[16px] font-bold text-black">{item.icon}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-sans text-[14px] font-bold text-black uppercase truncate tracking-tight">
                  {item.title}
                </h4>
                <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-black border border-black px-1.5 py-0.5">
                  {item.tag}
                </span>
              </div>
              <p className="font-mono text-[11px] leading-relaxed text-[#888880] uppercase tracking-tighter">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
