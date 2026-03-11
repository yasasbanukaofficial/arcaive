"use client";
import React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

type Props = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function AuthLayout({
  title = "Welcome back",
  subtitle = "Continue your journey with your silent AI companion.",
  children,
}: Props) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen w-full bg-[#0a0c0d] text-gray-200 flex flex-col font-sans selection:bg-white/20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[300px] h-[200px] bg-white/5 blur-[80px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          key={pathname}
          initial="hidden"
          animate="show"
          className="w-full max-w-[420px]"
        >
          <header className="text-center mb-10">
            <h1 className="text-4xl font-medium text-white mb-3 tracking-tight">
              {title}
            </h1>
            <p className="text-gray-400 text-[15px] leading-relaxed">
              {subtitle}
            </p>
          </header>

          <div className="space-y-6">{children}</div>
        </motion.div>
      </main>

      <footer className="relative z-10 py-8 text-center border-t border-white/5">
        <div className="flex items-center justify-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
          <div className="w-1 h-1 rounded-full bg-white"></div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
            Harness Invisible Power
          </span>
          <div className="w-1 h-1 rounded-full bg-white"></div>
        </div>
      </footer>
    </div>
  );
}
