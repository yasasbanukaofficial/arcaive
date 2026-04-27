"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight, Play } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  const tickerItems = [
    "CV ANALYSIS",
    "JOB MATCHING",
    "TAILORED CVS",
    "MOCK INTERVIEWS",
    "AI OPTIMIZATION",
    "AUTO-APPLY",
    "WORKFLOW AGENTS",
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col bg-black overflow-hidden"
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-lines opacity-30" />

      {/* Radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(209,255,0,0.08)_0%,_transparent_70%)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1440px] px-6 lg:px-10 mx-auto flex-1 flex flex-col justify-center pt-[120px] pb-[140px]">
        {/* Section Index */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="font-mono text-[11px] text-[#D1FF00] tracking-[0.15em]">[01]</span>
          <div className="w-12 h-[1px] bg-white/10" />
          <span className="font-mono text-[11px] text-white/30 uppercase tracking-[0.15em]">
            AI Career Platform
          </span>
          <span className="font-mono text-[11px] text-white/20">_</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left: Headline */}
          <div className="lg:col-span-7 space-y-10">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-sans text-[48px] sm:text-[64px] lg:text-[80px] font-bold leading-[0.95] tracking-[-0.04em] text-white uppercase"
            >
              Where your<br />
              <span className="text-[#D1FF00]">seeking</span> is<br />
              automated.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-sans text-[16px] sm:text-[18px] text-white/50 max-w-[520px] leading-[1.7]"
            >
              An engine that does the hard work for you while you relax.
              A digital intelligence that uncovers hidden roles, aligns your
              achievements, and secures your entry into the world&apos;s leading companies.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link href="/register" className="btn-primary">
                START FOR FREE
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
              <Link href="#howitworks" className="btn-ghost">
                SEE HOW IT WORKS
              </Link>
            </motion.div>
          </div>

          {/* Right: Terminal Block */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div className="relative">
              {/* Neon glow behind terminal */}
              <div className="absolute -inset-4 bg-[radial-gradient(ellipse_at_center,_rgba(209,255,0,0.06)_0%,_transparent_70%)] pointer-events-none" />

              <div className="relative bg-[#0A0A0A] border border-white/[0.08] p-8 font-mono text-[12px] leading-[2] text-white/60">
                {/* Terminal Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#D1FF00] animate-neon-pulse" />
                    <span className="text-[10px] text-[#D1FF00] uppercase tracking-[0.2em]">LIVE</span>
                  </div>
                  <span className="text-[10px] text-white/20 uppercase tracking-[0.15em]">ARCAIVE_ENGINE v2.0</span>
                </div>

                <div className="space-y-1">
                  <p className="text-white/80 font-bold mb-3">MATCH_REPORT.sh</p>
                  <p>{'>'} <span className="text-white/30">LOADING_PROFILE...</span> <span className="text-[#D1FF00]">OK</span></p>
                  <p>{'>'} <span className="text-white/30">EXTRACTING_ACHIEVEMENTS...</span> <span className="text-white">14 FOUND</span></p>
                  <p>{'>'} <span className="text-white/30">CROSS_REFERENCING_MARKET...</span> <span className="text-white">1,402 JOBS</span></p>
                  <p className="pt-3">{'>'} <span className="text-[#D1FF00] font-bold">MATCH_SCORE: 98%</span></p>
                  <p className="text-white/10 pt-2">────────────────────────────────</p>
                  <p>{'>'} TOP_ROLES:</p>
                  <p className="pl-4 text-white/70">1. SENIOR_SOFTWARE_ENGINEER <span className="text-[#D1FF00]">(GOOGLE)</span></p>
                  <p className="pl-4 text-white/70">2. STAFF_PRODUCT_DESIGNER <span className="text-[#D1FF00]">(AIRBNB)</span></p>
                  <p className="pl-4 text-white/70">3. ENGINEERING_MANAGER <span className="text-[#D1FF00]">(STRIPE)</span></p>
                  <p className="pt-4 text-white/40">{'>'} <span className="animate-pulse">_</span></p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-20 pt-10 border-t border-white/[0.06] grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: "98%", label: "Success Rate" },
            { value: "14k+", label: "Applications" },
            { value: "48h", label: "Avg. Interview" },
            { value: "3.2x", label: "Salary Boost" },
          ].map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <p className="font-sans text-[32px] sm:text-[40px] font-bold text-white leading-none tracking-tight">
                {stat.value}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Ticker Strip */}
      <div className="absolute bottom-0 left-0 w-full border-t border-white/[0.06] bg-black/80 backdrop-blur-sm h-[48px] flex items-center overflow-hidden">
        <div className="marquee-track">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex shrink-0">
              {tickerItems.map((item, i) => (
                <span
                  key={`${setIdx}-${i}`}
                  className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/20 px-8 flex items-center gap-4"
                >
                  <span className="w-1 h-1 bg-[#D1FF00]/40" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
