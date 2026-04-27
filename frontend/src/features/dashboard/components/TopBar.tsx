"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell, ChevronDown } from "lucide-react";
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
      className="h-[56px] flex items-center justify-between px-6 bg-white border-b border-[#E8E6DE] sticky top-0 z-40 transition-colors duration-200"
    >
      <div className="flex items-center gap-4">
        {isMobile && (
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col gap-[3px] shrink-0 lg:hidden p-2"
            aria-label="Open menu"
          >
            <div className="w-5 h-[1px] bg-black" />
            <div className="w-5 h-[1px] bg-black" />
            <div className="w-5 h-[1px] bg-black" />
          </button>
        )}
        <h1 className="font-sans text-[16px] font-bold text-black uppercase tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {usage && (
          <div className="hidden md:flex items-center gap-3">
            <span className="font-mono text-[11px] text-[#888880] uppercase tracking-widest">
              QUOTA: {usage.cvAnalysisUsed}/{usage.cvAnalysisLimit}
            </span>
            <div className="w-24 h-[6px] border border-[#E8E6DE] bg-[#F5F4EF]">
              <div 
                className="h-full bg-black" 
                style={{ width: `${Math.min((usage.cvAnalysisUsed / usage.cvAnalysisLimit) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button className="text-black/40 hover:text-black transition-colors p-2">
            <Bell className="w-4.5 h-4.5" />
          </button>

          <div className="w-[1px] h-4 bg-[#E8E6DE] mx-1" />

          <button className="flex items-center gap-2 px-1 py-1 group">
            <div className="w-8 h-8 bg-[#F5F4EF] border border-[#E8E6DE] flex items-center justify-center font-sans font-bold text-black text-[12px]">
              Y
            </div>
            <ChevronDown className="w-3 h-3 text-[#888880] group-hover:text-black transition-colors" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
