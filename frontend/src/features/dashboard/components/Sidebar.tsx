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
} from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { useTheme } from "./ThemeContext";
import Logo from "@/components/ui/Logo";
import { logoutAction } from "@/features/auth/action";

const mainNav = [
  { name: "Overview", href: "/overview", icon: LayoutDashboard },
  { name: "Workflow", href: "/workflow", icon: Zap },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "CV Analysis", href: "/cv-analysis", icon: FileSearch },
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
  const { collapsed, toggle, mobileOpen, setMobileOpen, isMobile } =
    useSidebar();
  const { isDark } = useTheme();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  React.useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [pathname, isMobile, setMobileOpen]);

  const renderNavItem = (
    item: { name: string; href: string; icon: React.ElementType },
    _index: number,
  ) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <div key={item.name}>
        <Link
          href={item.href}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium transition-colors duration-150 group relative"
          style={{
            backgroundColor: active
              ? isDark
                ? "var(--d-surface-active)"
                : "#000000"
              : "transparent",
            color: active
              ? isDark
                ? "var(--d-text-primary)"
                : "#ffffff"
              : "var(--d-text-tertiary)",
          }}
        >
          {active && (
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                backgroundColor: isDark ? "var(--d-surface-active)" : "#000000",
                border: isDark ? "1px solid var(--d-border)" : "none",
              }}
            />
          )}
          <Icon
            className="w-5 h-5 relative z-10 transition-colors duration-150"
            style={{
              color: active
                ? isDark
                  ? "var(--d-text-primary)"
                  : "#ffffff"
                : "var(--d-icon)",
            }}
          />
          {!collapsed && (
            <span
              className="relative z-10 whitespace-nowrap overflow-hidden transition-opacity duration-150"
              style={{ opacity: collapsed ? 0 : 1 }}
            >
              {item.name}
            </span>
          )}
        </Link>
      </div>
    );
  };

  const sidebarWidth = isMobile ? 260 : collapsed ? 72 : 260;

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
        className="fixed left-0 top-0 bottom-0 z-50 flex flex-col backdrop-blur-md"
        style={{
          width: sidebarWidth,
          transform: isMobile
            ? mobileOpen
              ? "translateX(0)"
              : "translateX(-260px)"
            : "translateX(0)",
          transition: `transform ${CLOSE_DURATION_MS}ms cubic-bezier(${EASE.join(",")}), width ${CLOSE_DURATION_MS}ms cubic-bezier(${EASE.join(",")})`,
          willChange: "transform, width",
          backgroundColor: "var(--d-bg-alpha)",
          borderRight: "1px solid var(--d-border-subtle)",
        }}
      >
        <div className="px-5 py-6 min-h-18">
          <div
            className="transition-opacity duration-200"
            style={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
            }}
          >
            <Logo
              size={28}
              textSize="text-[17px]"
              showText={!collapsed}
              textColor="var(--d-text-primary)"
              className="gap-3"
            />
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
          <div className="space-y-1">
            {!collapsed && (
              <p
                className="px-3 pt-2 pb-2 text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--d-text-muted)" }}
              >
                Create
              </p>
            )}
            {mainNav.map(renderNavItem)}
          </div>

          <div
            className="my-4"
            style={{ borderTop: "1px solid var(--d-border-subtle)" }}
          />

          <div className="space-y-1">
            {!collapsed && (
              <p
                className="px-3 pt-2 pb-2 text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--d-text-muted)" }}
              >
                Manage
              </p>
            )}
            {manageNav.map(renderNavItem)}
          </div>
        </nav>
        <div
          className="px-3 pb-4 space-y-2 pt-4"
          style={{ borderTop: "1px solid var(--d-border-subtle)" }}
        >
          {!isMobile && (
            <button
              onClick={toggle}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 w-full"
              style={{ color: "var(--d-text-tertiary)" }}
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
              <span
                className="whitespace-nowrap overflow-hidden transition-opacity duration-150"
                style={{
                  opacity: collapsed ? 0 : 1,
                  width: collapsed ? 0 : "auto",
                }}
              >
                Collapse
              </span>
            </button>
          )}

          <form action={logoutAction}>
            <button
              type="submit"
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
              }}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium hover:text-red-400/70 hover:bg-red-500/5 transition-all duration-200 w-full"
              style={{ color: "var(--d-text-tertiary)" }}
            >
              <LogOut className="w-5 h-5" />
              <span
                className="whitespace-nowrap overflow-hidden transition-opacity duration-150"
                style={{
                  opacity: collapsed ? 0 : 1,
                  width: collapsed ? 0 : "auto",
                }}
              >
                Log out
              </span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
