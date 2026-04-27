"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (
    e?: React.MouseEvent<HTMLAnchorElement> | null,
    href?: string,
  ) => {
    try {
      if (e) e.preventDefault();
      setMobileMenuOpen(false);

      const targetHash =
        href ?? (e && (e.currentTarget.getAttribute("href") || ""));
      const id = targetHash ? targetHash.replace("#", "") : "";
      if (!id) return;

      const el = document.getElementById(id);
      if (el) {
        const lenis = (window as any).lenis;
        if (lenis && typeof lenis.scrollTo === "function") {
          try {
            lenis.scrollTo(el, { duration: 1.2 });
          } catch (err) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } else {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        try {
          history.replaceState(null, "", `#${id}`);
        } catch (e) {}
      }
    } catch (err) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] h-[64px] border-b border-[#E8E6DE] transition-colors duration-300",
          scrolled ? "bg-white" : "bg-white/80 backdrop-blur-sm"
        )}
      >
        <div className="h-full px-6 flex items-center justify-between">
          <Link href="/" className="font-mono font-bold text-[16px] uppercase tracking-[0.2em]">
            ARCAIVE
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="font-mono text-[11px] uppercase tracking-widest text-black/60 hover:text-black transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/register"
              className="btn-primary py-2 px-6 h-auto min-h-0"
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-black p-2 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[110] bg-white lg:hidden flex flex-col overflow-hidden"
          >
            <div className="h-[64px] px-6 flex items-center justify-between border-b border-[#E8E6DE]">
              <Link href="/" className="font-mono font-bold text-[16px] uppercase tracking-[0.2em]">
                ARCAIVE
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-black p-2"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-10 gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="font-sans text-4xl font-bold tracking-tight hover:text-[#D4F461] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/register"
                className="btn-primary mt-4 w-full text-center"
              >
                Get Started
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
