"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Briefcase, DollarSign } from "lucide-react";
import LocationDropdown from "./LocationDropdown";
import Dropdown from "@/components/ui/Dropdown";
import type { ExperienceLevel } from "@/@types/jobs";

interface JobSearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  experience: string;
  onExperienceChange: (value: string) => void;
  salaryRange: string;
  onSalaryRangeChange: (value: string) => void;
}

export default function JobSearchBar({
  query,
  onQueryChange,
  location,
  onLocationChange,
  experience,
  onExperienceChange,
  salaryRange,
  onSalaryRangeChange,
}: JobSearchBarProps) {
  const experienceOptions = [
    { label: "Any Experience", value: "" },
    { label: "No experience", value: "No experience" },
    { label: "6 months - 1 year", value: "6 months - 1 year" },
    { label: "1 - 2 years", value: "1 - 2 years" },
    { label: "2 - 4 years", value: "2 - 4 years" },
    { label: "4 - 6 years", value: "4 - 6 years" },
    { label: "6+ years", value: "6+ years" },
  ];

  const salaryOptions = [
    { label: "Any Salary", value: "" },
    { label: "$0 - $2000", value: "0-2000" },
    { label: "$2000 - $5000", value: "2000-5000" },
    { label: "$5000 - $10000", value: "5000-10000" },
    { label: "$10000 - $20000", value: "10000-20000" },
    { label: "$20000+", value: "20000+" },
  ];

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
      <div className="flex flex-col lg:flex-row items-stretch gap-2">
        <div className="flex flex-col sm:flex-row items-stretch gap-2 flex-1 min-w-0">
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

        <div
          className="hidden lg:block w-px self-stretch my-2 shrink-0"
          style={{ backgroundColor: "var(--d-border-subtle)" }}
        />

        <div className="flex flex-row items-stretch gap-2">
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-xl min-w-0 flex-1 sm:flex-initial sm:min-w-[140px] lg:min-w-[160px]">
            <Briefcase
              className="w-4.5 h-4.5 shrink-0"
              style={{ color: "var(--d-icon)" }}
            />
            <Dropdown
              options={experienceOptions}
              value={experience}
              onChange={onExperienceChange}
              buttonClassName="text-[13px] font-semibold"
            />
          </div>

          <div
            className="w-px self-stretch my-2 shrink-0"
            style={{ backgroundColor: "var(--d-border-subtle)" }}
          />

          <div className="flex items-center gap-2.5 px-3 py-1 rounded-xl min-w-0 flex-1 sm:flex-initial sm:min-w-[130px] lg:min-w-[150px]">
            <DollarSign
              className="w-4.5 h-4.5 shrink-0"
              style={{ color: "var(--d-icon)" }}
            />
            <Dropdown
              options={salaryOptions}
              value={salaryRange}
              onChange={onSalaryRangeChange}
              buttonClassName="text-[13px] font-semibold"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
