"use client";

import React from "react";
import { motion } from "framer-motion";
import { item } from "@/components/animations/variants";

type TextCardProps = {
  quote: string;
  author: string;
  role?: string;
  count?: string;
  className?: string;
};

export default function TextCard({ quote, author, role, count, className }: TextCardProps) {
  return (
    <motion.div
      variants={item}
      className={`w-[380px] md:w-[420px] rounded-[24px] flex-shrink-0 ${className ?? ""}`}
    >
      <div
        className="bg-[#121212] border border-white/10 p-8 flex flex-col justify-between gap-8 h-full w-full"
        data-border="true"
        data-framer-name="Desktop"
        style={{
          WebkitBorderBeforeWidth: "1px",
        }}
      >
        <div className="text-block">
          <p className="text-[18px] md:text-[20px] font-medium leading-[1.4] text-white/90 tracking-tight">
            {quote}
          </p>
        </div>

        <div data-framer-name="Bottom">
          <div className="h-[1px] bg-white/[0.16] mb-4" data-framer-name="Divider" />

          <div className="flex items-center justify-between" data-framer-name="Texts">
            <div className="framer-name-NameSport">
              <div>
                <h4 className="text-[15px] font-bold text-white tracking-tight mb-1">{author}</h4>
              </div>
              {role && (
                <div>
                  <p className="text-[11px] text-white/30 font-bold uppercase tracking-[0.2em]">{role}</p>
                </div>
              )}
            </div>

            {count && (
              <div>
                <span className="text-[11px] text-white/30 font-bold uppercase tracking-[0.2em]">{count}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
