"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const FinalCTASection = () => {
  return (
    <section className="py-32 px-6 lg:px-10 bg-black border-t border-white/[0.06] relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-lines opacity-20" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(209,255,0,0.1)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-[900px] mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-white/10" />
            <span className="font-mono text-[11px] text-[#D1FF00] tracking-[0.15em]">
              READY TO START
            </span>
            <div className="w-12 h-[1px] bg-white/10" />
          </div>

          <h2 className="font-sans text-[36px] sm:text-[56px] font-bold leading-[0.95] tracking-[-0.04em] text-white uppercase">
            Automate your<br />
            <span className="text-[#D1FF00]">biggest bottleneck.</span>
          </h2>

          <p className="font-sans text-[16px] sm:text-[18px] text-white/40 max-w-[500px] mx-auto leading-[1.7]">
            Experience the tool right now. Just dive in and see what AI can do for your career.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register" className="btn-primary">
              GET STARTED FREE
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Link>
            <Link href="#howitworks" className="btn-ghost">
              LEARN MORE
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
