"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
};

type SelectProps = {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
};

export default function Select({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  disabled = false,
  hint,
  error,
  required = false,
  className = "",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleClickOutside, handleKeyDown]);

  return (
    <div className={`flex flex-col ${className}`} ref={containerRef}>
      {label && (
        <label className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">
          {label}
          {required && <span className="text-accent ml-1 font-mono">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          className={`
            w-full flex items-center justify-between gap-2
            px-[14px] py-[12px] font-sans text-[15px] text-left border 
            focus:outline-none focus:border-[var(--text-primary)]
            disabled:opacity-40 disabled:cursor-not-allowed
            ${error ? "border-[#D83B2A]" : open ? "border-[var(--text-primary)]" : "border-[var(--glass-border)] bg-[var(--glass-bg)]"}
          `}
          style={{ borderRadius: 0 }}
        >
          <span className={`truncate ${!selected ? "text-[var(--text-secondary)]" : "text-[var(--text-primary)]"}`}>
            {selected ? selected.label : placeholder}
          </span>
          <span className="font-mono text-[18px] leading-none">↓</span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              className="absolute z-50 w-full mt-[-1px] bg-[var(--glass-bg)] border border-[var(--text-primary)] overflow-hidden max-h-60 overflow-y-auto"
              style={{ borderRadius: 0 }}
            >
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`
                      w-full flex flex-col px-[14px] py-[10px] text-left transition-colors border-b border-[var(--glass-border)] last:border-b-0
                      ${isSelected ? "bg-[var(--glass-border)]" : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"}
                    `}
                  >
                    <span className="font-sans text-[14px] font-medium text-[var(--text-primary)]">
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase mt-0.5">
                        {option.description}
                      </span>
                    )}
                  </button>
                );
              })}

              {options.length === 0 && (
                <div className="px-[14px] py-[12px] font-mono text-[11px] text-[var(--text-secondary)] text-center">
                  NO_OPTIONS_AVAILABLE
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="font-mono text-[11px] text-[#D83B2A] mt-2">! {error}</p>
      )}
      {hint && !error && (
        <p className="font-mono text-[10px] text-[var(--text-secondary)] mt-2">
          {hint}
        </p>
      )}
    </div>
  );
}
