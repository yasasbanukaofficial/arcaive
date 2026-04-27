"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, Zap, Pause, MoreHorizontal } from "lucide-react";
import { fadeUp, dashboardStagger } from "./animations";
import { DUMMY_AGENTS } from "@/features/dashboard/constants/mockData";

const agents = DUMMY_AGENTS;

export default function ActiveAgents() {
  return (
    <motion.div
      variants={fadeUp}
      className="p-8 border border-[#E8E6DE] bg-white transition-[border-color] duration-200"
      style={{ borderRadius: 0 }}
    >
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8E6DE]">
        <div>
          <h3 className="font-sans text-[18px] font-bold text-black uppercase tracking-tight">
            Active Agents
          </h3>
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#888880] mt-1">
            Running workflows
          </p>
        </div>
        <button className="font-mono text-[11px] uppercase tracking-widest text-[#888880] hover:text-black transition-colors">
          [ MANAGE ]
        </button>
      </div>

      <motion.div variants={dashboardStagger(0.04, 0)} className="space-y-4">
        {agents.map((agent) => (
          <motion.div
            key={agent.name}
            variants={fadeUp}
            className="flex items-center gap-4 p-4 border border-[#E8E6DE] bg-white transition-[background-color,border-color] duration-200 hover:bg-[#F5F4EF] hover:border-black group cursor-pointer"
            style={{ borderRadius: 0 }}
          >
            <div className="w-12 h-12 border border-[#E8E6DE] flex items-center justify-center bg-[#F5F4EF] group-hover:border-black shrink-0">
              <span className="font-sans text-[16px] font-bold text-black uppercase">
                {agent.name.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <p className="font-sans text-[14px] font-bold text-black uppercase truncate">
                  {agent.name}
                </p>
                <div className="flex items-center gap-1.5 px-2 py-0.5 border border-[#E8E6DE] bg-white group-hover:border-black transition-colors">
                  <span className={`w-1.5 h-1.5 ${agent.status === "active" ? "bg-black" : "bg-[#888880]"}`} style={{ borderRadius: 0 }} />
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-black">
                    {agent.status}
                  </span>
                </div>
              </div>
              <p className="font-mono text-[11px] text-[#888880] uppercase tracking-tighter truncate mt-1">
                {agent.description}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="font-mono text-[14px] font-bold text-black">
                {agent.tasks}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#888880]">
                TASKS
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
