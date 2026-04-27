"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Zap,
  Briefcase,
  Settings,
  BarChart3,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Mic,
  FileSearch,
  FileText,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { logoutAction } from "@/features/auth/action";

const mainNav = [
  { name: "Overview", href: "/overview", icon: LayoutDashboard },
  { name: "Create CV", href: "/create", icon: FileText },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "CV Analysis", href: "/cv-analysis", icon: FileSearch },
  { name: "Workflow", href: "/workflow", icon: Zap },
  { name: "Interview", href: "/interview", icon: Mic },
];

const manageNav = [
  { name: "Usage", href: "/usage", icon: BarChart3 },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

const CLOSE_DURATION_MS = 250;
const CLOSE_DURATION_S = CLOSE_DURATION_MS / 1000;
const EASE = [0.22, 1, 0.36, 1] as const;

export default function Sidebar() {
  const { collapsed, toggle, mobileOpen, setMobileOpen, isMobile } = useSidebar();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  React.useEffect(() => {
    if (isMobile) setMobileOpen(false);
  }, [pathname, isMobile, setMobileOpen]);

  const renderNavItem = (
    item: { name: string; href: string; icon: React.ElementType },
    _index: number
  ) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <div key={item.name}>
        <Link
          href={item.href}
          className={`flex items-center gap-3 px-6 py-3 transition-all duration-200 group relative ${
            active
              ? "text-[#D1FF00]"
              : "text-white/40 hover:text-white/80"
          }`}
        >
          {active && (
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#D1FF00]" />
          )}
          <Icon className={`w-4 h-4 transition-colors ${active ? "text-[#D1FF00]" : "opacity-50 group-hover:opacity-100"}`} />
          {!collapsed && (
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] whitespace-nowrap">
              {item.name}
            </span>
          )}
        </Link>
      </div>
    );
  };

  const sidebarWidth = isMobile ? 240 : collapsed ? 72 : 240;

  return (
    <>
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: CLOSE_DURATION_S, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className="fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-[#0A0A0A] border-r border-white/[0.06]"
        style={{
          width: sidebarWidth,
          transform: isMobile
            ? mobileOpen ? "translateX(0)" : "translateX(-240px)"
            : "translateX(0)",
          transition: `transform ${CLOSE_DURATION_MS}ms cubic-bezier(${EASE.join(",")}), width ${CLOSE_DURATION_MS}ms cubic-bezier(${EASE.join(",")})`,
          willChange: "transform, width",
        }}
      >
        {/* Logo */}
        <div className="h-[64px] flex items-center px-6 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#D1FF00] flex items-center justify-center shrink-0">
              <span className="font-sans text-[12px] font-bold text-black">A</span>
            </div>
            {!collapsed && (
              <span className="font-mono text-[12px] font-bold text-white uppercase tracking-[0.2em]">
                ARCAIVE
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-6 overflow-y-auto no-scrollbar">
          <div>
            {!collapsed && (
              <p className="px-6 mb-4 font-mono text-[9px] text-white/20 uppercase tracking-[0.2em]">
                Explore
              </p>
            )}
            <div className="space-y-0.5">{mainNav.map(renderNavItem)}</div>
          </div>

          <div className="mx-6 h-[1px] bg-white/[0.06]" />

          <div>
            {!collapsed && (
              <p className="px-6 mb-4 font-mono text-[9px] text-white/20 uppercase tracking-[0.2em]">
                Manage
              </p>
            )}
            <div className="space-y-0.5">{manageNav.map(renderNavItem)}</div>
          </div>
        </nav>

        {/* Bottom User Section */}
        <div className="mt-auto border-t border-white/[0.06] p-6 space-y-4">
          {!collapsed && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#D1FF00] flex items-center justify-center shrink-0">
                  <span className="font-sans font-bold text-black text-[12px]">Y</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-sans text-[13px] font-bold text-white truncate">Yasas Banuka</span>
                  <span className="font-mono text-[10px] text-white/30 truncate">yasas@arcaive.ai</span>
                </div>
              </div>
              <div>
                <span className="inline-block font-mono text-[9px] text-[#D1FF00] border border-[#D1FF00]/30 px-2 py-0.5 uppercase tracking-[0.1em]">
                  EXPLORER TIER
                </span>
              </div>
            </div>
          )}

          <div className={`flex ${collapsed ? "flex-col items-center" : "items-center justify-between"} gap-2`}>
            <Link
              href="/settings"
              className="text-white/30 hover:text-[#D1FF00] transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>

            {!collapsed && (
              <form action={logoutAction} className="flex-1">
                <button
                  type="submit"
                  className="w-full text-left font-mono text-[11px] text-white/30 hover:text-[#D1FF00] uppercase tracking-[0.1em] transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-3 h-3" />
                  Log out
                </button>
              </form>
            )}

            {!isMobile && (
              <button
                onClick={toggle}
                className="text-white/20 hover:text-[#D1FF00] transition-colors"
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
