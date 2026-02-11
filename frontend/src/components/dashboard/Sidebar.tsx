"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  Image as ImageIcon,
  Video,
  Key,
  Settings,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { useTheme } from "./ThemeContext";
import { fadeLeft, dashboardStagger } from "./animations";

const mainNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Chat", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Agents", href: "/dashboard/agents", icon: Bot },
  { name: "Images", href: "/dashboard/images", icon: ImageIcon },
  { name: "Videos", href: "/dashboard/videos", icon: Video },
];

const manageNav = [
  { name: "Usage", href: "/dashboard/usage", icon: BarChart3 },
  { name: "API Keys", href: "/dashboard/api-keys", icon: Key },
  { name: "Logs", href: "/dashboard/logs", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const { collapsed, toggle } = useSidebar();
  const { isDark } = useTheme();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

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
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 group relative"
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
            className="w-4.5 h-4.5 relative z-10 transition-colors duration-300"
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

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 bottom-0 z-50 flex flex-col backdrop-blur-2xl transition-colors duration-300"
      style={{
        backgroundColor: "var(--d-bg-alpha)",
        borderRight: "1px solid var(--d-border-subtle)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 min-h-18">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: "var(--d-surface-active)",
            border: "1px solid var(--d-border-hover)",
          }}
        >
          <Sparkles
            className="w-4 h-4"
            style={{ color: "var(--d-text-secondary)" }}
          />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[15px] font-semibold tracking-tight whitespace-nowrap"
              style={{ color: "var(--d-text-primary)" }}
            >
              Inteview
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        <motion.div
          initial="hidden"
          animate="show"
          variants={dashboardStagger(0.05, 0.15)}
          className="space-y-1"
        >
          {!collapsed && (
            <p
              className="px-3 pt-2 pb-2 text-[10px] font-bold uppercase tracking-[0.2em]"
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

      {/* Bottom section */}
      <div
        className="px-3 pb-4 space-y-2 pt-4"
        style={{ borderTop: "1px solid var(--d-border-subtle)" }}
      >
        <button
          onClick={toggle}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 w-full"
          style={{ color: "var(--d-text-tertiary)" }}
        >
          {collapsed ? (
            <ChevronRight className="w-4.5 h-4.5" />
          ) : (
            <ChevronLeft className="w-4.5 h-4.5" />
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

        <button
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium hover:text-red-400/70 hover:bg-red-500/5 transition-all duration-300 w-full"
          style={{ color: "var(--d-text-tertiary)" }}
        >
          <LogOut className="w-4.5 h-4.5" />
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
  );
}
