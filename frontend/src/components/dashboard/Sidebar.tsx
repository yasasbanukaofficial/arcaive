"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  Zap,
  Briefcase,
  Key,
  Settings,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
  // Sparkles removed — using Image instead
  LogOut,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { useTheme } from "./ThemeContext";
import { fadeLeft, dashboardStagger } from "./animations";

const mainNav = [
  { name: "Overview", href: "/overview", icon: LayoutDashboard },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Agents", href: "/agents", icon: Bot },
  { name: "Workflow", href: "/workflow", icon: Zap },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
];

const manageNav = [
  { name: "Usage", href: "/usage", icon: BarChart3 },
  { name: "API Keys", href: "/api-keys", icon: Key },
  { name: "Logs", href: "/logs", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

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
    index: number,
  ) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <motion.div key={item.name} variants={fadeLeft}>
        <Link
          href={item.href}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium transition-all duration-300 group relative"
          style={{
            backgroundColor: active ? "var(--d-surface-active)" : "transparent",
            color: active ? "var(--d-text-primary)" : "var(--d-text-tertiary)",
          }}
        >
          {active && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute inset-0 rounded-xl"
              style={{
                backgroundColor: "var(--d-surface-active)",
                border: "1px solid var(--d-border)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <Icon
            className="w-5 h-5 relative z-10 transition-colors duration-300"
            style={{
              color: active ? "var(--d-text-primary)" : "var(--d-icon)",
            }}
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="relative z-10 whitespace-nowrap overflow-hidden"
              >
                {item.name}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </motion.div>
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{
          width: sidebarWidth,
          x: isMobile ? (mobileOpen ? 0 : -260) : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 bottom-0 z-50 flex flex-col backdrop-blur-2xl transition-colors duration-300"
        style={{
          backgroundColor: "var(--d-bg-alpha)",
          borderRight: "1px solid var(--d-border-subtle)",
        }}
      >
        <div className="flex items-center gap-3 px-5 py-6 min-h-18">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "var(--d-surface-active)",
              border: "1px solid var(--d-border-hover)",
            }}
          >
            <img
              src="/images/icon.png"
              alt="Arcaive"
              className="w-5 h-5 object-contain"
            />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[17px] font-semibold tracking-tight whitespace-nowrap"
                style={{ color: "var(--d-text-primary)" }}
              >
                Arcaive
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
          <motion.div
            initial="hidden"
            animate="show"
            variants={dashboardStagger(0.05, 0.15)}
            className="space-y-1"
          >
            {!collapsed && (
              <p
                className="px-3 pt-2 pb-2 text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--d-text-muted)" }}
              >
                Create
              </p>
            )}
            {mainNav.map(renderNavItem)}
          </motion.div>

          <div
            className="my-4"
            style={{ borderTop: "1px solid var(--d-border-subtle)" }}
          />

          <motion.div
            initial="hidden"
            animate="show"
            variants={dashboardStagger(0.05, 0.3)}
            className="space-y-1"
          >
            {!collapsed && (
              <p
                className="px-3 pt-2 pb-2 text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--d-text-muted)" }}
              >
                Manage
              </p>
            )}
            {manageNav.map(renderNavItem)}
          </motion.div>
        </nav>
        <div
          className="px-3 pb-4 space-y-2 pt-4"
          style={{ borderTop: "1px solid var(--d-border-subtle)" }}
        >
          {!isMobile && (
            <button
              onClick={toggle}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium transition-all duration-300 w-full"
              style={{ color: "var(--d-text-tertiary)" }}
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    Collapse
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}

          <button
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium hover:text-red-400/70 hover:bg-red-500/5 transition-all duration-300 w-full"
            style={{ color: "var(--d-text-tertiary)" }}
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  Log out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
