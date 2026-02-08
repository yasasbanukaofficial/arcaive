"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const UnfoldText = ({ text }: { text: string }) => {
  const words = text.split(" ");
  
  return (
    <span className="inline-flex flex-wrap justify-center gap-x-[0.2em] overflow-visible">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden py-[0.1em] -my-[0.1em]">
          <motion.span
            initial={{ opacity: 0, filter: "blur(8px)", y: "100%" }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 1,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Background Image */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.55 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/images/hero-bg.png"
          alt="Atmospheric Mountain Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0a0a0a]" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-[1200px] px-6 mx-auto flex flex-col items-center gap-16">
        <div className="space-y-6">
          <h1 className="text-[48px] md:text-[88px] font-bold tracking-[-0.04em] leading-[1] text-white">
            <UnfoldText text="Where thoughts become actions." />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-lg md:text-xl text-white font-medium max-w-2xl mx-auto leading-relaxed tracking-tight"
          >
            An AI companion that whispers clarity, conjures ideas, and guides your every move.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/journey"
            className="inline-flex items-center justify-center bg-white text-[#0f0f0f] px-10 py-4 h-[52px] rounded-full font-bold text-base hover:scale-[1.03] transition-all active:scale-95 shadow-[0_15px_30px_rgba(255,255,255,0.1)] group"
          >
            Begin Journey
            <span className="ml-2 group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1, delay: 2 }}
           className="flex flex-col items-center gap-4 mt-8"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/30 to-white/0" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
            Scroll to explore
          </span>
        </motion.div>
      </div>
    </section>
  );
}
