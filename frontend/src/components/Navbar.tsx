"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-8 left-0 right-0 z-[100] px-6 flex justify-center pointer-events-none">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        className={cn(
          "pointer-events-auto flex items-center justify-between gap-10 px-6 py-2.5 rounded-full border border-white/5 transition-all duration-500",
          scrolled ? "bg-black/40 backdrop-blur-2xl shadow-2xl border-white/10" : "bg-white/[0.02] backdrop-blur-xl"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white transition-transform duration-500"
          >
            <path
              d="M12 4L14.5 9.5L20 12L14.5 14.5L12 20L9.5 14.5L4 12L9.5 9.5L12 4Z"
              fill="currentColor"
            />
          </svg>
          <span className="text-[14px] font-bold tracking-tight text-white">Message</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 px-4">
          {["About", "Features", "Pricing"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[13px] font-medium text-white/40 hover:text-white transition-colors tracking-tight"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href="/get-started"
          className="bg-white text-[#0f0f0f] px-5 py-2 rounded-full text-[13px] font-bold hover:scale-[1.05] transition-all duration-300"
        >
          Get Started
        </Link>
      </motion.nav>
    </div>
  );
}
