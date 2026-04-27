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
  className = "",
}: ToggleProps) {
  return (
    <label
      className={`flex items-start gap-4 select-none ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative w-10 h-5 shrink-0  duration-200 mt-1 border
          ${checked ? "bg-black border-[var(--text-primary)]" : "bg-[var(--glass-bg)] border-[var(--glass-border)]"}
        `}
        style={{ borderRadius: 0 }}
      >
        <motion.div
          animate={{ x: checked ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5"
          style={{
            backgroundColor: checked ? "white" : "#888880",
            borderRadius: 0,
          }}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col min-w-0">
          {label && (
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--text-primary)]">
              {label}
            </span>
          )}
          {description && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mt-1">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
