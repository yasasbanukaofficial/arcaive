"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";
import type { SortOption } from "@/@types/jobs";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Last updated", value: "last_updated" },
  { label: "Match score", value: "match_score" },
  { label: "Salary (high)", value: "salary_high" },
  { label: "Salary (low)", value: "salary_low" },
  { label: "Newest", value: "date_newest" },
];

interface JobListHeaderProps {
  totalJobs: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  filtersCollapsed: boolean;
  onToggleFilters: () => void;
}

export default function JobListHeader({
  totalJobs,
  sortBy,
  onSortChange,
  filtersCollapsed,
  onToggleFilters,
}: JobListHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <h2
          className="text-[22px] font-semibold tracking-tight"
          style={{ color: "var(--d-text-primary)" }}
        >
          Recommended jobs
        </h2>
        <span
          className="text-[13px] font-semibold px-3 py-1.5 rounded-lg"
          style={{
            backgroundColor: "var(--d-surface-hover)",
            border: "1px solid var(--d-border)",
            color: "var(--d-text-tertiary)",
          }}
        >
          {totalJobs}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Show filter toggle when collapsed */}
        {filtersCollapsed && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onToggleFilters}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors duration-200"
            style={{
              backgroundColor: "var(--d-surface)",
              border: "1px solid var(--d-border)",
              color: "var(--d-text-tertiary)",
            }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </motion.button>
        )}

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <span
            className="text-[12px] font-medium"
            style={{ color: "var(--d-text-muted)" }}
          >
            Sort by:
          </span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none bg-transparent text-[13px] font-semibold pr-5 cursor-pointer outline-none"
              style={{ color: "var(--d-text-secondary)" }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown
              className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
              style={{ color: "var(--d-icon)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
