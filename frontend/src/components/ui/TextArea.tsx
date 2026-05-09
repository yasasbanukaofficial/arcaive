"use client";

import React from "react";

type TextAreaProps = {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  error?: string;
  rows?: number;
  maxLength?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
  className?: string;
};

export default function TextArea({
  label,
  value,
  onChange,
  placeholder,
  name,
  required = false,
  disabled = false,
  hint,
  error,
  rows = 4,
  maxLength,
  resize = "vertical",
  className = "",
}: TextAreaProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="font-sans text-[12px] font-medium text-white/40 uppercase tracking-widest">
            {label}
            {required && <span className="text-[#e6efdf] ml-1">*</span>}
          </label>
          {maxLength && (
            <span className="font-mono text-[10px] text-white/25">
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      )}
      <textarea
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-4 py-3 font-sans text-[14px] rounded-[16px]
          bg-[#1a1a1a] text-white/90
          border focus:outline-none focus:ring-1 focus:ring-[#4a7c59]/50 focus:border-[#4a7c59]
          disabled:opacity-40 disabled:cursor-not-allowed
          placeholder:text-white/20
          transition-colors duration-200 min-h-[120px]
          ${resize === "none" ? "resize-none" : "resize-y"}
          ${error ? "border-red-500/50 bg-red-500/5" : "border-[#2a2a2a] hover:border-[#3a3a3a]"}
        `}
      />
      {error && (
        <p className="font-sans text-[11px] text-red-400 mt-1.5">{error}</p>
      )}
      {hint && !error && (
        <p className="font-sans text-[11px] text-white/25 mt-1.5">
          {hint}
        </p>
      )}
    </div>
  );
}
