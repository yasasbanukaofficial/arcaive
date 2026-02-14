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
    <div className={`space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label
          className="block text-[13px] font-medium ml-0.5"
          style={{ color: "var(--d-text-tertiary)" }}
        >
          {label}
          {required && <span className="text-red-400/70 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          className={`
            w-full flex items-center justify-between gap-2
            rounded-xl px-4 py-2.5 text-[13px] text-left
            outline-none transition-all duration-200
            disabled:opacity-40 disabled:cursor-not-allowed
            focus-visible:ring-2 focus-visible:ring-blue-500/20
          `}
          style={{
            backgroundColor: "var(--d-surface)",
            border: error
              ? "1px solid rgba(239, 68, 68, 0.4)"
              : open
                ? "1px solid var(--d-border-hover)"
                : "1px solid var(--d-border)",
            color: selected
              ? "var(--d-text-primary)"
              : "var(--d-text-muted)",
          }}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {selected?.icon && (
              <span className="shrink-0 w-4 h-4 flex items-center justify-center">
                {selected.icon}
              </span>
            )}
            <span className="truncate">
              {selected ? selected.label : placeholder}
            </span>
          </div>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0"
          >
            <ChevronDown
              className="w-4 h-4"
              style={{ color: "var(--d-text-muted)" }}
            />
          </motion.div>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute z-50 w-full mt-1.5 rounded-xl py-1 overflow-hidden backdrop-blur-xl max-h-60 overflow-y-auto"
              style={{
                backgroundColor: "var(--d-bg)",
                border: "1px solid var(--d-border-hover)",
                boxShadow:
                  "0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15)",
              }}
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
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] transition-colors duration-150 outline-none"
                    style={{
                      backgroundColor: isSelected
                        ? "var(--d-surface-active)"
                        : "transparent",
                      color: isSelected
                        ? "var(--d-text-primary)"
                        : "var(--d-text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor =
                          "var(--d-surface-hover)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {option.icon && (
                      <span className="shrink-0 w-4 h-4 flex items-center justify-center">
                        {option.icon}
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="block truncate">{option.label}</span>
                      {option.description && (
                        <span
                          className="block text-[11px] truncate mt-0.5"
                          style={{ color: "var(--d-text-muted)" }}
                        >
                          {option.description}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: "rgba(59, 130, 246, 0.7)" }}
                      />
                    )}
                  </button>
                );
              })}

              {options.length === 0 && (
                <div
                  className="px-4 py-3 text-[13px] text-center"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  No options available
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="text-[12px] ml-0.5 text-red-400/80">{error}</p>
      )}
      {hint && !error && (
        <p
          className="text-[12px] ml-0.5"
          style={{ color: "var(--d-text-muted)" }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
