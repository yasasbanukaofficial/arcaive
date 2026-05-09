"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, LogOut, Settings as SettingsIcon } from "lucide-react";
import { useMemberSettings } from "@/features/settings/hooks/useMember";
import { useSubscription } from "@/features/billing/hooks/useSubscription";
import { logoutAction } from "@/features/auth/action";

export default function TopBar() {
  const pathname = usePathname();
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
      <header className="h-[72px] flex items-center justify-between px-6 lg:px-8 sticky top-0 z-40 bg-[#070707]/60 backdrop-blur-xl border-b border-white/[0.03]">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-sans text-[15px] font-semibold tracking-[-0.03em] text-white">arcaive</span>
          </Link>
          <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (pathname === "/" && link.href === "/overview");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-sans text-[12px] font-medium transition-all duration-200 whitespace-nowrap relative py-1 ${
                    isActive ? "text-white" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <div className="absolute -bottom-[26px] left-0 right-0 h-[1px] bg-white/60" />
                  )}
                </Link>
              );
            })}
          </nav>
          <button 
            className="md:hidden text-white/50 hover:text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 relative">
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 group pl-3 py-1.5 border-l border-white/5"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
               <span className="text-[10px] text-white/60 font-medium uppercase">{member?.memberFullName?.charAt(0) || "U"}</span>
            </div>
            <span className="font-sans text-[12px] font-medium text-white/80 group-hover:text-white transition-colors">
              {member?.memberFullName?.split(' ')[0] || "Account"}
            </span>
            <ChevronDown className={`w-3 h-3 text-white/30 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-[#0d0d0d] border border-white/[0.05] rounded-[18px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] py-2.5 z-50 backdrop-blur-2xl">
              <Link href="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.03] text-white/60 hover:text-white transition-colors text-[12px] font-medium">
                <SettingsIcon className="w-3.5 h-3.5" /> Settings
              </Link>
              <div className="my-1 border-t border-white/[0.03]" />
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
        <div className="fixed inset-0 z-50 bg-[#0e0e0e] flex flex-col p-6">
          <div className="flex justify-between items-center mb-12">
            <div className="w-10 h-10 rounded-[12px] border border-[#2a2a2a] flex items-center justify-center bg-[#161616]">
              <span className="font-mono text-[16px] font-bold text-white">A</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="text-white/50 hover:text-white">
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
                  pathname === link.href ? "text-white" : "text-white/50"
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
