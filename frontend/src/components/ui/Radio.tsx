"use client";

import React from "react";

type RadioProps = {
  label?: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  name?: string;
};

export default function Radio({
  label,
  value,
  checked,
  onChange,
  disabled = false,
  className = "",
  name,
}: RadioProps) {
  return (
    <label
      className={`flex items-center gap-3 cursor-pointer select-none ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => !disabled && onChange(value)}
          disabled={disabled}
          className="peer appearance-none w-[14px] h-[14px] border border-[#222] bg-white checked:bg-black  "
        />
      </div>
      {label && (
        <span className="font-mono text-[11px] uppercase tracking-widest text-[#888880]">
          {label}
        </span>
      )}
    </label>
  );
}
