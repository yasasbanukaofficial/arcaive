"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full px-10 py-10 relative z-20 bg-[var(--bg-color)]">
      <div className="w-full h-[1px] bg-[var(--border-light)] mb-10" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="flex flex-col gap-6">
          <Link href="/" className="font-sans text-[20px] font-bold tracking-tight text-[var(--text-primary)]">
            ARCAIVE
          </Link>
          <p className="oryzo-label max-w-[200px]">
            THE AUTONOMOUS CAREER ENGINE.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <span className="oryzo-label mb-4 opacity-50">INTELLIGENCE</span>
          <Link href="#features" className="oryzo-label hover:text-[var(--text-primary)] transition-colors">FEATURES</Link>
          <Link href="#howitworks" className="oryzo-label hover:text-[var(--text-primary)] transition-colors">METHODOLOGY</Link>
          <Link href="#pricing" className="oryzo-label hover:text-[var(--text-primary)] transition-colors">TOPOLOGY</Link>
        </div>

        <div className="flex flex-col gap-4">
          <span className="oryzo-label mb-4 opacity-50">NETWORK</span>
          <Link href="#" className="oryzo-label hover:text-[var(--text-primary)] transition-colors">TWITTER</Link>
          <Link href="#" className="oryzo-label hover:text-[var(--text-primary)] transition-colors">LINKEDIN</Link>
        </div>

        <div className="flex flex-col justify-end text-right">
           <span className="oryzo-label opacity-50">© {new Date().getFullYear()} ARCAIVE INT.</span>
        </div>
      </div>
    </footer>
  );
}
