"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Synchronization", href: "#features" },
    { name: "Cognition", href: "#howitworks" },
    { name: "Topology", href: "#pricing" },
    { name: "Interface", href: "#benefits" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 w-[95%] max-w-[1400px] ${
          scrolled ? "top-6" : "top-10"
        }`}
      >
        <div className={`flex items-center justify-between px-8 py-4 rounded-full border transition-all duration-700 ${
          scrolled ? "bg-black/60 backdrop-blur-2xl border-white/10" : "bg-transparent border-transparent"
        }`}>
          {/* Brand */}
          <Link href="/" className="group relative z-[120]">
            <span className="font-sans text-[22px] font-medium tracking-[-0.04em] text-white">
              Arcaive<span className="text-white/20 font-light italic ml-0.5">®</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="px-6 py-2 rounded-full font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/5 transition-all duration-500"
              >
                {item.name}
              </Link>
            ))}
            
            <div className="w-[1px] h-6 bg-white/10 mx-4" />
            
            <Link
              href="/login"
              className="px-6 py-2 rounded-full font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all duration-500"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden relative z-[120] w-10 h-10 flex items-center justify-center text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[110] bg-black backdrop-blur-3xl lg:hidden flex flex-col justify-center px-12"
          >
            <nav className="flex flex-col gap-10">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className="text-4xl font-medium tracking-tighter text-white/30 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
