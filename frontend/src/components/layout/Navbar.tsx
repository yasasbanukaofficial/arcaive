"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "How It Works", href: "#howitworks" },
    { name: "Benefits", href: "#benefits" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (
    e?: React.MouseEvent<HTMLAnchorElement> | null,
    href?: string
  ) => {
    try {
      if (e) e.preventDefault();
      setMobileMenuOpen(false);
      const targetHash = href ?? (e && (e.currentTarget.getAttribute("href") || ""));
      const id = targetHash ? targetHash.replace("#", "") : "";
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        const lenis = (window as any).lenis;
        if (lenis && typeof lenis.scrollTo === "function") {
          try { lenis.scrollTo(el, { duration: 1.2 }); } catch { el.scrollIntoView({ behavior: "smooth", block: "start" }); }
        } else {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        try { history.replaceState(null, "", `#${id}`); } catch {}
      }
    } catch { setMobileMenuOpen(false); }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] h-[90px] transition-all duration-700 flex items-center ${
          scrolled
            ? "h-[80px]"
            : "bg-transparent"
        }`}
      >
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group relative z-[120]">
            <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center bg-white group-hover:scale-110 transition-transform duration-500 shadow-sm overflow-hidden relative">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-black translate-y-1 group-hover:translate-y-0 transition-transform duration-500" />
              <span className="font-sans text-[16px] font-bold text-black italic">A</span>
            </div>
            <span className="font-sans text-[20px] font-medium tracking-tight text-black group-hover:translate-x-1 transition-transform duration-500">
              Arcaive<span className="text-black/20 text-[10px] align-super italic ml-0.5">INT</span>
            </span>
          </Link>

          {/* Desktop Nav - Pill Shape */}
          <div className="hidden lg:flex items-center bg-white/40 backdrop-blur-2xl border border-black/[0.03] rounded-full px-8 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-700 hover:shadow-[0_8px_40px_rgb(0,0,0,0.05)] hover:bg-white hover:border-black/[0.08]">
            <div className="flex items-center gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-black/40 hover:text-black transition-all duration-300 relative group/link py-1"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black transition-all duration-500 group-hover/link:w-full" />
                </Link>
              ))}
            </div>
          </div>

          {/* CTA + Menu */}
          <div className="flex items-center gap-5 relative z-[120]">
            <Link
              href="/register"
              className="hidden sm:inline-flex items-center gap-3 px-6 py-3 bg-white border border-black/5 rounded-full font-sans text-[13px] font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              Get Started
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-12 h-12 flex items-center justify-center bg-white border border-black/5 rounded-full text-black hover:bg-black hover:text-white transition-all duration-500 shadow-sm"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[110] bg-[#FAF9F6] lg:hidden flex flex-col items-center justify-center"
          >
            <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl" />
            
            <nav className="relative z-10 flex flex-col items-center gap-10">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className="block font-sans text-[42px] font-medium tracking-tighter text-black/30 hover:text-black transition-all duration-500"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.08 + 0.2 }}
                className="mt-12"
              >
                <Link href="/register" className="flex items-center gap-4 px-12 py-5 bg-black text-white rounded-full font-sans text-[16px] font-bold uppercase tracking-widest hover:bg-black/90 transition-all shadow-2xl">
                  Get Started
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
