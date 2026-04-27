"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-12 px-6 lg:px-10 border-t border-white/[0.06]">
      <div className="max-w-[1440px] mx-auto">
        {/* Top: Brand & Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#D1FF00] flex items-center justify-center">
              <span className="font-sans text-[14px] font-bold text-black">A</span>
            </div>
            <Link href="/" className="font-mono text-[20px] font-bold uppercase tracking-[0.2em] hover:text-[#D1FF00] transition-colors">
              ARCAIVE
            </Link>
          </div>

          <div className="w-full lg:w-auto">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] mb-4 text-white/30">
              Subscribe to updates
            </p>
            <form className="flex gap-0 w-full lg:w-[420px]" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="flex-1 bg-transparent border border-white/[0.08] px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.1em] text-white placeholder:text-white/20 focus:outline-none focus:border-[#D1FF00] transition-colors"
              />
              <button
                type="submit"
                className="bg-[#D1FF00] text-black border border-[#D1FF00] px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-white hover:border-white transition-colors"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-16 border-y border-white/[0.06]">
          {[
            {
              title: "PRODUCT",
              links: [
                { name: "FEATURES", href: "#features" },
                { name: "HOW IT WORKS", href: "#howitworks" },
                { name: "PRICING", href: "#pricing" },
              ],
            },
            {
              title: "SUPPORT",
              links: [
                { name: "FAQ", href: "#faq" },
                { name: "HELP CENTER", href: "#" },
                { name: "CONTACT", href: "#" },
              ],
            },
            {
              title: "LEGAL",
              links: [
                { name: "PRIVACY", href: "#" },
                { name: "TERMS", href: "#" },
                { name: "SECURITY", href: "#" },
              ],
            },
            {
              title: "CONNECT",
              links: [
                { name: "X / TWITTER", href: "#" },
                { name: "LINKEDIN", href: "#" },
                { name: "GITHUB", href: "#" },
              ],
            },
          ].map((section) => (
            <div key={section.title} className="flex flex-col gap-6">
              <h5 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">
                {section.title}
              </h5>
              <div className="flex flex-col gap-4">
                {section.links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/50 hover:text-[#D1FF00] transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/20">
            © {new Date().getFullYear()} ARCAIVE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/20">
              BUILT FOR <span className="text-[#D1FF00]/40">BUILDERS</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
