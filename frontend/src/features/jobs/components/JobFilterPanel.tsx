"use client";

import React from "react";
import Slider from "@/components/ui/Slider";

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

function FilterCheckbox({ label, checked, onChange }: FilterCheckboxProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange();
    }
  };

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={onChange}
      onKeyDown={handleKeyDown}
      className="flex items-center gap-3 py-2 cursor-pointer group outline-none"
    >
      <div
        className={`relative w-4 h-4 rounded-[6px] border flex items-center justify-center shrink-0 transition-colors ${
          checked ? "bg-[var(--d-sage)] border-[var(--d-sage)]" : "bg-transparent border-[var(--d-border)]"
        }`}
      >
        {checked && (
          <span className="text-[10px] text-[var(--accent-brand-contrast)] font-bold pointer-events-none">
            ✓
          </span>
        )}
      </div>
      <span
        className={`font-sans text-[13px] transition-colors ${
          checked ? "font-medium text-[var(--d-text-primary)]/80" : "text-[var(--d-text-muted)]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

const EMPLOYMENT_TYPES: { label: string; value: string }[] = [
  { label: "Full-time", value: "FULLTIME" },
  { label: "Part-time", value: "PARTTIME" },
  { label: "Contractor", value: "CONTRACTOR" },
  { label: "Intern", value: "INTERN" },
  { label: "Temporary", value: "TEMPORARY" },
  { label: "Freelance", value: "FREELANCE" },
  { label: "Apprenticeship", value: "APPRENTICESHIP" },
  { label: "Volunteer", value: "VOLUNTEER" },
];

const REMOTE_OPTIONS: { label: string; value: string }[] = [
  { label: "Remote", value: "remote" },
  { label: "On-site", value: "onsite" },
];

interface JobFiltersProps {
  selectedEmploymentTypes: string[];
  onToggleEmploymentType: (t: string) => void;
  selectedRemote: string[];
  onToggleRemote: (r: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  salaryMin: number;
  salaryMax: number;
  onSalaryMinChange: (v: number) => void;
  onSalaryMaxChange: (v: number) => void;
  filterHasSalary: boolean;
  onToggleHasSalary: () => void;
}

export default function JobFilterPanel({
  selectedEmploymentTypes,
  onToggleEmploymentType,
  selectedRemote,
  onToggleRemote,
  collapsed,
  onToggleCollapse,
  salaryMin,
  salaryMax,
  onSalaryMinChange,
  onSalaryMaxChange,
  filterHasSalary,
  onToggleHasSalary,
}: JobFiltersProps) {
  return (
    <div
      className="p-6 space-y-8 border border-[var(--d-border)] bg-[var(--d-surface)] rounded-[24px] sticky top-24 shadow-[var(--shadow-premium)]"
    >
      <div className="flex items-center justify-between pb-4 border-b border-[var(--d-border)]">
        <h3 className="font-sans text-[14px] font-semibold text-[var(--d-text-primary)]/80">
          Filters
        </h3>
        <button
          onClick={onToggleCollapse}
          className="px-3 py-1.5 bg-[var(--d-border)] text-[var(--d-text-secondary)] font-sans text-[11px] font-medium rounded-full hover:bg-[var(--d-surface-hover)] transition-colors"
        >
          Hide
        </button>
      </div>
      <div>
        <p className="font-sans text-[12px] font-medium text-[var(--d-text-muted)] uppercase tracking-wider mb-3">
          Employment type
        </p>
        <div className="space-y-0.5">
          {EMPLOYMENT_TYPES.map((t) => (
            <FilterCheckbox
              key={t.value}
              label={t.label}
              checked={selectedEmploymentTypes.includes(t.value)}
              onChange={() => onToggleEmploymentType(t.value)}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="font-sans text-[12px] font-medium text-[var(--d-text-muted)] uppercase tracking-wider mb-3">
          Work mode
        </p>
        <div className="space-y-0.5">
          {REMOTE_OPTIONS.map((r) => (
            <FilterCheckbox
              key={r.value}
              label={r.label}
              checked={selectedRemote.includes(r.value)}
              onChange={() => onToggleRemote(r.value)}
            />
          ))}
        </div>
      </div>
      
      <div>
        <p className="font-sans text-[12px] font-medium text-[var(--d-text-muted)] uppercase tracking-wider mb-3">
          Salary range
        </p>
        <div className="space-y-5">
          <FilterCheckbox
            label="Has salary info"
            checked={filterHasSalary}
            onChange={onToggleHasSalary}
          />
          <div className="pt-1">
            <Slider
              label="Min Salary"
              value={salaryMin}
              onChange={onSalaryMinChange}
              min={0}
              max={300000}
              step={1000}
              valueSuffix="$"
              showValue={true}
            />
          </div>
          <div>
            <Slider
              label="Max Salary"
              value={salaryMax}
              onChange={onSalaryMaxChange}
              min={0}
              max={300000}
              step={1000}
              valueSuffix="$"
              showValue={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
