"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-12 px-6">
      <div className="max-w-[1440px] mx-auto">
        {/* Top Row: Wordmark & Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-20">
          <Link href="/" className="font-mono text-[24px] font-bold uppercase tracking-[0.2em]">
            ARCAIVE
          </Link>
          
          <div className="w-full lg:w-auto">
            <p className="font-mono text-[11px] uppercase tracking-widest mb-4 text-white/50">
              Subscribe to updates
            </p>
            <form className="flex gap-0 w-full lg:w-[400px]" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="flex-1 bg-black border border-white px-4 py-3 font-mono text-[12px] uppercase tracking-widest focus:outline-none"
              />
              <button
                type="submit"
                className="bg-white text-black border border-white px-6 py-3 font-mono text-[12px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Middle Row: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-20 border-y border-white/20">
          <div className="flex flex-col gap-6">
            <h5 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">PRODUCT</h5>
            <div className="flex flex-col gap-4 font-mono text-[11px] uppercase tracking-widest">
              <Link href="#features" className="hover:text-[#D4F461] transition-colors">FEATURES</Link>
              <Link href="#howitworks" className="hover:text-[#D4F461] transition-colors">HOW IT WORKS</Link>
              <Link href="#pricing" className="hover:text-[#D4F461] transition-colors">PRICING</Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h5 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">SUPPORT</h5>
            <div className="flex flex-col gap-4 font-mono text-[11px] uppercase tracking-widest">
              <Link href="#faq" className="hover:text-[#D4F461] transition-colors">FAQ</Link>
              <Link href="#" className="hover:text-[#D4F461] transition-colors">HELP CENTER</Link>
              <Link href="#" className="hover:text-[#D4F461] transition-colors">CONTACT</Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h5 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">LEGAL</h5>
            <div className="flex flex-col gap-4 font-mono text-[11px] uppercase tracking-widest">
              <Link href="#" className="hover:text-[#D4F461] transition-colors">PRIVACY</Link>
              <Link href="#" className="hover:text-[#D4F461] transition-colors">TERMS</Link>
              <Link href="#" className="hover:text-[#D4F461] transition-colors">SECURITY</Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h5 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">CONNECT</h5>
            <div className="flex flex-col gap-4 font-mono text-[11px] uppercase tracking-widest">
              <Link href="#" className="hover:text-[#D4F461] transition-colors">X / TWITTER</Link>
              <Link href="#" className="hover:text-[#D4F461] transition-colors">LINKEDIN</Link>
              <Link href="#" className="hover:text-[#D4F461] transition-colors">GITHUB</Link>
            </div>
          </div>
        </div>

        {/* Bottom Row: Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-12">
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/30">
            © {new Date().getFullYear()} ARCAIVE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/30">
              BUILT FOR BUILDERS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
