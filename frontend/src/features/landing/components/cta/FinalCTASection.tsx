"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="bg-transparent py-60 px-6 lg:px-12 relative overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1400px] mx-auto text-center relative z-10"
      >
        <span className="font-sans text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 mb-16 block">THE NEW REALITY</span>
        <h2 className="font-sans text-[64px] sm:text-[100px] lg:text-[160px] font-medium leading-[0.8] tracking-[-0.07em] text-white mb-24">
          Own your <br />
          <span className="text-white/10 italic">evolution.</span>
        </h2>
        
        <Link 
          href="/register" 
          className="inline-flex items-center gap-8 px-16 py-8 bg-white text-black rounded-full font-sans text-[16px] font-bold uppercase tracking-[0.3em] hover:bg-white/90 transition-all hover:scale-110 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
        >
          Initialize Swarm
          <ArrowUpRight className="w-6 h-6" />
        </Link>
      </motion.div>

      {/* Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[160px] pointer-events-none opacity-50" />
      
      {/* Decorative architectural layout lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none grid-lines" 
           style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "120px 120px" }} />
    </section>
  );
}
