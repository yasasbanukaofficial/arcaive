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
  title,
  subtitle,
  children,
}: Props) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white selection:bg-[#D4F461] selection:text-black">
      {/* Left Panel - Black Editorial */}
      <div className="hidden md:flex md:w-1/2 bg-black p-12 lg:p-16 flex-col justify-between text-white relative overflow-hidden">
        {/* Noise Overlay */}
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="font-mono text-[16px] font-bold uppercase tracking-[0.2em] mb-24">
            ARCAIVE
          </div>
          
          <h1 className="font-sans text-[48px] lg:text-[56px] font-bold leading-[1.1] tracking-[-0.03em] mb-8">
            Your career, <br />
            optimized.
          </h1>
          
          <div className="space-y-3 font-mono text-[11px] uppercase tracking-widest text-white/60">
            <p>— CV ANALYSIS</p>
            <p>— JOB MATCHING</p>
            <p>— MOCK INTERVIEWS</p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="font-sans text-[15px] text-white/40 max-w-sm leading-relaxed">
            Built for engineers who are serious about what comes next.
          </p>
        </div>
      </div>

      {/* Right Panel - White Form */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-[400px]">
          <header className="mb-10">
            <h2 className="font-sans text-[24px] font-bold text-black mb-2 tracking-tight">
              {title}
            </h2>
            <p className="font-sans text-[#888880] text-[14px]">
              {subtitle}
            </p>
          </header>

          <div className="space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
