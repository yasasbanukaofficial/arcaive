"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="bg-black py-48 px-6 lg:px-12 relative overflow-hidden flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1400px] mx-auto text-center"
      >
        <span className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-white/30 mb-12 block">Ready for the shift?</span>
        <h2 className="font-sans text-[64px] sm:text-[90px] lg:text-[140px] font-medium leading-[0.85] tracking-[-0.06em] text-white mb-16">
          Architect your<br />
          <span className="text-white/20 italic">next move.</span>
        </h2>
        
        <Link 
          href="/register" 
          className="inline-flex items-center gap-6 px-12 py-6 bg-white text-black rounded-full font-sans text-[15px] font-bold uppercase tracking-[0.2em] hover:bg-white/90 transition-all hover:scale-105"
        >
          Secure your entry
          <ArrowUpRight className="w-5 h-5" />
        </Link>
      </motion.div>

      {/* Decorative background grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "100px 100px" }} />
    </section>
  );
}
