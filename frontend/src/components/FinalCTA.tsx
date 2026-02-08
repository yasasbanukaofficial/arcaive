"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function FinalCTA() {
  return (
    <section className="relative py-48 px-6 overflow-hidden bg-[#0a0a0a]">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="Final CTA background"
          fill
          className="object-cover opacity-20 scale-125 saturate-0"
        />
        {/* Subtle radial gradient to focus center */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 max-w-[800px] mx-auto text-center space-y-12">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
           className="space-y-6"
        >
          <h2 className="text-[40px] md:text-[64px] font-bold tracking-[-0.04em] leading-[1] text-white">
            Step into the future, <br />
            <span className="text-white/40">guided by AI clarity.</span>
          </h2>
          <p className="text-white/40 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
            Experience the tool right now. Just dive in and see what AI can do for you.
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/get-started"
            className="inline-flex items-center justify-center bg-white text-[#0f0f0f] px-12 py-4 h-[56px] rounded-full font-bold text-base hover:scale-[1.03] transition-all active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.15)]"
          >
            Try It Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
