"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { bounceIn } from "@/components/animations/variants";

export default function SubscriptionCancelPage() {
  return (
    <div className="min-h-screen w-full bg-[#0e0e0e] flex flex-col font-sans text-[#e4e4e4]">
      {/* Dark Ambient Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
             backgroundSize: '40px 40px' 
           }} 
      />

      <header className="relative z-10 p-6">
        <Logo size={32} href="/overview" />
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial="hidden"
          animate="show"
          className="w-full max-w-[440px]"
        >
          <motion.div
            variants={bounceIn}
            className="relative overflow-hidden p-10 sm:p-12 text-center bg-[#161616] border border-[#2a2a2a] rounded-[24px]"
          >
            <motion.div
              variants={bounceIn}
              className="flex justify-center mb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-red-500/10 border border-red-500/30 rounded-[24px]">
                  <XCircle
                    size={44}
                    className="text-red-400"
                    strokeWidth={1.5}
                  />
                </div>
              </motion.div>
            </motion.div>

            <div className="space-y-3 mb-10">
              <motion.h1
                variants={bounceIn}
                className="text-3xl sm:text-4xl font-bold text-[#e4e4e4] tracking-tight"
              >
                Payment Cancelled
              </motion.h1>
              <motion.p
                variants={bounceIn}
                className="text-[15px] text-white/50 leading-relaxed"
              >
                Your payment was not processed. No charges have been made to your account.
              </motion.p>
            </div>

            <motion.div
              variants={bounceIn}
              className="flex flex-col sm:flex-row gap-3 mt-4"
            >
              <Link href="/subscription" className="flex-1">
                <button
                  className="w-full h-14 px-4 font-bold text-[12px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] bg-[#e6efdf] text-[#111111] rounded-[24px]"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              </Link>
              <Link href="/overview" className="flex-1">
                <button
                  className="w-full h-14 px-4 font-bold text-[12px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-[#2a2a2a] active:scale-[0.98] border border-[#2a2a2a] bg-[#1f1f1f] text-white rounded-[24px]"
                >
                  <ArrowLeft size={16} />
                  Go Back
                </button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.p
            variants={bounceIn}
            className="text-center text-[11px] font-bold uppercase tracking-widest text-white/30 mt-6"
          >
            Need help?{" "}
            <Link
              href="/settings"
              className="text-white/50 hover:text-white transition-colors underline underline-offset-2"
            >
              Contact support
            </Link>
          </motion.p>
        </motion.div>
      </main>

      <footer className="relative z-10 py-8 text-center border-t border-[#2a2a2a]">
        <div className="flex items-center justify-center gap-2 opacity-30 grayscale hover:grayscale-0 cursor-default">
          <div className="w-1 h-1 bg-[#2a2a2a]" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
            Harness Invisible Power
          </span>
          <div className="w-1 h-1 bg-[#2a2a2a]" />
        </div>
      </footer>
    </div>
  );
}
