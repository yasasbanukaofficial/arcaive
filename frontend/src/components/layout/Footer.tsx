"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-60 pb-20 px-6 lg:px-12 border-t border-white/5 relative z-10">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start mb-40">
          {/* Logo & Vision */}
          <div className="lg:col-span-6 flex flex-col gap-16">
            <Link href="/" className="font-sans text-[24px] font-medium tracking-tight">
              Arcaive<span className="text-white/20 italic ml-1">INT</span>
            </Link>
            <p className="font-sans text-[32px] sm:text-[42px] leading-[1.1] tracking-tight text-white max-w-[500px] font-light">
              Engineered for the elite professional. Automate the search. Focus on the vision.
            </p>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24">
            <div className="flex flex-col gap-10">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.4em] text-white/30">Intelligence</span>
              <div className="flex flex-col gap-6">
                <Link href="#features" className="text-[14px] text-white/40 hover:text-white transition-all uppercase tracking-widest">Features</Link>
                <Link href="#howitworks" className="text-[14px] text-white/40 hover:text-white transition-all uppercase tracking-widest">Methodology</Link>
                <Link href="#pricing" className="text-[14px] text-white/40 hover:text-white transition-all uppercase tracking-widest">Topology</Link>
              </div>
            </div>
            <div className="flex flex-col gap-10">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.4em] text-white/30">Network</span>
              <div className="flex flex-col gap-6">
                <Link href="#" className="text-[14px] text-white/40 hover:text-white transition-all uppercase tracking-widest inline-flex items-center gap-1">Twitter <ArrowUpRight className="w-3 h-3" /></Link>
                <Link href="#" className="text-[14px] text-white/40 hover:text-white transition-all uppercase tracking-widest inline-flex items-center gap-1">LinkedIn <ArrowUpRight className="w-3 h-3" /></Link>
              </div>
            </div>
            <div className="flex flex-col gap-10">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.4em] text-white/30">Protocol</span>
              <div className="flex flex-col gap-6">
                <Link href="#" className="text-[14px] text-white/40 hover:text-white transition-all uppercase tracking-widest">Privacy</Link>
                <Link href="#" className="text-[14px] text-white/40 hover:text-white transition-all uppercase tracking-widest">Security</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-white/20">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.3em]">© {new Date().getFullYear()} Arcaive Intelligence Operational System.</p>
          <div className="flex items-center gap-12 font-mono text-[10px] uppercase tracking-[0.2em]">
            <span className="hover:text-white transition-colors cursor-default">Designed by V-INT</span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
              Status: Full Capacity
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
