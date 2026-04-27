"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { fadeUp } from "./animations";
import Link from "next/link";

export default function WelcomeBanner() {
  return (
    <motion.div
      variants={fadeUp}
      className="relative overflow-hidden bg-white border border-black/5 rounded-[24px] p-8 lg:p-10 shadow-sm group hover:border-black/10 transition-colors duration-500"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none group-hover:bg-orange-200/30 transition-colors duration-700" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-start gap-6">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-14 h-14 bg-beige rounded-full flex items-center justify-center shrink-0 border border-black/[0.03] shadow-inner"
          >
            <Sparkles className="w-6 h-6 text-black/80" />
          </motion.div>
          <div className="space-y-4">
            <h2 className="font-sans text-[24px] sm:text-[28px] font-medium tracking-tight text-black">
              Welcome back
            </h2>
            <p className="font-sans text-[16px] font-light leading-[1.6] max-w-xl text-black/50">
              Your AI agents have been busy.{" "}
              <span className="text-black font-medium">3 new applications</span> submitted and{" "}
              <span className="text-black font-medium">2 interviews</span> scheduled while you were away.
            </p>
          </div>
        </div>

        <Link
          href="/overview"
          className="btn-icon-capsule shrink-0 group/btn"
        >
          <span className="icon-circle group-hover/btn:bg-black group-hover/btn:text-white transition-colors duration-300">
            <ArrowRight className="w-4 h-4" />
          </span>
          View Summary
        </Link>
      </div>
    </motion.div>
  );
}
