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
          className="block text-xs font-bold ml-0.5 tracking-widest uppercase"
          style={{ color: "var(--d-text-secondary)" }}
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
            w-full rounded-xl px-4 py-3 text-sm font-semibold
            outline-none transition-all duration-200
            placeholder:text-white/40 placeholder:font-medium
            disabled:opacity-40 disabled:cursor-not-allowed
            focus:ring-2 focus:ring-blue-500/30
            ${icon ? "pl-10" : ""}
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
