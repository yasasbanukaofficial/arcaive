"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import UnfoldText from "@/components/ui/UnfoldText";
import UnfoldTextLetters from "@/components/ui/UnfoldTextLetters";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0">
            <Image
              src="/images/lg-bg.png"
              alt=""
              fill
              className="object-cover object-center"
              unoptimized
              sizes="100vw"
            />
          </div>
        </motion.div>
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-[1200px] px-6 mx-auto flex flex-col items-center gap-8">
        <div className="space-y-4 host-grotesk">
          <h1 className="text-[2.5rem] md:text-[4rem] tracking-[-0.04em] leading-[1.02] text-white">
            <UnfoldText text="Where your career is automated" />
          </h1>

          <p className="dm-sans-300 text-[0.8125rem] md:text-[1.2rem] text-white/70 max-w-2xl mx-auto leading-relaxed">
            <UnfoldTextLetters text="An AI companion that whispers clarity, conjures ideas, and guides your every move." />
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <Link
            href="/journey"
            className="inline-flex items-center justify-center bg-white text-[#0f0f0f] px-10 py-4 h-[52px] rounded-full font-semibold text-base hover:bg-[rgb(213,255,69)] transition-all active:scale-95 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/10"
          >
            Begin Journey
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator pinned to bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 pointer-events-none"
      >
        <svg
          className="w-5 h-5 text-white/30"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5v14m0 0l-7-7m7 7l7-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold"
          style={{ pointerEvents: "auto" }}
        >
          Scroll to explore
        </span>
      </motion.div>
    </section>
  );
}
