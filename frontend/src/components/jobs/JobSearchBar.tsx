"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  ChevronDown,
} from "lucide-react";

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
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="rounded-2xl p-2 flex flex-col sm:flex-row items-stretch gap-2"
      style={{
        backgroundColor: "var(--d-surface)",
        border: "1px solid var(--d-border)",
      }}
    >
      {/* Search input */}
      <div className="flex items-center gap-3 flex-1 px-5 py-3.5 rounded-xl transition-colors duration-200 hover:bg-[var(--d-surface-hover)]">
        <Search className="w-4.5 h-4.5 shrink-0" style={{ color: "var(--d-icon)" }} />
        <input
          type="text"
          placeholder="Job title, keyword, or company"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="bg-transparent outline-none w-full text-[14px] font-medium placeholder:text-[var(--d-text-ghost)]"
          style={{ color: "var(--d-text-primary)" }}
        />
      </div>

      {/* Divider */}
      <div
        className="hidden sm:block w-px self-stretch my-2"
        style={{ backgroundColor: "var(--d-border-subtle)" }}
      />

      {/* Location */}
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl transition-colors duration-200 hover:bg-[var(--d-surface-hover)] min-w-[200px]">
        <MapPin className="w-4.5 h-4.5 shrink-0" style={{ color: "var(--d-icon)" }} />
        <input
          type="text"
          placeholder="Work location"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="bg-transparent outline-none w-full text-[14px] font-medium placeholder:text-[var(--d-text-ghost)]"
          style={{ color: "var(--d-text-primary)" }}
        />
      </div>

      {/* Divider */}
      <div
        className="hidden sm:block w-px self-stretch my-2"
        style={{ backgroundColor: "var(--d-border-subtle)" }}
      />

      {/* Experience dropdown placeholder */}
      <button
        className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-[14px] font-medium transition-colors duration-200 hover:bg-[var(--d-surface-hover)] min-w-[160px]"
        style={{ color: "var(--d-text-tertiary)" }}
      >
        <Briefcase className="w-4.5 h-4.5 shrink-0" style={{ color: "var(--d-icon)" }} />
        <span>Experience</span>
        <ChevronDown className="w-4 h-4 ml-auto" style={{ color: "var(--d-icon)" }} />
      </button>

      {/* Divider */}
      <div
        className="hidden sm:block w-px self-stretch my-2"
        style={{ backgroundColor: "var(--d-border-subtle)" }}
      />

      {/* Salary dropdown placeholder */}
      <button
        className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-[14px] font-medium transition-colors duration-200 hover:bg-[var(--d-surface-hover)] min-w-[150px]"
        style={{ color: "var(--d-text-tertiary)" }}
      >
        <DollarSign className="w-4.5 h-4.5 shrink-0" style={{ color: "var(--d-icon)" }} />
        <span>Per month</span>
        <ChevronDown className="w-4 h-4 ml-auto" style={{ color: "var(--d-icon)" }} />
      </button>
    </motion.div>
  );
}
