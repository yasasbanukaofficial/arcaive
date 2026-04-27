"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Floating elements
  const floatingAgents = [
    { name: "CV Analyst", top: "15%", left: "10%", delay: 0 },
    { name: "Interview Prep", top: "65%", left: "12%", delay: 1.5 },
    { name: "Job Matcher", top: "25%", right: "10%", delay: 0.5 },
    { name: "Auto-Apply", top: "70%", right: "12%", delay: 2 },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col bg-[#FAF9F6] overflow-hidden items-center justify-center pt-32 pb-40"
    >
      {/* Editorial Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "100px 100px" }} />

      {/* Atmospheric Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-orange-100/30 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-blue-100/30 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Agents */}
      {floatingAgents.map((agent) => (
        <motion.div
          key={agent.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -20, 0] }}
          transition={{
            opacity: { duration: 1.5, delay: agent.delay },
            y: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: agent.delay }
          }}
          className="absolute hidden xl:flex items-center gap-3 bg-white/40 backdrop-blur-3xl px-6 py-3 rounded-full border border-black/[0.03] shadow-2xl hover:scale-110 transition-transform duration-500 cursor-default"
          style={{ top: agent.top, ...(agent.left ? { left: agent.left } : { right: agent.right }) }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-black/80 shadow-[0_0_10px_rgba(0,0,0,0.1)]" />
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-black/40">
            {agent.name}
          </span>
        </motion.div>
      ))}

      {/* Main Content */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 w-full max-w-[1400px] px-6 mx-auto flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex items-center gap-3 px-5 py-2 bg-white/50 backdrop-blur-md rounded-full border border-black/[0.03] shadow-sm"
        >
          <span className="font-sans text-[11px] font-bold text-black uppercase tracking-[0.2em]">
            Now globally available
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-[64px] sm:text-[90px] lg:text-[130px] font-medium leading-[0.85] tracking-[-0.06em] text-black max-w-[1100px] text-center"
        >
          Careers for people,<br />
          <span className="text-black/20 italic">automated</span> for life.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-[20px] sm:text-[24px] text-black/50 max-w-[700px] leading-[1.4] mt-12 mb-16 text-center font-light tracking-tight"
        >
          A digital intelligence that uncovers hidden roles, aligns your achievements, and secures your entry into the world's leading companies.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-10"
        >
          <Link href="/register" className="flex items-center gap-4 px-10 py-5 bg-black text-white rounded-full font-sans text-[15px] font-bold uppercase tracking-widest hover:bg-black/80 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:-translate-y-1">
            Build your profile
            <ArrowUpRight className="w-5 h-5" />
          </Link>
          <Link href="#howitworks" className="font-sans text-[12px] font-bold uppercase tracking-[0.2em] text-black/30 hover:text-black transition-all duration-500 flex items-center gap-3 group">
            <span className="w-10 h-[1px] bg-black/10 group-hover:w-14 group-hover:bg-black transition-all" />
            Discover the Engine
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-20 bg-black/5 overflow-hidden">
          <motion.div
            animate={{
              y: ["-100%", "100%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            className="w-full h-full bg-black/40"
          />
        </div>
      </motion.div>
    </section>
  );
}
