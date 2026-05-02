"use client";

import Link from "next/link";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/features/dashboard/components/ThemeContext";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 py-6 sm:py-10 flex items-center justify-between pointer-events-none">
        
        {/* Left Logo */}
        <div className="pointer-events-auto">
          <Link 
            href="/" 
            className="font-sans text-[18px] sm:text-[20px] font-bold tracking-tight text-[var(--text-primary)] transition-all"
            style={{
              WebkitTextStroke: isDark ? "2px #000000" : "2.5px #ffffff",
              paintOrder: "stroke fill",
              textShadow: isDark ? "0 0 20px rgba(255,255,255,0.1)" : "none"
            }}
          >
            ARCAIVE
          </Link>
        </div>

        {/* Desktop Navigation - Hidden on lg (tablets) now, shown on xl */}
        <div className="hidden xl:flex items-center gap-12 pointer-events-auto">
          <Link href="#intro" className="oryzo-label group relative text-[28px] text-[var(--text-primary)]">
            INTRO
            <span className="absolute -bottom-2 left-0 right-0 h-[1px] bg-[var(--text-primary)]" />
          </Link>
          <Link href="#features" className="oryzo-label text-[28px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            FEATURES
          </Link>
          <Link href="#benefits" className="oryzo-label text-[28px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            PRODUCT
          </Link>
          <Link href="#faq" className="oryzo-label text-[28px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            CONTACT
          </Link>
          
          {!isLoggedIn && (
            <Link href="/register" className="oryzo-label text-[28px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              SIGN UP
            </Link>
          )}

          <Link 
            href={isLoggedIn ? "/overview" : "/login"} 
            className="btn-hover oryzo-label border border-[var(--text-primary)] text-[28px] text-[var(--text-primary)] px-6 py-2 rounded-sm transition-all duration-300"
          >
            {isLoggedIn ? "DASHBOARD" : "SIGN IN"}
          </Link>

          <button 
            onClick={toggleTheme}
            className="btn-hover flex items-center justify-center p-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-primary)] transition-all duration-300"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {/* Mobile/Tablet Toggle - Shown up to xl */}
        <div className="xl:hidden flex items-center gap-4 pointer-events-auto">
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-primary)]"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center p-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-primary)]"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[45] bg-[var(--bg-color)] flex flex-col items-center justify-center gap-8 xl:hidden">
          <Link href="#intro" onClick={() => setIsMenuOpen(false)} className="text-[36px] font-bold tracking-tight text-[var(--text-primary)]">INTRO</Link>
          <Link href="#features" onClick={() => setIsMenuOpen(false)} className="text-[36px] font-bold tracking-tight text-[var(--text-primary)]">FEATURES</Link>
          <Link href="#benefits" onClick={() => setIsMenuOpen(false)} className="text-[36px] font-bold tracking-tight text-[var(--text-primary)]">PRODUCT</Link>
          <Link href="#faq" onClick={() => setIsMenuOpen(false)} className="text-[36px] font-bold tracking-tight text-[var(--text-primary)]">CONTACT</Link>
          
          {!isLoggedIn && (
            <Link href="/register" onClick={() => setIsMenuOpen(false)} className="text-[36px] font-bold tracking-tight text-[var(--text-primary)]">SIGN UP</Link>
          )}

          <Link 
            href={isLoggedIn ? "/overview" : "/login"} 
            onClick={() => setIsMenuOpen(false)} 
            className="btn-hover oryzo-label border border-[var(--text-primary)] text-[28px] text-[var(--text-primary)] px-8 py-4 rounded-sm mt-8 transition-all duration-300"
          >
            {isLoggedIn ? "DASHBOARD" : "SIGN IN"}
          </Link>
        </div>
      )}

      {/* Floating Right Bar */}
      <div className="fixed right-0 top-32 z-40 bg-[#f0ead6] text-[#0A0908] px-2 py-8 pointer-events-auto shadow-[0_0_20px_rgba(0,0,0,0.5)] hidden lg:block">
         <div className="writing-vertical-rl rotate-180 flex items-center gap-4">
           <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
           <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
             ARCAIVE-1 MODEL
           </span>
         </div>
      </div>
    </>
  );
}
