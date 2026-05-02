"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/features/dashboard/components/ThemeContext";

export default function Hero() {
  const { isDark } = useTheme();

  return (
    <section className="scene-section h-screen items-start pt-[15vh]">
      <div className="w-full relative z-10 flex flex-col justify-between h-full pb-12">
        
        {/* Massive Top Heading */}
        <div className="flex flex-col w-full relative pt-[30vh] lg:pt-32">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[var(--text-primary)] w-full block transition-all"
            style={{
              WebkitTextStroke: isDark ? "3px #000000" : "4px #ffffff",
              paintOrder: "stroke fill",
              textShadow: isDark 
                ? "0 0 40px rgba(255,255,255,0.05), 0 0 80px rgba(226, 62, 62, 0.1)" 
                : "0 0 40px rgba(0,0,0,0.05)"
            }}
          >
            ARCAIVE
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mt-4 oryzo-label ml-2"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--accent-brand)]" />
            Built for your career assistance.
          </motion.div>
        </div>

        {/* Bottom floating panels - Left and Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full gap-8 mt-auto">
          
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
             className="lg:col-span-4 oryzo-panel flex flex-col justify-between min-h-[300px]"
          >
            <h3 className="font-sans text-[22px] font-bold tracking-tight leading-[1.2] mb-12">
              DESIGNED BY AI,<br/>
              FOR THE MODERN<br/>
              JOB SEEKER.
            </h3>
            
            <div className="mt-auto">
              <div className="w-full h-[1px] bg-[var(--glass-bg)]/20 mb-6" />
              <div className="w-full h-[1px] bg-[var(--text-primary)]/20 mb-6" />
              <p className="font-sans text-[14px] text-right text-[var(--text-primary)]">
                The world's most<br/>
                unnecessarily<br/>
                sophisticated application engine.
              </p>
            </div>
          </motion.div>

          <div className="lg:col-span-4 lg:col-start-9 flex flex-col items-end justify-end pb-8">
            <Link href="/register" className="btn-hover group flex items-center justify-center gap-4 border border-[var(--text-primary)] text-[var(--text-primary)] rounded-sm px-10 py-5 transition-colors duration-500">
              <span className="oryzo-label text-[36px] sm:text-[40px] btn-hover-text">INITIALIZE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] btn-hover-dot transition-colors" />
            </Link>
            
            <Link href="#features" className="oryzo-label opacity-40 hover:opacity-100 transition-opacity mt-6">
              BROWSE ARCHITECTURE
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll to continue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4"
      >
        <div className="w-6 h-6 rounded-full border border-[var(--border-light)] flex items-center justify-center">
           <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </div>
        <span className="oryzo-label">SCROLL TO CONTINUE</span>
      </motion.div>
    </section>
  );
}
