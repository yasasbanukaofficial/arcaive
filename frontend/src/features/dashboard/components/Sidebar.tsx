"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemberSettings } from "@/features/settings/hooks/useMember";
import { useSubscription } from "@/features/billing/hooks/useSubscription";
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
  Sun,
  Moon,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { useTheme } from "./ThemeContext";
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
  const { theme, toggleTheme, isDark } = useTheme();
  const pathname = usePathname();
  
  const { data: member, isLoading: memberLoading } = useMemberSettings();
  const { data: subscription } = useSubscription();

  const isActive = (href: string) => pathname === href;

  React.useEffect(() => {
    if (isMobile) setMobileOpen(false);
  }, [pathname, isMobile, setMobileOpen]);

  const renderNavItem = (
    item: { name: string; href: string; icon: React.ElementType<{ className?: string }> },
    _index: number
  ) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <div key={item.name} className="px-3">
        <Link
          href={item.href}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
            active
              ? "bg-[var(--text-primary)] text-[var(--bg-color)]"
              : "text-[var(--text-secondary)] hover:bg-[var(--glass-border)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Icon className={`w-5 h-5 shrink-0 transition-colors ${active ? "text-[var(--bg-color)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"}`} />
          {!collapsed && (
            <span className="font-sans text-[14px] font-medium whitespace-nowrap">
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
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className="fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-[var(--glass-bg)] backdrop-blur-xl border-r border-[var(--glass-border)]"
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
        <div className="h-[72px] flex items-center px-6 border-b border-[var(--glass-border)]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[var(--radius)] border border-[var(--glass-border)] flex items-center justify-center shrink-0">
              <span className="font-display text-[14px] font-bold text-[var(--text-primary)]">A</span>
            </div>
            {!collapsed && (
              <span className="font-display text-[18px] font-bold tracking-tight text-[var(--text-primary)] uppercase">
                Arcaive
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-8 overflow-y-auto no-scrollbar">
          <div>
            {!collapsed && (
              <p className="px-6 mb-3 font-mono text-[10px] tracking-widest uppercase text-[var(--text-secondary)]">
                Explore
              </p>
            )}
            <div className="space-y-1">{mainNav.map(renderNavItem)}</div>
          </div>

          <div>
            {!collapsed && (
              <p className="px-6 mb-3 font-mono text-[10px] tracking-widest uppercase text-[var(--text-secondary)]">
                Manage
              </p>
            )}
            <div className="space-y-1">{manageNav.map(renderNavItem)}</div>
          </div>
        </nav>

        {/* Bottom User Section */}
        <div className="mt-auto border-t p-6 space-y-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          {!collapsed && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[var(--radius)] bg-[var(--text-primary)] flex items-center justify-center shrink-0 border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  {memberLoading ? (
                    <span className="font-display font-bold text-[var(--bg-color)] text-[14px]">?</span>
                  ) : (
                    <span className="font-display font-bold text-[var(--bg-color)] text-[14px]">
                      {member?.memberFullName?.charAt(0) || member?.memberName?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-sans text-[14px] font-medium text-[var(--text-primary)] truncate">
                    {memberLoading ? "Loading..." : (member?.memberFullName || member?.memberName || "User")}
                  </span>
                  <span className="font-sans text-[12px] font-light text-[var(--text-secondary)] truncate">
                    {member?.memberEmail || ""}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest uppercase rounded-full px-3 py-1 text-[var(--text-secondary)]" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                  {(subscription?.currentPlan || "Explorer").toUpperCase()} TIER
                </span>
                <button
                  onClick={toggleTheme}
                  className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors hover:opacity-80 text-[var(--text-primary)]"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                  title={`Switch to ${isDark ? "light" : "dark"} mode`}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <div className={`flex ${collapsed ? "flex-col items-center" : "items-center justify-between"} gap-4`}>
            <Link
              href="/settings"
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {collapsed && (
              <button
                onClick={toggleTheme}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 mb-2"
                title={`Switch to ${isDark ? "light" : "dark"} mode`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            {!collapsed && (
              <form 
                action={async () => {
                  localStorage.removeItem("access_token");
                  localStorage.removeItem("token");
                  await logoutAction();
                }} 
                className="flex-1"
              >
                <button
                  type="submit"
                  className="w-full text-left font-sans text-[14px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2 px-1"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </form>
            )}

            {!isMobile && (
              <button
                onClick={toggle}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1"
              >
                {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
