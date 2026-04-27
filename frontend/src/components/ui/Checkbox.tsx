"use client";

import React from "react";

type CheckboxProps = {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  required?: boolean;
};

export default function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
  required = false,
}: CheckboxProps) {
  return (
    <label
      className={`flex items-center gap-3 cursor-pointer select-none ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          required={required}
          className="peer appearance-none w-[14px] h-[14px] border border-[#222] bg-[var(--glass-bg)] checked:bg-black "
          style={{ borderRadius: "var(--radius)" }}
        />
        <span className="absolute text-white font-mono text-[10px] pointer-events-none opacity-0 peer-checked:opacity-100">
          ✓
        </span>
      </div>
      {label && (
        <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </span>
      )}
    </label>
  );
}
