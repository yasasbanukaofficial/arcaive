"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
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
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-2"
      style={{
        backgroundColor: "var(--d-surface)",
        border: "1px solid var(--d-border)",
      }}
    >
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-0 px-5 py-3.5 rounded-xl transition-colors duration-200 hover:bg-[var(--d-surface-hover)]">
          <Search
            className="w-4.5 h-4.5 shrink-0"
            style={{ color: "var(--d-icon)" }}
          />
          <input
            type="text"
            placeholder="Job title, keyword, or company"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="bg-transparent outline-none w-full text-[14px] font-medium placeholder:text-[var(--d-text-ghost)]"
            style={{ color: "var(--d-text-primary)" }}
          />
        </div>

        <div
          className="hidden sm:block w-px self-stretch my-2 shrink-0"
          style={{ backgroundColor: "var(--d-border-subtle)" }}
        />

        <LocationDropdown value={location} onChange={onLocationChange} />
      </div>
    </motion.div>
  );
}
