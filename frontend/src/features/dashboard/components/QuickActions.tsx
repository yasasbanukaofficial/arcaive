"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { fadeUp, dashboardStagger } from "./animations";
import { DUMMY_QUICK_ACTIONS } from "@/features/dashboard/constants/mockData";
import Button from "@/components/ui/Button";

const templates = DUMMY_QUICK_ACTIONS;

export default function QuickActions() {
  return (
    <motion.div
      variants={fadeUp}
      className="p-8 border border-[#E8E6DE] bg-white transition-[border-color] duration-200"
      style={{ borderRadius: 0 }}
    >
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8E6DE]">
        <div>
          <h3 className="font-sans text-[18px] font-bold text-black uppercase tracking-tight">
            Quick Actions
          </h3>
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#888880] mt-1">
            Start from a template
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
        >
          CREATE
        </Button>
      </div>

      <motion.div
        variants={dashboardStagger(0.04, 0)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {templates.map((template) => {
          return (
            <motion.button
              key={template.title}
              variants={fadeUp}
              className="group relative text-left p-6 border border-[#E8E6DE] bg-white transition-[background-color,border-color] duration-200 hover:bg-[#F5F4EF] hover:border-black"
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#888880] border border-[#E8E6DE] px-2 py-0.5 group-hover:border-black group-hover:text-black">
                  [ {template.tag} ]
                </span>
              </div>
              <h4 className="font-sans text-[15px] font-bold mb-1 text-black uppercase tracking-tight">
                {template.title}
              </h4>
              <p className="font-mono text-[11px] leading-relaxed text-[#888880] uppercase tracking-tighter">
                {template.description}
              </p>
              <span className="absolute bottom-4 right-4 font-mono text-[14px] text-black opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
