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
          <label className="font-mono text-[11px] uppercase tracking-widest text-[#888880]">
            {label}
            {required && <span className="text-accent ml-1 font-mono">*</span>}
          </label>
          {maxLength && (
            <span className="font-mono text-[10px] text-[#888880]">
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
          w-full px-[14px] py-[12px] font-sans text-[15px] border 
          focus:outline-none focus:border-black min-h-[120px]
          disabled:opacity-40 disabled:cursor-not-allowed
          ${resize === "none" ? "resize-none" : "resize-y"}
          ${error ? "border-[#D83B2A]" : "border-[#E8E6DE] bg-white"}
        `}
        style={{ borderRadius: 0 }}
      />
      {error && (
        <p className="font-mono text-[11px] text-[#D83B2A] mt-2">! {error}</p>
      )}
      {hint && !error && (
        <p className="font-mono text-[10px] text-[#888880] mt-2">
          {hint}
        </p>
      )}
    </div>
  );
}
