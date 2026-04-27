"use client";
import React from "react";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";

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
    <div className="min-h-screen w-full relative flex flex-col bg-[var(--bg-color)] text-[var(--text-primary)] selection:bg-[var(--text-primary)] selection:text-[var(--bg-color)] overflow-x-hidden">
      
      {/* Background Graphic */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-center">
        <div className="w-[1px] h-full bg-gradient-to-b from-[var(--text-primary)]/0 via-[var(--text-primary)]/10 to-[var(--text-primary)]/0" />
      </div>

      <div className="w-full relative z-50">
        <Navbar />
      </div>

      <main className="flex-1 w-full flex flex-col items-center justify-center p-6 lg:p-12 relative z-10 pt-24 lg:pt-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.94, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px] mx-auto"
        >
          <header className="mb-10 text-center">
            <h1 className="font-sans text-[28px] font-semibold text-[var(--text-primary)] tracking-tight mb-4">
              {title}
            </h1>
            <p className="font-sans text-[15px] text-[var(--text-secondary)]">
              {subtitle}
            </p>
          </header>

          <div className="space-y-6">
            {children}
          </div>
        </motion.div>
      </main>
      
    </div>
  );
}
