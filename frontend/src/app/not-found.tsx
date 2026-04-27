"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { bounceIn, staggerContainer } from "@/components/animations/variants";

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full bg-[#0a0a0a] text-white overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/not-found.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="absolute inset-0 z-1 opacity-[0.035] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 pointer-events-none" />

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer(0.15, 0.2)}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto"
      >

        <motion.p
          variants={bounceIn}
          className="text-[11px] uppercase tracking-[0.3em] font-semibold text-white/40 mb-4"
        >
          Error 404
        </motion.p>

        <motion.h1
          variants={bounceIn}
          className="text-[4rem] sm:text-[6rem] md:text-[8rem] font-bold tracking-[-0.05em] leading-none text-white mb-6"
          style={{ textShadow: "0 0 80px rgba(255,255,255,0.12)" }}
        >
          Lost.
        </motion.h1>

        <motion.p
          variants={bounceIn}
          className="text-[15px] sm:text-[17px] text-white/50 leading-relaxed mb-10 max-w-md"
        >
          This page doesn't exist, or it was moved somewhere.
        </motion.p>

        <motion.div
          variants={bounceIn}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            href="/"
            className="group flex items-center gap-2 px-6 py-3  bg-white text-black text-[13px] font-semibold  duration-200 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to home
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 px-6 py-3  border border-white/15 bg-white/5 backdrop-blur-sm text-white/70 text-[13px] font-medium  duration-200 hover:bg-white/10 hover:border-white/25 hover:text-white"
          >
            Sign in
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 z-10 flex items-center justify-center gap-2 opacity-20"
      >
        <div className="w-1 h-1  bg-white" />
        <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-white">
          Harness Invisible Power
        </span>
        <div className="w-1 h-1  bg-white" />
      </motion.div>
    </main>
  );
}
