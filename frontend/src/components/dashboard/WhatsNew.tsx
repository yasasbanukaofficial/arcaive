"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, dashboardStagger } from "./animations";
import { DUMMY_WHATS_NEW } from "@/app/data/dashboard";

const whatsNew = DUMMY_WHATS_NEW;

export default function WhatsNew() {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl p-7 transition-colors duration-200"
      style={{
        backgroundColor: "var(--d-surface)",
        border: "1px solid var(--d-border)",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            className="text-[17px] font-medium tracking-tight"
            style={{ color: "var(--d-text-primary)" }}
          >
            What&apos;s New
          </h3>
          <p
            className="text-[13px] mt-0.5"
            style={{ color: "var(--d-text-muted)" }}
          >
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
            className="flex items-start gap-3.5 p-4 rounded-xl transition-all duration-200 cursor-pointer group hover:-translate-y-0.5"
            style={{ border: "1px solid var(--d-border-subtle)" }}
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h4
                  className="text-[14px] font-medium transition-colors truncate"
                  style={{ color: "var(--d-text-secondary)" }}
                >
                  {item.title}
                </h4>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400/50 bg-blue-500/10 px-1.5 py-0.5 rounded-md flex-shrink-0">
                  {item.tag}
                </span>
              </div>
              <p
                className="text-[12px] leading-relaxed"
                style={{ color: "var(--d-text-muted)" }}
              >
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
