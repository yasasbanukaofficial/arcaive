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
        className="flex items-center gap-4 py-2 cursor-pointer group outline-none"
      >
        <div
          className={`relative w-[14px] h-[14px] border flex items-center justify-center shrink-0 ${
            checked ? "bg-white" : "bg-white"
          }`}
          style={{ borderRadius: "var(--radius)", borderColor: checked ? "#000" : "#222" }}
        >
          {checked && (
            <span className="font-mono text-[10px] text-black pointer-events-none">
              ✓
            </span>
          )}
        </div>
        <span
          className={`font-mono text-[11px] uppercase tracking-widest transition-colors ${
            checked ? "font-bold text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
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
  // salary filters
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
      className="p-8 space-y-10 border border-[var(--glass-border)] bg-[var(--glass-bg)] sticky top-24"
    >
      <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4">
        <h3 className="font-sans text-[16px] font-bold text-[var(--text-primary)] uppercase tracking-tight">
          Filters
        </h3>
        <button
          onClick={onToggleCollapse}
          className="px-3 py-1 bg-black text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-[var(--radius)]"
        >
          Hide Filters
        </button>
      </div>
      <div>
        <p className="font-mono text-[11px] font-bold uppercase tracking-widest mb-4 text-[var(--text-secondary)]">
          Employment Type
        </p>
        <div className="space-y-1">
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
        <p className="font-mono text-[11px] font-bold uppercase tracking-widest mb-4 text-[var(--text-secondary)]">
          Work Mode
        </p>
        <div className="space-y-1">
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
        <p className="font-mono text-[11px] font-bold uppercase tracking-widest mb-4 text-[var(--text-secondary)]">
          Salary Range
        </p>
        <div className="space-y-6">
          <FilterCheckbox
            label="Has salary info"
            checked={filterHasSalary}
            onChange={onToggleHasSalary}
          />
          <div className="pt-2">
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
