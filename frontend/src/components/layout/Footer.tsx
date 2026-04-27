"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-black pt-40 pb-20 px-6 lg:px-12 border-t border-black/[0.03]">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start mb-40">
          {/* Logo & Vision */}
          <div className="lg:col-span-6 flex flex-col gap-12">
            <Link href="/" className="font-sans text-[24px] font-medium tracking-tight">
              Arcaive<span className="text-black/20 italic ml-1">INT</span>
            </Link>
            <p className="font-sans text-[32px] sm:text-[42px] leading-[1.1] tracking-tight text-black max-w-[500px]">
              Engineered for the elite professional. Automate the search. Focus on the vision.
            </p>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24">
            <div className="flex flex-col gap-8">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-black/30">Intelligence</span>
              <div className="flex flex-col gap-4">
                <Link href="#features" className="text-[14px] text-black/50 hover:text-black transition-colors">Features</Link>
                <Link href="#howitworks" className="text-[14px] text-black/50 hover:text-black transition-colors">Methodology</Link>
                <Link href="#pricing" className="text-[14px] text-black/50 hover:text-black transition-colors">Investment</Link>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-black/30">Connect</span>
              <div className="flex flex-col gap-4">
                <Link href="#" className="text-[14px] text-black/50 hover:text-black transition-colors inline-flex items-center gap-1">Twitter <ArrowUpRight className="w-3 h-3" /></Link>
                <Link href="#" className="text-[14px] text-black/50 hover:text-black transition-colors inline-flex items-center gap-1">LinkedIn <ArrowUpRight className="w-3 h-3" /></Link>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-black/30">Legal</span>
              <div className="flex flex-col gap-4">
                <Link href="#" className="text-[14px] text-black/50 hover:text-black transition-colors">Privacy</Link>
                <Link href="#" className="text-[14px] text-black/50 hover:text-black transition-colors">Security</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-black/[0.06] flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-black/20">© {new Date().getFullYear()} Arcaive Intelligence. All rights reserved.</p>
          <div className="flex items-center gap-12">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-black/20">Designed by V</span>
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-black/20">Status: Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
