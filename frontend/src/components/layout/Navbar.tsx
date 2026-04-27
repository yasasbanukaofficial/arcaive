"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-10 py-10 flex items-center justify-between pointer-events-none">
        
        {/* Left Logo */}
        <div className="pointer-events-auto">
          <Link href="/" className="font-sans text-[20px] font-bold tracking-tight text-[var(--text-primary)]">
            ARCAIVE
          </Link>
        </div>

        {/* Right Navigation */}
        <div className="hidden lg:flex items-center gap-12 pointer-events-auto">
          <Link href="#intro" className="oryzo-label group relative">
            INTRO
            <span className="absolute -bottom-2 left-0 right-0 h-[1px] bg-[var(--text-primary)]" />
          </Link>
          <Link href="#features" className="oryzo-label hover:text-[var(--text-primary)] transition-colors">
            FEATURES
          </Link>
          <Link href="#benefits" className="oryzo-label hover:text-[var(--text-primary)] transition-colors">
            PRODUCT
          </Link>
          <Link href="#faq" className="oryzo-label hover:text-[var(--text-primary)] transition-colors">
            CONTACT
          </Link>
        </div>
      </nav>

      {/* Floating Right Bar */}
      <div className="fixed right-0 top-32 z-40 bg-[#f0ead6] text-[#0A0908] px-2 py-8 pointer-events-auto shadow-[0_0_20px_rgba(0,0,0,0.5)]">
         <div className="writing-vertical-rl rotate-180 flex items-center gap-4">
           <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
           <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
             ARCAIVE-1 MODEL
           </span>
         </div>
      </div>
    </>
  );
}
