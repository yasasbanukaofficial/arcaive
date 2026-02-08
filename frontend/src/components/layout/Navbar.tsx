"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { Menu, X } from "lucide-react";

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
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu and smoothly scroll to hash target if provided or derived from the event
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
        // Prefer Lenis if available (exposed by SmoothScroll)
        // @ts-ignore
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

        // update the URL hash without triggering a navigation
        try {
          history.replaceState(null, "", `#${id}`);
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <div className="fixed top-4 sm:top-6 md:top-8 left-0 right-0 z-[100] px-4 sm:px-6 flex justify-center pointer-events-none">
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className={cn(
            "pointer-events-auto flex items-center justify-between gap-4 sm:gap-6 md:gap-10 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border border-white/5 transition-all duration-500 w-auto max-w-full",
            scrolled
              ? "bg-black/40 backdrop-blur-2xl shadow-2xl border-white/10"
              : "bg-white/[0.02] backdrop-blur-xl",
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <Image
              width="20"
              height="20"
              alt="inteview-logo-png"
              src={"/images/icon.png"}
              unoptimized
              className="transition-transform duration-500 w-4 h-4 sm:w-5 sm:h-5"
            />
            <span className="text-[12px] sm:text-[14px] font-bold tracking-tight text-white">
              INTEVIEW
            </span>
          </Link>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-8 px-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="text-[13px] font-medium text-white/40 hover:text-white transition-colors tracking-tight"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Hamburger Menu Button - Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* CTA Button - Desktop */}
          <Link
            href="/get-started"
            className="hidden md:inline-flex bg-white text-[#0f0f0f] px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-[13px] font-bold hover:scale-[1.05] transition-all duration-300"
          >
            Get Started
          </Link>
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[110] bg-[#0a0a0a] md:hidden flex flex-col font-sans overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  width="20"
                  height="20"
                  alt="inteview-logo-png"
                  src={"/images/icon.png"}
                  unoptimized
                  className="w-5 h-5"
                />
                <span className="text-white text-lg font-bold tracking-tight">
                  INTEVIEW
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <X size={28} strokeWidth={1.5} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col justify-center px-8">
              <motion.ul
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                    className="overflow-hidden"
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => handleLinkClick(e, item.href)}
                      className="block text-[42px] sm:text-6xl font-light text-white/90 hover:text-white transition-all duration-300 hover:translate-x-4 tracking-tight"
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            {/* Background Texture/Grain Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <filter id="noise">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.65"
                    numOctaves="3"
                    stitchTiles="stitch"
                  />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise)" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
