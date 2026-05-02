"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { fadeUp } from "./animations";
import { usePathname } from "next/navigation";
import { useSubscription } from "@/features/billing/hooks/useSubscription";
import { useSidebar } from "./SidebarContext";
import { useTheme } from "./ThemeContext";
import { logoutAction } from "@/features/auth/action";

const PAGE_TITLES: Record<string, string> = {
  "/overview": "Overview",
  "/create": "Create CV",
  "/jobs": "Jobs",
  "/cv-analysis": "CV Analysis",
  "/workflow": "Workflow",
  "/interview": "Interview",
  "/usage": "Usage",
  "/billing": "Billing",
  "/settings": "Settings",
};

export default function TopBar() {
  const { setMobileOpen, isMobile } = useSidebar();
  const pathname = usePathname();
  const { data: subscription } = useSubscription();
  const { isDark, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const title = PAGE_TITLES[pathname] || "Dashboard";
  const tier = subscription?.currentPlan || "explorer";

  return (
    <motion.header
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="h-[80px] flex items-center justify-between px-6 lg:px-12 bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--glass-border)] sticky top-0 z-40 transition-all duration-300"
    >
      <div className="flex items-center gap-6">
        {isMobile && (
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col gap-[4px] shrink-0 lg:hidden p-2 group"
            aria-label="Open menu"
          >
            <div className="w-5 h-[1.5px] bg-[var(--text-primary)] rounded-full group-hover:w-4 transition-all" />
            <div className="w-4 h-[1.5px] bg-[var(--text-primary)] rounded-full group-hover:w-5 transition-all" />
            <div className="w-5 h-[1.5px] bg-[var(--text-primary)] rounded-full group-hover:w-3 transition-all" />
          </button>
        )}
        <div className="flex flex-col">
          <h1 className="font-display text-[20px] tracking-tight font-bold text-[var(--text-primary)] leading-none mb-1 capitalize">
            {title}
          </h1>
          <span className="font-mono text-[10px] font-bold text-[var(--text-secondary)] tracking-widest hidden sm:inline">
            Arcaive / Platform
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="relative"
          onMouseEnter={() => setUserMenuOpen(true)}
          onMouseLeave={() => setUserMenuOpen(false)}
        >
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 pl-3 pr-1 py-1 group rounded-[var(--radius)] border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] hover:border-[var(--text-secondary)] transition-all"
          >
            <div className="flex flex-col items-end text-right mr-1 hidden sm:flex">
              <span className="font-sans text-[13px] font-medium text-[var(--text-primary)] leading-none mb-1">Yasas Banuka</span>
              <span className="font-mono text-[9px] font-bold text-[var(--text-secondary)] tracking-tighter capitalize">{tier} member</span>
            </div>
            <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--text-primary)] border border-[var(--glass-border)] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
              <span className="font-display font-bold text-[var(--bg-color)] text-[14px]">Y</span>
            </div>
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-48 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-[var(--radius)] shadow-xl z-50 overflow-hidden"
              >
                <button
                  onClick={() => {
                    toggleTheme();
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[14px] text-[var(--text-primary)] hover:bg-[var(--glass-border)] transition-colors"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDark ? "Light mode" : "Dark mode"}
                </button>
                <Link
                  href="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-[14px] text-[var(--text-primary)] hover:bg-[var(--glass-border)] transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <form
                  action={async () => {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("token");
                    await logoutAction();
                  }}
                  className="w-full"
                >
                  <button
                    type="submit"
                    className="w-full flex items-center gap-3 px-4 py-3 text-[14px] text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
