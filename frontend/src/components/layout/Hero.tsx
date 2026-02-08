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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-screen flex flex-col items-center justify-center overflow-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-32"
    >
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

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer(0.3, 0.5)}
        className="relative z-10 text-center max-w-[1200px] px-4 sm:px-6 mx-auto flex flex-col items-center gap-5 sm:gap-6 md:gap-8"
      >
        <motion.div
          variants={bounceIn}
          className="space-y-3 sm:space-y-4 host-grotesk"
        >
          <h1 className="text-[1.75rem] sm:text-[2.25rem] md:text-[3rem] lg:text-[4rem] tracking-[-0.04em] leading-[1.08] sm:leading-[1.05] md:leading-[1.02] text-white">
            <UnfoldText text="Where your seeking is automated" />
          </h1>

          <p className="dm-sans-300 text-[0.75rem] sm:text-[0.8125rem] md:text-[1rem] lg:text-[1.2rem] text-white/70 max-w-xs sm:max-w-md md:max-w-2xl mx-auto leading-relaxed">
            <UnfoldTextLetters
              text="An engine that does the hard work for you while you relax.
A digital intelligence that uncovers hidden roles, aligns your achievements, and secures your entry into the world’s leading companies."
            />
          </p>
        </motion.div>

        <motion.div variants={bounceIn}>
          <Link
            href="/journey"
            className="inline-flex items-center justify-center bg-white text-[#0f0f0f] px-7 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 h-[44px] sm:h-[48px] md:h-[52px] rounded-full font-semibold text-[13px] sm:text-sm md:text-base hover:bg-[rgb(213,255,69)] transition-all active:scale-95 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/10"
          >
            Begin Journey
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        variants={bounceIn}
        initial="hidden"
        animate="show"
        transition={{ delay: 2 }}
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
