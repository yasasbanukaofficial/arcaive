"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { bounceIn } from "@/components/animations/variants";

export default function SubscriptionSuccessPage() {
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
                className="relative"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-[#4a7c59]/10 border border-[#4a7c59]/30 rounded-[24px]">
                  <CheckCircle2
                    size={44}
                    className="text-[#e6efdf]"
                    strokeWidth={1.5}
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 1.5],
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.4,
                    repeat: 2,
                    repeatDelay: 1,
                  }}
                  className="absolute inset-0 border-2 border-[#e6efdf]/50 rounded-[24px]"
                />
              </motion.div>
            </motion.div>

            <div className="space-y-3 mb-10">
              <motion.h1
                variants={bounceIn}
                className="text-3xl sm:text-4xl font-bold text-[#e4e4e4] tracking-tight"
              >
                Welcome to Pro!
              </motion.h1>
              <motion.p
                variants={bounceIn}
                className="text-[15px] text-white/50 leading-relaxed"
              >
                Your subscription has been activated successfully. You now have access to all premium features.
              </motion.p>
            </div>

            <motion.div variants={bounceIn}>
              <Link href="/overview" className="block">
                <button
                  className="w-full h-14 px-8 font-bold text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-[0.98] bg-[#e6efdf] text-[#111111] rounded-[24px]"
                >
                  Go to Dashboard
                  <ArrowRight size={16} />
                </button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.p
            variants={bounceIn}
            className="text-center text-[11px] font-bold uppercase tracking-widest text-white/30 mt-6"
          >
            A confirmation email has been sent to your inbox
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
