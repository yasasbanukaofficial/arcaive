"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { bounceIn, staggerContainer } from "@/components/animations/variants";
import UnfoldText from "@/components/ui/UnfoldText";
import UnfoldTextLetters from "@/components/ui/UnfoldTextLetters";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  const tickerItems = [
    "CV ANALYSIS",
    "JOB MATCHING",
    "TAILORED CVS",
    "MOCK INTERVIEWS",
    "AI OPTIMIZATION",
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-screen flex flex-col bg-white overflow-hidden pt-[160px] pb-[100px]"
    >
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      <div className="relative z-10 w-full max-w-[1440px] px-6 sm:px-10 md:px-16 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="flex flex-col">
          {/* Section Index */}
          <div className="flex items-center gap-4 mb-16">
            <span className="font-mono text-[11px] text-[#888880] uppercase tracking-widest">[01]</span>
            <div className="w-12 h-[1px] bg-[#E8E6DE]" />
          </div>

          <div className="space-y-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#888880]">
              AI-POWERED CAREER PLATFORM
            </p>

            <h1 className="font-sans text-[40px] md:text-[72px] font-bold leading-[1] tracking-[-0.03em] text-black uppercase">
              Where your <br />
              seeking is <br />
              automated.
            </h1>

            <p className="font-sans text-[18px] text-[#888880] max-w-[520px] leading-[1.6] mt-8">
              An engine that does the hard work for you while you relax.
              A digital intelligence that uncovers hidden roles, aligns your achievements, and secures your entry into the world’s leading companies.
            </p>

            <div className="flex flex-wrap gap-4 mt-12">
              <Link href="/register" className="btn-primary">
                START FOR FREE
              </Link>
              <Link href="#howitworks" className="btn-ghost">
                SEE HOW IT WORKS
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Code Block (Desktop Only) */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-full bg-[#F5F4EF] border border-[#E8E6DE] p-8 font-mono text-[12px] leading-relaxed text-black/70 shadow-sm relative">
            <div className="absolute top-4 right-4 text-[10px] text-[#888880]">STATUS: ANALYZING_CV</div>
            <div className="space-y-2">
              <p className="text-black font-bold mb-4">MATCH_REPORT_v2.0.sh</p>
              <p>{'>'}  <span className="text-[#888880]"> LOADING_PROFILE...</span> OK</p>
              <p>{'>'}  <span className="text-[#888880]"> EXTRACTING_ACHIEVEMENTS...</span> 14 FOUND</p>
              <p>{'>'}  <span className="text-[#888880]"> CROSS_REFERENCING_MARKET...</span> 1,402 JOBS</p>
              <p className="pt-4">{'>'}  <span className="text-black font-bold">MATCH_SCORE: 98%</span></p>
              <p className="text-black/40 pt-2">------------------------------------</p>
              <p>{'>'}  TOP_ROLES:</p>
              <p className="pl-4">1. SENIOR_SOFTWARE_ENGINEER (GOOGLE)</p>
              <p className="pl-4">2. STAFF_PRODUCT_DESIGNER (AIRBNB)</p>
              <p className="pl-4">3. ENGINEERING_MANAGER (STRIPE)</p>
              <p className="pt-6">{'>'}  <span className="text-black"> _</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ticker Strip */}
      <div className="absolute bottom-0 left-0 w-full border-y border-[#E8E6DE] bg-white h-[48px] flex items-center overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-12 px-12"
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              {tickerItems.map((item) => (
                <span key={item} className="font-mono text-[11px] uppercase tracking-widest text-black/40">
                  {item} —
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
