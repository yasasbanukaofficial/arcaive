"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

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
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-3 ml-1">
          <label className="text-[12px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.1em] flex items-center gap-1.5">
            {label}
            {required && <span className="text-[var(--accent-brand)]">*</span>}
          </label>
          {maxLength && (
            <span className={`text-[10px] font-bold uppercase tracking-widest ${value.length >= maxLength * 0.9 ? "text-[var(--accent-brand)]" : "text-[var(--text-tertiary)]"}`}>
              {value.length} / {maxLength}
            </span>
          )}
        </div>
      )}
      <div className={`
        relative rounded-[24px] bg-[var(--text-primary)]/[0.03] border transition-all duration-300
        ${error 
          ? "border-red-500/30 focus-within:border-red-500/50" 
          : isFocused 
            ? "border-[var(--text-primary)]/20 bg-[var(--bg-color)] shadow-[0_10px_30px_rgba(0,0,0,0.3)]" 
            : "border-[var(--glass-border)] hover:border-[var(--text-primary)]/10"
        }
        ${disabled ? "opacity-20 cursor-not-allowed" : ""}
      `}>
        <textarea
          name={name}
          value={value ?? ""}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`
            w-full px-6 py-5 text-[14px] font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none bg-transparent
            transition-colors duration-300 min-h-[140px]
            ${resize === "none" ? "resize-none" : "resize-y"}
          `}
        />
        {error && (
          <div className="absolute top-4 right-4">
            <AlertCircle className="w-4 h-4 text-red-400/60" />
          </div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="text-[11px] font-semibold text-red-500/80 mt-2.5 ml-1 flex items-center gap-1.5"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && (
        <p className="text-[11px] font-medium text-[var(--text-tertiary)] mt-2.5 ml-1 tracking-tight">
          {hint}
        </p>
      )}
    </div>
  );
}
