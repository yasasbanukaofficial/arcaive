"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Check } from "lucide-react";
import type { WorkSchedule, EmploymentType, JobSource } from "@/@types/jobs";

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

function FilterCheckbox({ label, checked, onChange }: FilterCheckboxProps) {
  return (
    <label className="flex items-center gap-3 py-2 cursor-pointer group">
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 shrink-0"
        style={{
          backgroundColor: checked ? "var(--d-surface-active)" : "transparent",
          border: `1.5px solid ${checked ? "var(--d-border-hover)" : "var(--d-border)"}`,
        }}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check
                className="w-3.5 h-3.5"
                style={{ color: "var(--d-text-primary)" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span
        className="text-[13px] font-medium transition-colors duration-200"
        style={{
          color: checked ? "var(--d-text-secondary)" : "var(--d-text-tertiary)",
        }}
      >
        {label}
      </span>
    </label>
  );
}

const MIN_SALARY = 0;
const MAX_SALARY = 20000;
const STEP = 100;

interface SalaryRangeSliderProps {
  range: [number, number];
  onChange: (range: [number, number]) => void;
}

function SalaryRangeSlider({ range, onChange }: SalaryRangeSliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);

  const getPercent = (value: number) =>
    ((value - MIN_SALARY) / (MAX_SALARY - MIN_SALARY)) * 100;

  const getValueFromX = (clientX: number) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width),
    );
    const raw = MIN_SALARY + percent * (MAX_SALARY - MIN_SALARY);
    return Math.round(raw / STEP) * STEP;
  };

  const handlePointerDown =
    (thumb: "min" | "max") => (e: React.PointerEvent) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);

      const onMove = (ev: PointerEvent) => {
        const val = getValueFromX(ev.clientX);
        if (thumb === "min") {
          onChange([Math.min(val, range[1] - STEP), range[1]]);
        } else {
          onChange([range[0], Math.max(val, range[0] + STEP)]);
        }
      };

      const onUp = () => {
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerup", onUp);
      };

      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerup", onUp);
    };

  const leftPercent = getPercent(range[0]);
  const rightPercent = getPercent(range[1]);

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[13px] font-semibold"
          style={{ color: "var(--d-text-secondary)" }}
        >
          {"$"}
          {range[0].toLocaleString()}
        </span>
        <span className="text-[11px]" style={{ color: "var(--d-text-ghost)" }}>
          —
        </span>
        <span
          className="text-[13px] font-semibold"
          style={{ color: "var(--d-text-secondary)" }}
        >
          {"$"}
          {range[1].toLocaleString()}
        </span>
      </div>
      <div
        ref={trackRef}
        className="relative h-2 rounded-full"
        style={{ backgroundColor: "var(--d-surface-hover)" }}
      >
        {/* Active range fill */}
        <div
          className="absolute h-full rounded-full"
          style={{
            left: `${leftPercent}%`,
            right: `${100 - rightPercent}%`,
            backgroundColor: "var(--d-border-hover)",
          }}
        />
        {/* Min thumb */}
        <div
          onPointerDown={handlePointerDown("min")}
          className="absolute top-1/2 w-4.5 h-4.5 rounded-full cursor-grab active:cursor-grabbing touch-none z-10"
          style={{
            left: `${leftPercent}%`,
            backgroundColor: "var(--d-text-primary)",
            border: "2px solid var(--d-border-hover)",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
          }}
        />
        {/* Max thumb */}
        <div
          onPointerDown={handlePointerDown("max")}
          className="absolute top-1/2 w-4.5 h-4.5 rounded-full cursor-grab active:cursor-grabbing touch-none z-10"
          style={{
            left: `${rightPercent}%`,
            backgroundColor: "var(--d-text-primary)",
            border: "2px solid var(--d-border-hover)",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
          }}
        />
      </div>
    </div>
  );
}

// ─── Main filter panel ───
const WORK_SCHEDULES: WorkSchedule[] = [
  "Full time",
  "Part time",
  "Internship",
  "Project work",
  "Volunteering",
];

const EMPLOYMENT_TYPES: EmploymentType[] = [
  "Full Day",
  "Flexible Schedule",
  "Shift work",
  "Distant",
  "Shift method",
];

const SOURCES: JobSource[] = ["LinkedIn", "Serper", "Indeed", "Glassdoor"];

interface JobFiltersProps {
  selectedSchedules: WorkSchedule[];
  onToggleSchedule: (s: WorkSchedule) => void;
  selectedTypes: EmploymentType[];
  onToggleType: (t: EmploymentType) => void;
  selectedSources: JobSource[];
  onToggleSource: (s: JobSource) => void;
  salaryRange: [number, number];
  onSalaryRangeChange: (range: [number, number]) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function JobFilterPanel({
  selectedSchedules,
  onToggleSchedule,
  selectedTypes,
  onToggleType,
  selectedSources,
  onToggleSource,
  salaryRange,
  onSalaryRangeChange,
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
      {/* Header */}
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

      {/* Working Schedule */}
      <div>
        <p
          className="text-[12px] font-bold uppercase tracking-wider mb-2.5"
          style={{ color: "var(--d-text-muted)" }}
        >
          Working schedule
        </p>
        <div className="space-y-0.5">
          {WORK_SCHEDULES.map((s) => (
            <FilterCheckbox
              key={s}
              label={s}
              checked={selectedSchedules.includes(s)}
              onChange={() => onToggleSchedule(s)}
            />
          ))}
        </div>
      </div>

      {/* Employment Type */}
      <div>
        <p
          className="text-[12px] font-bold uppercase tracking-wider mb-2.5"
          style={{ color: "var(--d-text-muted)" }}
        >
          Employment type
        </p>
        <div className="space-y-0.5">
          {EMPLOYMENT_TYPES.map((t) => (
            <FilterCheckbox
              key={t}
              label={t}
              checked={selectedTypes.includes(t)}
              onChange={() => onToggleType(t)}
            />
          ))}
        </div>
      </div>

      {/* Source */}
      <div>
        <p
          className="text-[12px] font-bold uppercase tracking-wider mb-2.5"
          style={{ color: "var(--d-text-muted)" }}
        >
          Source
        </p>
        <div className="space-y-0.5">
          {SOURCES.map((s) => (
            <FilterCheckbox
              key={s}
              label={s}
              checked={selectedSources.includes(s)}
              onChange={() => onToggleSource(s)}
            />
          ))}
        </div>
      </div>

      {/* Salary Range */}
      <div>
        <p
          className="text-[12px] font-bold uppercase tracking-wider mb-2.5"
          style={{ color: "var(--d-text-muted)" }}
        >
          Salary range
        </p>
        <SalaryRangeSlider range={salaryRange} onChange={onSalaryRangeChange} />
      </div>
    </div>
  );
}
