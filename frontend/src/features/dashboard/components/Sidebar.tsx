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
  Mic,
  FileSearch,
  FileText,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";

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

  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

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
        <div className="h-[80px] flex items-center px-6 border-b border-[var(--glass-border)]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[var(--radius)] border border-[var(--glass-border)] flex items-center justify-center shrink-0">
              <span className="font-display text-[14px] font-bold text-[var(--text-primary)]">A</span>
            </div>
            {!collapsed && (
              <span className="font-display text-[18px] font-bold tracking-tight text-[var(--text-primary)]">
                Arcaive
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-8 overflow-y-auto no-scrollbar">
          <div>
            {!collapsed && (
              <p className="px-6 mb-3 font-mono text-[10px] tracking-widest text-[var(--text-secondary)]">
                Discover
              </p>
            )}
            <div className="space-y-1">{mainNav.map(renderNavItem)}</div>
          </div>

          <div>
            {!collapsed && (
              <p className="px-6 mb-3 font-mono text-[10px] tracking-widest text-[var(--text-secondary)]">
                Configure
              </p>
            )}
            <div className="space-y-1">{manageNav.map(renderNavItem)}</div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto border-t p-6 space-y-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className={`flex ${collapsed ? "flex-col items-center" : "items-center justify-between"} gap-4`}>
            <Link
              href="/settings"
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {!isMobile && (
              <button
                onClick={toggle}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1"
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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
