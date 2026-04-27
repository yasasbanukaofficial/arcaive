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
      className="p-10 bg-white border border-black/[0.05] rounded-[32px] shadow-sm relative overflow-hidden"
    >
      {/* Background soft glow */}
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-100/10 rounded-full blur-[60px] pointer-events-none" />

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-beige flex items-center justify-center border border-black/[0.03]">
            <Info className="w-5 h-5 text-black/60" />
          </div>
          <div>
            <h3 className="font-sans text-[18px] font-medium text-black tracking-tight">
              What&apos;s New
            </h3>
            <p className="font-sans text-[12px] text-black/30 font-medium uppercase tracking-[0.05em]">
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
            className="flex items-start gap-5 p-6 bg-[#FAF9F6] border border-black/[0.03] rounded-[24px] transition-all duration-500 cursor-pointer group hover:bg-white hover:shadow-xl hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl border border-black/5 flex items-center justify-center shrink-0 bg-white group-hover:scale-110 transition-transform duration-500">
              <span className="text-[20px]">{item.icon}</span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h4 className="font-sans text-[15px] font-medium text-black tracking-tight truncate group-hover:text-black transition-colors">
                  {item.title}
                </h4>
                <span className="font-sans text-[9px] font-bold uppercase tracking-[0.1em] text-black/40 bg-black/5 border border-black/5 px-2 py-0.5 rounded-full shrink-0">
                  {item.tag}
                </span>
              </div>
              <p className="font-sans text-[13px] leading-relaxed text-black/40 font-light">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
