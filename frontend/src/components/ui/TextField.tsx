"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

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
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="font-sans text-[12px] font-medium text-[var(--text-secondary)] mb-2.5 flex items-center gap-1.5">
          {label}
          {required && <span className="text-[var(--accent-brand)]">*</span>}
        </label>
      )}
      <div className="relative">
        <div className={`
          flex items-center gap-3 px-4 py-3.5 rounded-[16px] bg-[var(--bg-color)] border transition-all duration-200
          ${error 
            ? "border-red-500/50 focus-within:border-red-500/70 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" 
            : isFocused 
              ? "border-[var(--accent-brand)]/50 shadow-[0_0_0_3px_var(--accent-brand)]" 
              : "border-[var(--glass-border)] hover:border-[var(--text-secondary)]/30"
          }
          ${disabled ? "opacity-40 cursor-not-allowed" : ""}
        `}>
          {icon && (
            <span className={`transition-colors ${error ? "text-red-400" : isFocused ? "text-[var(--accent-brand)]" : "text-[var(--text-tertiary)]"}`}>
              {icon}
            </span>
          )}
          <input
            type={type}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className="
              flex-1 bg-transparent font-sans text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none
            "
          />
          {error && (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="font-sans text-[11px] text-red-500 mt-2 flex items-center gap-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && (
        <p className="font-sans text-[11px] text-[var(--text-tertiary)] mt-2">
          {hint}
        </p>
      )}
    </div>
  );
}
