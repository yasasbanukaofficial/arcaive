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
          <span className="oryzo-label mb-4 opacity-50">QUICK LINKS</span>
          <Link href="#intro" className="oryzo-label hover:text-[var(--text-primary)] transition-colors">INTRO</Link>
          <Link href="#features" className="oryzo-label hover:text-[var(--text-primary)] transition-colors">FEATURES</Link>
          <Link href="#benefits" className="oryzo-label hover:text-[var(--text-primary)] transition-colors">PRODUCT</Link>
          <Link href="#pricing" className="oryzo-label hover:text-[var(--text-primary)] transition-colors">PRICING</Link>
          <Link href="#faq" className="oryzo-label hover:text-[var(--text-primary)] transition-colors">CONTACT</Link>
        </div>

        <div className="flex flex-col gap-4">
          <span className="oryzo-label mb-4 opacity-50">NETWORK</span>
          <a href="https://www.linkedin.com/in/yasasbanukagunasena/" target="_blank" rel="noopener noreferrer" className="oryzo-label hover:text-[var(--text-primary)] transition-colors">LINKEDIN</a>
          <a href="https://github.com/yasasbanukaofficial" target="_blank" rel="noopener noreferrer" className="oryzo-label hover:text-[var(--text-primary)] transition-colors">GITHUB</a>
        </div>

        <div className="flex flex-col justify-end text-right">
           <span className="oryzo-label opacity-50">© {new Date().getFullYear()} ARCAIVE by YASAS BANU.</span>
        </div>
      </div>
    </footer>
  );
}
