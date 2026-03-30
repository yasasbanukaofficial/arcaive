"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type TextFieldProps = {
  label?: string;
  type?: "text" | "email" | "url" | "tel" | "number";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
};

export default function TextField({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  name,
  required = false,
  disabled = false,
  hint,
  error,
  icon,
  className = "",
}: TextFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          className="block text-[13px] font-medium ml-0.5"
          style={{ color: "var(--d-text-tertiary)" }}
        >
          {label}
          {required && (
            <span className="text-red-400/70 ml-0.5">*</span>
          )}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center"
            style={{ color: "var(--d-text-muted)" }}
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full rounded-xl px-4 py-2.5 text-[13px]
            outline-none transition-all duration-200
            placeholder:opacity-40
            disabled:opacity-40 disabled:cursor-not-allowed
            focus:ring-2 focus:ring-blue-500/20
            ${icon ? "pl-10" : ""}
          `}
          style={{
            backgroundColor: "var(--d-surface)",
            border: error
              ? "1px solid rgba(239, 68, 68, 0.4)"
              : "1px solid var(--d-border)",
            color: "var(--d-text-primary)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error
              ? "rgba(239, 68, 68, 0.6)"
              : "var(--d-border-hover)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error
              ? "rgba(239, 68, 68, 0.4)"
              : "var(--d-border)";
            onBlur?.(e);
          }}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="text-[12px] ml-0.5 text-red-400/80"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
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
