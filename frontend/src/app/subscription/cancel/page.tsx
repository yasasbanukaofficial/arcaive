"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { bounceIn } from "@/components/animations/variants";

export default function SubscriptionCancelPage() {
  return (
    <div className="min-h-screen w-full bg-[#0a0c0d] flex flex-col font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-500/5 blur-[120px] rounded-full opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[300px] h-[200px] bg-white/5 blur-[80px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      </div>

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
            className="relative overflow-hidden rounded-2xl p-10 sm:p-12 text-center"
            style={{
              backgroundColor: "rgba(18, 18, 18, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
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
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center bg-red-500/10 border border-red-500/30">
                  <XCircle
                    size={44}
                    className="text-red-400"
                    strokeWidth={1.5}
                  />
                </div>
              </motion.div>
            </motion.div>

            <div className="space-y-3 mb-8">
              <motion.h1
                variants={bounceIn}
                className="text-3xl sm:text-4xl font-semibold text-white tracking-tight"
              >
                Payment Cancelled
              </motion.h1>
              <motion.p
                variants={bounceIn}
                className="text-[15px] text-white/60 leading-relaxed"
              >
                Your payment was not processed. No charges have been made to your account.
              </motion.p>
            </div>

            <motion.div
              variants={bounceIn}
              className="flex flex-col sm:flex-row gap-3 mt-4"
            >
              <Link href="/subscription" className="flex-1">
                <Button
                  variant="white"
                  size="lg"
                  fullWidth
                  icon={<RefreshCw size={18} />}
                  iconPosition="right"
                  className="font-semibold py-3.5 rounded-full"
                >
                  Try Again
                </Button>
              </Link>
              <Link href="/overview" className="flex-1">
                <Button
                  variant="white"
                  size="lg"
                  fullWidth
                  icon={<ArrowLeft size={18} />}
                  iconPosition="right"
                  className="font-semibold py-3.5 rounded-full"
                >
                  Go Back
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.p
            variants={bounceIn}
            className="text-center text-[13px] text-white/40 mt-6"
          >
            Need help?{" "}
            <Link
              href="/settings"
              className="text-white/60 hover:text-white/80 transition-colors underline underline-offset-2"
            >
              Contact support
            </Link>
          </motion.p>
        </motion.div>
      </main>

      <footer className="relative z-10 py-8 text-center border-t border-white/5">
        <div className="flex items-center justify-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
          <div className="w-1 h-1 rounded-full bg-white" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
            Harness Invisible Power
          </span>
          <div className="w-1 h-1 rounded-full bg-white" />
        </div>
      </footer>
    </div>
  );
}
