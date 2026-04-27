"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-hidden flex flex-col items-center justify-center">
      {/* Grid background */}
      <div className="absolute inset-0 grid-lines opacity-20" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(209,255,0,0.08)_0%,_transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#D1FF00] mb-6">
          ERROR 404
        </p>

        <h1
          className="text-[5rem] sm:text-[7rem] md:text-[9rem] font-bold tracking-[-0.05em] leading-none text-white mb-6 uppercase"
          style={{ textShadow: "0 0 80px rgba(209, 255, 0, 0.12)" }}
        >
          Lost.
        </h1>

        <p className="font-sans text-[15px] sm:text-[17px] text-white/40 leading-relaxed mb-10 max-w-md">
          This page doesn&apos;t exist, or it was moved somewhere.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2 bg-[#D1FF00] text-[var(--text-primary)] px-6 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-[var(--glass-bg)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 px-6 py-3 border border-white/[0.08] bg-[var(--glass-bg)]/[0.02] backdrop-blur-sm text-white/60 font-mono text-[12px] uppercase tracking-[0.1em] hover:bg-[var(--glass-bg)]/[0.06] hover:border-white/[0.15] hover:text-white transition-all"
          >
            Sign in
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 z-10 flex items-center justify-center gap-3 opacity-20"
      >
        <div className="w-1 h-1 bg-[#D1FF00]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white">
          ARCAIVE
        </span>
        <div className="w-1 h-1 bg-[#D1FF00]" />
      </motion.div>
    </main>
  );
}
