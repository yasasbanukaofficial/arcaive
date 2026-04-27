"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, dashboardStagger } from "./animations";
import { DUMMY_AGENTS } from "@/features/dashboard/constants/mockData";

const agents = DUMMY_AGENTS;

export default function ActiveAgents() {
  return (
    <motion.div
      variants={fadeUp}
      className="p-8 bg-[#0A0A0A] border border-white/[0.06]"
    >
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
        <div>
          <h3 className="font-sans text-[16px] font-bold text-white uppercase tracking-tight">
            Active Agents
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/25 mt-1">
            Running workflows
          </p>
        </div>
        <button className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/30 hover:text-[#D1FF00] transition-colors">
          MANAGE
        </button>
      </div>

      <motion.div variants={dashboardStagger(0.04, 0)} className="space-y-3">
        {agents.map((agent) => (
          <motion.div
            key={agent.name}
            variants={fadeUp}
            className="flex items-center gap-4 p-4 bg-transparent border border-white/[0.04] transition-all duration-300 hover:bg-white/[0.02] hover:border-white/[0.08] group cursor-pointer"
          >
            <div className="w-10 h-10 border border-white/[0.08] flex items-center justify-center bg-transparent shrink-0 group-hover:border-[#D1FF00]/30 transition-colors">
              <span className="font-sans text-[14px] font-bold text-white/30 group-hover:text-[#D1FF00] transition-colors uppercase">
                {agent.name.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <p className="font-sans text-[13px] font-bold text-white uppercase truncate tracking-tight">
                  {agent.name}
                </p>
                <div className="flex items-center gap-1.5 px-2 py-0.5 border border-white/[0.06]">
                  <span className={`w-1.5 h-1.5 ${
                    agent.status === "active" ? "bg-[#D1FF00] animate-neon-pulse" : "bg-white/20"
                  }`} />
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-white/50">
                    {agent.status}
                  </span>
                </div>
              </div>
              <p className="font-sans text-[11px] text-white/25 truncate mt-1">
                {agent.description}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="font-mono text-[16px] font-bold text-[#D1FF00]">
                {agent.tasks}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-white/20">
                TASKS
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
