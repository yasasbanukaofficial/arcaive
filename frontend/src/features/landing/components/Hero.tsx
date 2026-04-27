"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-40 pb-20 flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative z-10 w-full max-w-[1400px] px-6 mx-auto flex flex-col items-center pointer-events-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex items-center gap-3 px-5 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10"
        >
          <span className="font-mono text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">
            System.Protocol(Alpha) — Ready
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-[64px] sm:text-[100px] lg:text-[160px] font-medium leading-[0.8] tracking-[-0.06em] text-white max-w-[1200px] text-center"
        >
          Automate your <br />
          <span className="text-white/20 italic font-light">next move.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-[20px] sm:text-[24px] text-white/30 max-w-[600px] leading-[1.3] mt-16 mb-20 text-center font-light tracking-tight italic"
        >
          A sovereign digital engine designed to uncover, align, and secure high-signal career opportunities autonomously.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-12"
        >
          <Link 
            href="/register" 
            className="group flex items-center gap-6 px-12 py-6 bg-white text-black rounded-full font-sans text-[15px] font-bold uppercase tracking-[0.2em] hover:bg-white/90 transition-all active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
          >
            Join the Swarm
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
          
          <Link 
            href="/methodology" 
            className="font-sans text-[12px] font-bold uppercase tracking-[0.2em] text-white/20 hover:text-white transition-all flex items-center gap-4 group"
          >
            <span className="w-10 h-[1px] bg-white/10 group-hover:w-16 group-hover:bg-white transition-all" />
            Methodology
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating System HUD */}
      <div className="absolute bottom-12 left-10 hidden lg:flex flex-col gap-2 font-mono text-[9px] text-white/30 uppercase tracking-[2px]">
        <span>Status: Stable</span>
        <span>Network: Encrypted</span>
      </div>
      <div className="absolute bottom-12 right-10 hidden lg:flex flex-col items-end gap-2 font-mono text-[9px] text-white/30 uppercase tracking-[2px]">
        <span>Model: Arcaive_v4.2</span>
        <span>Latency: 14ms</span>
      </div>
    </section>
  );
}
