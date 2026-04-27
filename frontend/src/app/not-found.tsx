"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#f8f8f8] selection:bg-[#f0ead6] selection:text-black">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="noise-overlay opacity-[0.04]" />
        <div className="bg-grid-mat opacity-[0.1]" style={{ backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)' }} />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] px-6 mx-auto flex flex-col items-center">
        {/* 3D Hero Section */}
        <div className="perspective-[2000px] mb-16 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, rotateY: -30, rotateX: 20, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              rotateY: [ -25, 25, -25 ],
              rotateX: [ 15, -15, 15 ],
              scale: 1,
              y: [ 0, -30, 0 ]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut",
              opacity: { duration: 1.2 }
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-64 h-64 sm:w-80 sm:h-80"
          >
            {/* Front Card - Highlight Section */}
            <div className="absolute inset-0 bg-[#f0ead6] border-2 border-black flex flex-col items-center justify-center shadow-[40px_60px_120px_-20px_rgba(240,234,214,0.4)]">
              <span className="font-display text-[140px] font-black leading-none tracking-tighter text-black">4</span>
              <div className="w-1/2 h-[1px] bg-black my-4" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.5em] text-black/40">Oryzo_Core</span>
            </div>
            
            {/* 3D Depth Layers */}
            <div 
              className="absolute inset-0 bg-white border border-black/10 transition-transform duration-300"
              style={{ transform: "translateZ(-40px) translateX(20px) translateY(20px)" }}
            />
            <div 
              className="absolute inset-0 bg-black/5 border border-black/5"
              style={{ transform: "translateZ(-80px) translateX(40px) translateY(40px)" }}
            />

            {/* Accented floating elements */}
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute -top-10 -left-10 w-20 h-20 border border-black/20 rounded-full flex items-center justify-center p-4"
            >
               <div className="w-1.5 h-1.5 bg-[#f0ead6] rounded-full" />
            </motion.div>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="flex items-center justify-center gap-4"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#f0ead6]" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-black/50">
              Session Interrupt
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#f0ead6]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="font-display text-6xl sm:text-8xl font-black tracking-tighter text-black uppercase leading-[0.85]"
          >
            Hmm... <br /> Not Found.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="font-sans text-base sm:text-lg text-black/40 max-w-md mx-auto leading-relaxed pt-2"
          >
            The architectural node you are seeking is either disconnected or restricted. Re-initialize your navigation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12"
          >
            <Link 
              href="/" 
              className="group flex items-center gap-6 px-12 py-5 bg-[#f0ead6] border border-black text-black font-mono text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:bg-black hover:text-white active:scale-95 shadow-[0_20px_40px_-10px_rgba(240,234,214,0.5)]"
              style={{ borderRadius: "var(--radius)" }}
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Initialize Base
            </Link>
            
            <Link 
              href="/jobs" 
              className="group flex items-center gap-6 px-12 py-5 border border-black/10 bg-white text-black/40 font-mono text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:border-black hover:text-black"
              style={{ borderRadius: "var(--radius)" }}
            >
              Discovery Hub
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Aesthetic Accents */}
      <div className="absolute hidden lg:block top-20 left-20 w-[1px] h-40 bg-gradient-to-b from-black/20 to-transparent" />
      <div className="absolute hidden lg:block top-20 left-20 w-40 h-[1px] bg-gradient-to-r from-black/20 to-transparent" />
      
      <div className="absolute hidden sm:flex bottom-10 inset-x-10 items-end justify-between font-mono text-[9px] text-black/30 uppercase tracking-[0.4em]">
        <div className="flex gap-8">
          <p>LOC: 404_VOID</p>
          <p>NET: ARCAIVE_MAIN</p>
        </div>
        <div className="text-right">
          <p>System status: functional</p>
          <p>© 2026 Arcaive Architecture — v2.0.4</p>
        </div>
      </div>
    </main>
  );
}
