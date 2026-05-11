"use client";

import React from "react";
import { motion } from "framer-motion";
import LocationDropdown from "./LocationDropdown";

interface JobSearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
}

export default function JobSearchBar({
  query,
  onQueryChange,
  location,
  onLocationChange,
}: JobSearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex flex-col md:flex-row items-stretch border border-[var(--d-border)] bg-[var(--d-surface)] rounded-[24px] overflow-hidden shadow-[var(--shadow-premium)]"
    >
      <div className="flex-1 flex items-center px-6 py-4">
        <input
          type="text"
          placeholder="Filter by keyword, title or company"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full bg-transparent outline-none font-sans text-[16px] font-medium text-[var(--d-text-primary)]/90 placeholder:text-[var(--d-text-muted)]"
        />
      </div>

      <div className="w-full md:w-auto flex items-stretch border-t md:border-t-0 md:border-l border-[var(--d-border)]">
        <div className="flex-1 md:w-64 px-6 py-4 flex items-center">
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full bg-transparent outline-none font-sans text-[14px] text-[var(--d-text-secondary)] placeholder:text-[var(--d-text-muted)]"
          />
        </div>
        
        <button 
          className="bg-[var(--d-sage)] text-[var(--accent-brand-contrast)] px-8 flex items-center justify-center text-[20px] font-bold hover:opacity-90 transition-opacity"
        >
          →
        </button>
      </div>
    </motion.div>
  );
}
