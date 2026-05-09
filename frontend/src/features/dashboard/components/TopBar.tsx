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

  const tier = subscription?.currentPlan || "explorer";

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
      <header className="h-[80px] flex items-center justify-between px-6 lg:px-12 sticky top-0 z-40 bg-[#0e0e0e]/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-[12px] border border-[#2a2a2a] flex items-center justify-center shrink-0 bg-[#161616] group-hover:border-[#4a7c59] transition-colors">
              <span className="font-mono text-[16px] font-bold text-white">A</span>
            </div>
          </Link>
          <button 
            className="md:hidden text-white/50 hover:text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-6 overflow-x-auto no-scrollbar">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`font-sans text-[13px] font-medium transition-colors whitespace-nowrap ${
                pathname === link.href || (pathname === "/overview" && link.name === "Overview")
                  ? "text-[#fff]"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center relative">
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 group text-left"
          >
            <span className="font-sans text-[12px] font-medium text-white/50 hidden sm:block">
              Account
            </span>
            <span className="font-sans text-[13px] font-medium text-white flex items-center gap-1 group-hover:text-white/80 transition-colors">
              {member?.memberFullName || "User"} <ChevronDown className="w-3 h-3 text-white/50" />
            </span>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-4 w-48 bg-[#161616] border border-[#2a2a2a] rounded-[16px] shadow-2xl py-2 z-50">
              <Link href="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-[#2a2a2a] text-white/70 hover:text-white transition-colors text-[13px]">
                <SettingsIcon className="w-4 h-4" /> Settings
              </Link>
              <form action={async () => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("token");
                await logoutAction();
              }}>
                <button type="submit" className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-500/10 text-red-500/70 hover:text-red-500 transition-colors text-[13px] text-left">
                  <LogOut className="w-4 h-4" /> Log out
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
