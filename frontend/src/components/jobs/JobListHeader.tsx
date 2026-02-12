"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";
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
        <div className="flex items-center gap-2">
          <span
            className="text-[12px] font-medium"
            style={{ color: "var(--d-text-muted)" }}
          >
            Sort by:
          </span>
          <div className="relative">
            <DropdownMenu
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={(v) => onSortChange(v)}
              buttonClassName="text-[13px] font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
