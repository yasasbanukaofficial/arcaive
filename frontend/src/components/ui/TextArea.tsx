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
  const resizeClass =
    resize === "none"
      ? "resize-none"
      : resize === "vertical"
        ? "resize-y"
        : resize === "horizontal"
          ? "resize-x"
          : "resize";

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            className="block text-xs font-bold ml-0.5 tracking-widest uppercase"
            style={{ color: "var(--d-text-secondary)" }}
          >
            {label}
            {required && (
              <span className="text-red-400/70 ml-0.5">*</span>
            )}
          </label>
          {maxLength && (
            <span
              className="text-[11px] tabular-nums"
              style={{
                color:
                  value.length > maxLength * 0.9
                    ? "rgba(239, 68, 68, 0.7)"
                    : "var(--d-text-muted)",
              }}
            >
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
          w-full rounded-xl px-4 py-3 text-sm font-semibold leading-relaxed
          outline-none transition-all duration-200
          placeholder:text-white/40 placeholder:font-medium
          disabled:opacity-40 disabled:cursor-not-allowed
          focus:ring-2 focus:ring-blue-500/30
          ${resizeClass}
        `}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: error
            ? "1.5px solid rgba(239, 68, 68, 0.5)"
            : "1.5px solid rgba(255, 255, 255, 0.12)",
          color: "var(--d-text-primary)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error
            ? "rgba(239, 68, 68, 0.8)"
            : "#3b82f6";
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error
            ? "rgba(239, 68, 68, 0.5)"
            : "rgba(255, 255, 255, 0.12)";
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
        }}
      />
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
