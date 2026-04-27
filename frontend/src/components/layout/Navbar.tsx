"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Services", href: "#features" },
    { name: "Intelligence", href: "#howitworks" },
    { name: "Pricing", href: "#pricing" },
    { name: "Journal", href: "#benefits" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 lg:px-12 py-8 ${
          scrolled ? "py-5 translate-y-0" : "translate-y-0"
        }`}
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-12">
            <Link href="/" className="group relative z-[120]">
              <span className="font-sans text-[20px] font-medium tracking-tight text-black">
                Arcaive<span className="text-black/30 font-light italic ml-0.5">®</span>
              </span>
            </Link>

            <button className="hidden lg:flex items-center justify-center p-2 text-black/40 hover:text-black transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center bg-white/40 backdrop-blur-3xl border border-black/[0.05] rounded-full p-1.5 shadow-sm">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="px-6 py-2 rounded-full font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-black/50 hover:text-black hover:bg-white transition-all duration-300"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center bg-white/40 backdrop-blur-3xl border border-black/[0.05] rounded-full p-1.5 shadow-sm ml-2">
              <Link
                href="/login"
                className="px-6 py-2 rounded-full font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-black/50 hover:text-black hover:bg-white transition-all duration-300 flex items-center gap-2"
              >
                EN <ChevronDown className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden relative z-[120] w-10 h-10 flex items-center justify-center text-black"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-white/80 backdrop-blur-2xl lg:hidden flex flex-col justify-center px-12"
          >
            <nav className="flex flex-col gap-8">
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
                    className="text-4xl font-medium tracking-tighter text-black/40 hover:text-black transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.1 }}
                className="mt-8 pt-8 border-t border-black/5"
              >
                <Link href="/register" className="text-xl font-medium text-black underline underline-offset-8">
                  Get Started
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
