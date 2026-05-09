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
  className = "",
}: TextFieldProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="font-sans text-[12px] font-medium text-white/40 uppercase tracking-widest mb-2">
          {label}
          {required && <span className="text-[#e6efdf] ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-3 font-sans text-[14px] rounded-[16px]
            bg-[#1a1a1a] text-white/90
            border focus:outline-none focus:ring-1 focus:ring-[#4a7c59]/50 focus:border-[#4a7c59]
            disabled:opacity-40 disabled:cursor-not-allowed
            placeholder:text-white/20
            transition-colors duration-200
            ${error ? "border-red-500/50 bg-red-500/5" : "border-[#2a2a2a] hover:border-[#3a3a3a]"}
          `}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="font-sans text-[11px] text-red-400 mt-1.5"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && (
        <p className="font-sans text-[11px] text-white/25 mt-1.5">
          {hint}
        </p>
      )}
    </div>
  );
}
