"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, LogOut, Settings as SettingsIcon, Sun, Moon } from "lucide-react";
import { useMemberSettings } from "@/features/settings/hooks/useMember";
import { useSubscription } from "@/features/billing/hooks/useSubscription";
import { logoutAction } from "@/features/auth/action";
import { useTheme } from "@/features/dashboard/components/ThemeContext";

export default function TopBar() {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const { data: member } = useMemberSettings();
  const { data: subscription } = useSubscription();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { name: "Overview", href: "/overview" },
    { name: "Create CV", href: "/create" },
    { name: "Jobs", href: "/jobs" },
    { name: "CV Analysis", href: "/cv-analysis" },
    { name: "Interview", href: "/interview" },
    { name: "Usage", href: "/usage" },
    { name: "Billing", href: "/billing" },
    { name: "Settings", href: "/settings" },
  ];
  return (
    <>
      <header className="h-[72px] flex items-center justify-between px-6 lg:px-8 sticky top-0 z-40 bg-[var(--bg-color)]/60 backdrop-blur-xl border-b border-[var(--glass-border)] transition-colors duration-300">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-sans text-[15px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">arcaive</span>
          </Link>
          <div className="h-4 w-[1px] bg-[var(--text-primary)]/10 hidden md:block" />
          <nav className="hidden md:flex items-center gap-6 overflow-x-auto no-scrollbar">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (pathname === "/overview" && link.name === "Overview");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-sans text-[12px] font-medium transition-all duration-200 whitespace-nowrap relative py-1 ${
                    isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]/70"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <div className="absolute -bottom-[26px] left-0 right-0 h-[1px] bg-[var(--text-primary)]/60" />
                  )}
                </Link>
              );
            })}
          </nav>
          <button 
            className="md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 relative">
          <button 
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)]/50 text-[var(--text-primary)] hover:bg-[var(--glass-bg)] transition-all duration-300 group/theme mr-2"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Sun className="w-[14px] h-[14px] text-[var(--text-primary)]/60 group-hover/theme:text-[var(--text-primary)] transition-colors" />
            ) : (
              <Moon className="w-[14px] h-[14px] text-[var(--text-primary)]/60 group-hover/theme:text-[var(--text-primary)] transition-colors" />
            )}
          </button>

          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 group pl-3 py-1.5 border-l border-[var(--glass-border)]"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[var(--text-primary)]/10 to-[var(--text-primary)]/5 border border-[var(--glass-border)] flex items-center justify-center overflow-hidden">
               <span className="text-[10px] text-[var(--text-primary)]/60 font-medium uppercase">{member?.memberFullName?.charAt(0) || "U"}</span>
            </div>
            <span className="font-sans text-[12px] font-medium text-[var(--text-primary)]/80 group-hover:text-[var(--text-primary)] transition-colors">
              {member?.memberFullName?.split(' ')[0] || "Account"}
            </span>
            <ChevronDown className={`w-3 h-3 text-[var(--text-primary)]/30 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-[var(--bg-color)] border border-[var(--glass-border)] rounded-[18px] shadow-[var(--shadow-premium)] py-2.5 z-50 backdrop-blur-2xl">
              <Link href="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--text-primary)]/[0.03] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-[12px] font-medium">
                <SettingsIcon className="w-3.5 h-3.5" /> Settings
              </Link>
              <div className="my-1 border-t border-[var(--glass-border)]" />
              <form action={async () => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("token");
                await logoutAction();
              }}>
                <button type="submit" className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/[0.03] text-red-500/60 hover:text-red-500 transition-colors text-[12px] font-medium text-left">
                  <LogOut className="w-3.5 h-3.5" /> Log out
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--bg-color)] flex flex-col p-6">
          <div className="flex justify-between items-center mb-12">
            <div className="w-10 h-10 rounded-[12px] border border-[var(--glass-border)] flex items-center justify-center bg-[var(--glass-bg)]">
              <span className="font-mono text-[16px] font-bold text-[var(--text-primary)]">A</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-sans text-[24px] font-medium transition-colors ${
                  pathname === link.href ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
