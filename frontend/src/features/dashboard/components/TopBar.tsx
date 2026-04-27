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
      className="h-[56px] flex items-center justify-between px-6 bg-black/60 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-40 transition-colors duration-200"
    >
      <div className="flex items-center gap-4">
        {isMobile && (
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col gap-[3px] shrink-0 lg:hidden p-2"
            aria-label="Open menu"
          >
            <div className="w-5 h-[1px] bg-white/50" />
            <div className="w-5 h-[1px] bg-white/50" />
            <div className="w-5 h-[1px] bg-white/50" />
          </button>
        )}
        <h1 className="font-sans text-[15px] font-bold text-white uppercase tracking-tight">
          {title}
        </h1>
        <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.15em] hidden sm:inline">
          / DASHBOARD
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* Quota */}
        {usage && (
          <div className="hidden md:flex items-center gap-3">
            <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.1em]">
              QUOTA
            </span>
            <div className="w-20 h-[4px] bg-white/[0.06] overflow-hidden">
              <div
                className="h-full bg-[#D1FF00] transition-all duration-500"
                style={{ width: `${Math.min((usage.cvAnalysisUsed / usage.cvAnalysisLimit) * 100, 100)}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-[#D1FF00] tracking-wide">
              {usage.cvAnalysisUsed}/{usage.cvAnalysisLimit}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button className="text-white/20 hover:text-[#D1FF00] transition-colors p-2">
            <Search className="w-4 h-4" />
          </button>
          <button className="text-white/20 hover:text-[#D1FF00] transition-colors p-2 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#D1FF00]" />
          </button>

          <div className="w-[1px] h-4 bg-white/[0.06] mx-1" />

          <button className="flex items-center gap-2 px-1 py-1 group">
            <div className="w-7 h-7 bg-[#D1FF00] flex items-center justify-center">
              <span className="font-sans font-bold text-black text-[11px]">Y</span>
            </div>
            <ChevronDown className="w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
