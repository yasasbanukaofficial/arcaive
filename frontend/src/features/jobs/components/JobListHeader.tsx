"use client";

import React from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import DropdownMenu from "@/components/ui/DropdownMenu";
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
    // Stack on very small screens, row on sm and above.
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      {/* Left: title + count */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Title: allow wrapping on xs, truncate on sm+; min-w-0 on parent enables truncation */}
        <h2
          className="text-[15px] sm:text-[17px] md:text-[20px] lg:text-[22px] font-semibold tracking-tight break-words sm:truncate min-w-0"
          style={{ color: "var(--d-text-primary)" }}
          title="Recommended jobs"
        >
          Recommended jobs
        </h2>

        <span
          className="text-[12px] sm:text-[13px] font-semibold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg"
          style={{
            backgroundColor: "var(--d-surface-hover)",
            border: "1px solid var(--d-border)",
            color: "var(--d-text-tertiary)",
          }}
          aria-label={`${totalJobs} jobs`}
          title={`${totalJobs} jobs`}
        >
          {totalJobs}
        </span>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2 justify-end flex-shrink-0">
        {filtersCollapsed && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onToggleFilters}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] sm:text-[13px] font-medium transition-colors duration-200"
            style={{
              backgroundColor: "var(--d-surface)",
              border: "1px solid var(--d-border)",
              color: "var(--d-text-tertiary)",
            }}
            aria-pressed="false"
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {/* Hide the text on very small screens to save space */}
            <span className="hidden sm:inline">Filters</span>
          </motion.button>
        )}

        <div className="flex items-center gap-2">
          <span
            className="text-[11px] sm:text-[12px] font-medium"
            style={{ color: "var(--d-text-muted)" }}
          >
            Sort by:
          </span>
          <div className="relative">
            <DropdownMenu
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={(v) => onSortChange(v)}
              // smaller button text on xs, slightly larger on sm+
              buttonClassName="text-[12px] sm:text-[13px] font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
