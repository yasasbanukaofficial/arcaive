"use client";

import React from "react";
import { ChevronLeft, Check } from "lucide-react";

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
        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-[background-color,border-color] duration-150 ease-out"
        style={{
          backgroundColor: checked ? "var(--d-surface-active)" : "transparent",
          border: `1.5px solid ${checked ? "var(--d-border-hover)" : "var(--d-border)"}`,
        }}
      >
        <Check
          className="w-3.5 h-3.5 transition-[opacity,transform] duration-150 ease-out"
          style={{
            color: "var(--d-text-primary)",
            opacity: checked ? 1 : 0,
            transform: checked ? "scale(1)" : "scale(0.5)",
          }}
        />
      </div>
      <span
        className="text-[13px] font-medium transition-colors duration-200"
        style={{
          color: checked ? "var(--d-text-secondary)" : "var(--d-text-tertiary)",
        }}
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
}

export default function JobFilterPanel({
  selectedEmploymentTypes,
  onToggleEmploymentType,
  selectedRemote,
  onToggleRemote,
  collapsed,
  onToggleCollapse,
}: JobFiltersProps) {
  return (
    <div
      className="rounded-2xl p-6 space-y-6 sticky top-24"
      style={{
        backgroundColor: "var(--d-surface)",
        border: "1px solid var(--d-border)",
      }}
    >
      <div className="flex items-center justify-between">
        <h3
          className="text-[16px] font-semibold tracking-tight"
          style={{ color: "var(--d-text-primary)" }}
        >
          Filters
        </h3>
        <button
          onClick={onToggleCollapse}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200"
          style={{
            backgroundColor: "var(--d-surface-hover)",
            color: "var(--d-icon)",
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      <div>
        <p
          className="text-[12px] font-bold uppercase tracking-wider mb-2.5"
          style={{ color: "var(--d-text-muted)" }}
        >
          Employment Type
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
        <p
          className="text-[12px] font-bold uppercase tracking-wider mb-2.5"
          style={{ color: "var(--d-text-muted)" }}
        >
          Work Mode
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
    </div>
  );
}
