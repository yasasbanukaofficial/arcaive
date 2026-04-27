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
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">
          {label}
          {required && <span className="text-accent ml-1 font-mono">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          name={name}
          type={show ? "text" : "password"}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`
            w-full px-[14px] py-[12px] pr-16 font-sans text-[15px] border 
            focus:outline-none focus:border-[var(--text-primary)]
            disabled:opacity-40 disabled:cursor-not-allowed
            ${error ? "border-[#D83B2A]" : "border-[var(--glass-border)] bg-[var(--glass-bg)]"}
          `}
          style={{ borderRadius: 0 }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          disabled={disabled}
          className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? "HIDE" : "SHOW"}
        </button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="font-mono text-[11px] text-[#D83B2A] mt-2"
          >
            ! {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && (
        <p className="font-mono text-[10px] text-[var(--text-secondary)] mt-2">
          {hint}
        </p>
      )}
    </div>
  );
}
