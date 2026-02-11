"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp } from "./animations";

const whatsNew = [
  {
    icon: "✨",
    title: "Multi-Agent Swarm v2",
    description: "Our most intelligent orchestration yet.",
    tag: "New",
  },
  {
    icon: "🖼️",
    title: "Visual Resume Builder",
    description: "State-of-the-art template generation.",
    tag: "Beta",
  },
  {
    icon: "🎬",
    title: "Interview Simulator 3.0",
    description: "Now with real-time video analysis.",
    tag: "New",
  },
  {
    icon: "🔊",
    title: "Voice Practice Mode",
    description: "Practice verbal responses with AI feedback.",
    tag: "Coming Soon",
  },
];

export default function WhatsNew() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="rounded-2xl p-6 transition-colors duration-300"
      style={{
        backgroundColor: "var(--d-surface)",
        border: "1px solid var(--d-border)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3
            className="text-[15px] font-medium tracking-tight"
            style={{ color: "var(--d-text-primary)" }}
          >
            What&apos;s New
          </h3>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--d-text-muted)" }}>
            Latest features & updates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {whatsNew.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
            whileHover={{ y: -1, transition: { duration: 0.15 } }}
            className="flex items-start gap-3 p-3.5 rounded-xl transition-all duration-300 cursor-pointer group"
            style={{ border: "1px solid var(--d-border-subtle)" }}
          >
            <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h4
                  className="text-[13px] font-medium transition-colors truncate"
                  style={{ color: "var(--d-text-secondary)" }}
                >
                  {item.title}
                </h4>
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400/50 bg-blue-500/10 px-1.5 py-0.5 rounded-md flex-shrink-0">
                  {item.tag}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: "var(--d-text-muted)" }}>
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
