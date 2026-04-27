"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { fadeUp } from "./animations";
import Link from "next/link";

export default function WelcomeBanner() {
  return (
    <motion.div
      variants={fadeUp}
      className="relative overflow-hidden bg-[#0A0A0A] border border-white/[0.06] p-8 lg:p-10"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[300px] h-full bg-[radial-gradient(ellipse_at_right,_rgba(209,255,0,0.06)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 grid-lines opacity-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-start gap-5">
          <div className="w-12 h-12 bg-[#D1FF00] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div className="space-y-2">
            <h2 className="font-sans text-[20px] sm:text-[24px] font-bold text-white uppercase tracking-tight">
              Welcome back
            </h2>
            <p className="font-sans text-[14px] leading-relaxed max-w-xl text-white/40">
              Your AI agents have been busy.{" "}
              <span className="text-[#D1FF00] font-bold">3 NEW APPLICATIONS</span> submitted and{" "}
              <span className="text-[#D1FF00] font-bold">2 INTERVIEWS</span> scheduled while you were away.
            </p>
          </div>
        </div>

        <Link
          href="/overview"
          className="inline-flex items-center gap-2 bg-[#D1FF00] text-black px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-white transition-colors whitespace-nowrap"
        >
          VIEW SUMMARY
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
