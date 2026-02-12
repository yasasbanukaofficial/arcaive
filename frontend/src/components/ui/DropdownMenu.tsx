"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";

type Option<T extends string | number> = {
  label: string;
  value: T;
};

type DropdownProps<T extends string | number> = {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  buttonClassName?: string;
};

export default function DropdownMenu<T extends string | number>({
  options,
  value,
  onChange,
  className = "",
  buttonClassName = "",
}: DropdownProps<T>) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const focusedIndexRef = React.useRef<number>(-1);

  const current = options.find((o) => o.value === value) ?? options[0];

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  React.useEffect(() => {
    if (!open) focusedIndexRef.current = -1;
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      e.preventDefault();
      setOpen(true);
      focusedIndexRef.current = options.findIndex((o) => o.value === value);
      return;
    }

    if (!open) return;

    if (e.key === "Escape") {
      setOpen(false);
      btnRef.current?.focus();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusedIndexRef.current = Math.min(
        focusedIndexRef.current + 1,
        options.length - 1,
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      focusedIndexRef.current = Math.max(focusedIndexRef.current - 1, 0);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const idx = focusedIndexRef.current;
      if (idx >= 0 && idx < options.length) onChange(options[idx].value);
      setOpen(false);
      btnRef.current?.focus();
    }
  };

  return (
    <div
      ref={rootRef}
      className={`relative inline-block text-left ${className}`}
    >
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        onKeyDown={onKeyDown}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer ${buttonClassName}`}
        style={{
          backgroundColor: "var(--d-surface)",
          border: "1px solid var(--d-border)",
          color: "var(--d-text-primary)",
          boxShadow: "0 8px 24px rgba(2,6,23,0.12)",
        }}
      >
        <span className="text-[13px] font-semibold truncate">
          {current.label}
        </span>
        <ArrowUpDown
          className="w-4 h-4 ml-1"
          style={{ color: "var(--d-icon)" }}
        />
      </button>

      {open && (
        <div
          role="listbox"
          tabIndex={-1}
          className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-full sm:w-64 rounded-xl z-50 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
          style={{
            backgroundColor: "var(--d-surface)",
            border: "1px solid var(--d-border)",
            boxShadow: "0 12px 40px rgba(2,6,23,0.18)",
            backdropFilter: "blur(8px)",
          }}
          onKeyDown={onKeyDown}
        >
          <div className="flex flex-col">
            {options.map((opt, idx) => (
              <button
                key={String(opt.value)}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`text-left px-4 py-3 transition-colors duration-150 ${
                  opt.value === value
                    ? "bg-[var(--d-surface-active)] text-[var(--d-text-primary)]"
                    : "hover:bg-[var(--d-surface-hover)]"
                }`}
                style={{ color: "var(--d-text-secondary)" }}
                onMouseEnter={() => (focusedIndexRef.current = idx)}
              >
                <span className="block text-[14px] font-medium">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
