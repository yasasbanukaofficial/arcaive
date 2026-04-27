"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const floatingTags = [
  { label: "Agent Recruiter", delay: 0 },
  { label: "Agent Optimizer", delay: 0.5 },
];

const FinalCTASection = () => {
  return (
    <section className="py-48 px-6 lg:px-12 bg-[#FAF9F6] relative overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">
      {/* Dramatic Background Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-200/20 rounded-full blur-[140px] animate-pulse-slow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Floating Echoes */}
      {floatingTags.map((tag, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
          transition={{ 
            opacity: { duration: 1, delay: tag.delay },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: tag.delay }
          }}
          className={`absolute hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-sm border border-black/5 font-sans text-[10px] font-bold text-black uppercase tracking-widest ${
            i === 0 ? "top-1/4 left-1/4" : "bottom-1/4 right-1/4"
          }`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-black/40" />
          {tag.label}
        </motion.div>
      ))}

      <div className="max-w-[900px] mx-auto text-center relative z-10 w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12 flex flex-col items-center w-full"
        >
          <div className="flex flex-col items-center gap-4">
            <span className="label-mono opacity-40">08 — Get Started</span>
          </div>

          <h2 className="font-sans text-[56px] sm:text-[80px] lg:text-[110px] font-medium leading-[0.9] tracking-[-0.05em] text-black">
            Automate your<br />
            <span className="text-black/60 italic">bottleneck.</span>
          </h2>

          <p className="font-sans text-[18px] sm:text-[22px] font-light text-black/40 max-w-[500px] mx-auto leading-[1.6]">
            Experience the tool right now. Just dive in and see what AI can do for your career.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 w-full max-w-[440px]">
            <Link href="/register" className="btn-icon-capsule scale-125 w-full justify-center group shadow-2xl">
              <span className="icon-circle group-hover:bg-black group-hover:text-white transition-colors duration-500">
                <ArrowRight className="w-4 h-4" />
              </span>
              Start for Free
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
