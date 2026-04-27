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
        className={`fixed top-0 left-0 right-0 z-[100] h-[72px] transition-all duration-500 ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="h-full max-w-[1440px] mx-auto px-6 lg:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-[#D1FF00] flex items-center justify-center">
              <span className="font-sans text-[14px] font-bold text-black">A</span>
            </div>
            <span className="font-mono text-[13px] font-bold text-white uppercase tracking-[0.2em] group-hover:text-[#D1FF00] transition-colors">
              ARCAIVE
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/40 hover:text-white transition-colors duration-300 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D1FF00] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* CTA + Menu */}
          <div className="flex items-center gap-4">
            <Link
              href="/register"
              className="hidden sm:inline-flex items-center gap-2 bg-[#D1FF00] text-black px-6 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-white transition-colors duration-300"
            >
              Get Started
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2 hover:text-[#D1FF00] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black lg:hidden flex flex-col overflow-hidden"
          >
            <div className="h-[72px] px-6 flex items-center justify-between border-b border-white/[0.06]">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#D1FF00] flex items-center justify-center">
                  <span className="font-sans text-[14px] font-bold text-black">A</span>
                </div>
                <span className="font-mono text-[13px] font-bold text-white uppercase tracking-[0.2em]">
                  ARCAIVE
                </span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white p-2">
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-10 gap-6">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className="block font-sans text-[36px] font-bold tracking-tight text-white/80 hover:text-[#D1FF00] transition-colors uppercase"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <Link href="/register" className="btn-primary mt-6 w-full text-center">
                Get Started
              </Link>
            </nav>

            {/* Grid decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-[200px] opacity-20 pointer-events-none grid-lines" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
