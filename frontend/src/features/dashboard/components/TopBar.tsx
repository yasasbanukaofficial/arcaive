"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell, ChevronDown, Search } from "lucide-react";
import { fadeUp } from "./animations";
import { usePathname } from "next/navigation";
import { useUsageQuota } from "@/features/billing/hooks/useSubscription";
import { useSidebar } from "./SidebarContext";

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
  const { data: usage } = useUsageQuota();

  const title = PAGE_TITLES[pathname] || "Dashboard";

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
          <h1 className="font-display text-[20px] tracking-tight uppercase font-bold text-[var(--text-primary)] leading-none mb-1">
            {title}
          </h1>
          <span className="font-mono text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest hidden sm:inline">
            Arcaive / Platform
          </span>
        </div>
      </div>

        <div className="flex items-center gap-8">
        {/* Quota */}
        {usage && (
          <div className="hidden lg:flex items-center gap-4 bg-[var(--glass-border)] border border-[var(--glass-border)] px-4 py-2 rounded-full">
            <span className="font-mono text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Token Usage
            </span>
            <div className="w-24 h-1 bg-[var(--glass-bg)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((usage.cvAnalysisUsed / usage.cvAnalysisLimit) * 100, 100)}%` }}
                className="h-full bg-[var(--text-primary)] rounded-full"
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="font-mono text-[12px] font-bold text-[var(--text-primary)]">
              {usage.cvAnalysisUsed}/{usage.cvAnalysisLimit}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all p-2 rounded-full hover:bg-[var(--glass-border)] border border-transparent hover:border-[var(--glass-border)] group">
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all p-2 rounded-full hover:bg-[var(--glass-border)] border border-transparent hover:border-[var(--glass-border)] group relative">
            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-[var(--text-primary)] rounded-full border-2 border-[var(--bg-color)]" />
          </button>

          <div className="w-[1px] h-4 bg-[var(--glass-border)] mx-2" />

          <button className="flex items-center gap-3 pl-3 pr-1 py-1 group rounded-full border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] hover:border-[var(--text-secondary)] transition-all">
            <div className="flex flex-col items-end text-right mr-1 hidden sm:flex">
              <span className="font-sans text-[13px] font-medium text-[var(--text-primary)] leading-none mb-1">Yasas Banuka</span>
              <span className="font-mono text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-tighter">Pro member</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[var(--text-primary)] border border-[var(--glass-border)] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
              <span className="font-display font-bold text-[var(--bg-color)] text-[14px]">Y</span>
            </div>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
