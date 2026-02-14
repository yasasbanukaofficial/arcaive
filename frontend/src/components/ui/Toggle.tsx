"use client";

import React from "react";
import { motion } from "framer-motion";

type ToggleProps = {
  label?: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
};

export default function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  size = "md",
  className = "",
}: ToggleProps) {
  const trackWidth = size === "sm" ? "w-8" : "w-10";
  const trackHeight = size === "sm" ? "h-[18px]" : "h-[22px]";
  const thumbSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const thumbTranslate = size === "sm" ? 14 : 18;

  return (
    <label
      className={`flex items-start gap-3 select-none ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative ${trackWidth} ${trackHeight} rounded-full shrink-0
          transition-colors duration-200 mt-0.5
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30
        `}
        style={{
          backgroundColor: checked
            ? "rgba(59, 130, 246, 0.5)"
            : "var(--d-surface-active)",
          border: `1px solid ${checked ? "rgba(59, 130, 246, 0.3)" : "var(--d-border)"}`,
        }}
      >
        <motion.div
          animate={{ x: checked ? thumbTranslate : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`
            absolute top-1/2 -translate-y-1/2 ${thumbSize} rounded-full
          `}
          style={{
            backgroundColor: checked
              ? "#ffffff"
              : "var(--d-text-muted)",
            boxShadow: checked
              ? "0 1px 3px rgba(0,0,0,0.2)"
              : "none",
          }}
        />
      </button>
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <span
              className="block text-[13px] font-medium leading-snug"
              style={{ color: "var(--d-text-secondary)" }}
            >
              {label}
            </span>
          )}
          {description && (
            <span
              className="block text-[12px] leading-relaxed mt-0.5"
              style={{ color: "var(--d-text-muted)" }}
            >
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
