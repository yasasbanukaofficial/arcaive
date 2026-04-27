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
        <label className="font-mono text-[11px] uppercase tracking-widest text-[#888880] mb-2">
          {label}
          {required && <span className="text-accent ml-1 font-mono">*</span>}
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
            w-full px-[14px] py-[12px] font-sans text-[15px] border 
            focus:outline-none focus:border-black
            disabled:opacity-40 disabled:cursor-not-allowed
            ${error ? "border-[#D83B2A]" : "border-[#E8E6DE] bg-white"}
          `}
          style={{ borderRadius: 0 }}
        />
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
        <p className="font-mono text-[10px] text-[#888880] mt-2">
          {hint}
        </p>
      )}
    </div>
  );
}
