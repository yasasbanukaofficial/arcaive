"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="scene-section h-screen items-start pt-[15vh]">
      <div className="w-full relative z-10 flex flex-col justify-between h-full pb-12">
        
        {/* Massive Top Heading */}
        <div className="flex flex-col w-full relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mb-2 oryzo-label ml-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#f0ead6]" />
            MADE FOR MACHINES. BUILT FOR HUMANS.
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[var(--text-primary)] w-full block"
          >
            ARCAIVE
          </motion.h1>
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
              <p className="font-sans text-[14px] text-right text-white/70">
                The world's most<br/>
                unnecessarily<br/>
                sophisticated application engine.
              </p>
            </div>
          </motion.div>

          <div className="lg:col-span-4 lg:col-start-9 flex flex-col items-end justify-end pb-8">
             <Link href="/register" className="group flex items-center justify-center gap-4 border border-[#f0ead6] rounded-sm px-10 py-5 hover:bg-[#f0ead6] hover:text-[#0A0908] transition-colors duration-500">
               <span className="oryzo-label group-hover:text-[#0A0908]">INITIALIZE</span>
               <ArrowUpRight className="w-4 h-4" />
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
        <div className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center">
           <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </div>
        <span className="oryzo-label">SCROLL TO CONTINUE</span>
      </motion.div>
    </section>
  );
}
