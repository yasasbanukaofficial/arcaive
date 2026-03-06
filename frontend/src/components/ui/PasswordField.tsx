"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PasswordFieldProps = {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  error?: string;
  autoComplete?: string;
  className?: string;
};

export default function PasswordField({
  label,
  value,
  onChange,
  onBlur,
  name = "password",
  placeholder = "••••••••",
  required = false,
  disabled = false,
  hint,
  error,
  autoComplete,
  className = "",
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

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
        <input
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`
            w-full rounded-xl px-4 py-2.5 pr-11 text-[13px]
            outline-none transition-all duration-200
            placeholder:opacity-40
            disabled:opacity-40 disabled:cursor-not-allowed
            focus:ring-2 focus:ring-blue-500/20
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
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          disabled={disabled}
          className={`
            absolute right-3 top-1/2 -translate-y-1/2
            w-7 h-7 rounded-lg flex items-center justify-center
            transition-colors duration-150
            disabled:opacity-40 disabled:cursor-not-allowed
          `}
          style={{
            color: "var(--d-text-muted)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.backgroundColor = "var(--d-surface-hover)";
              e.currentTarget.style.color = "var(--d-text-tertiary)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--d-text-muted)";
          }}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
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
