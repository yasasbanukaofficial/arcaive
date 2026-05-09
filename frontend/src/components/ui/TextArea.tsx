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
        <div className="flex items-center justify-between mb-2.5">
          <label className="font-sans text-[12px] font-medium text-white/60 flex items-center gap-1.5">
            {label}
            {required && <span className="text-[#e6efdf]">*</span>}
          </label>
          {maxLength && (
            <span className={`font-mono text-[10px] ${value.length >= maxLength * 0.9 ? "text-[#e6efdf]" : "text-white/25"}`}>
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      )}
      <div className={`
        relative rounded-[16px] bg-[#0d0d0d] border transition-all duration-200
        ${error 
          ? "border-red-500/50 focus-within:border-red-500/70 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" 
          : isFocused 
            ? "border-[#e6efdf]/50 shadow-[0_0_0_3px_rgba(230,239,223,0.1)]" 
            : "border-[#2a2a2a] hover:border-[#3a3a3a]"
        }
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
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
            w-full px-4 py-3.5 font-sans text-[14px] text-white placeholder:text-white/20 outline-none bg-transparent
            transition-colors duration-200 min-h-[120px]
            ${resize === "none" ? "resize-none" : "resize-y"}
          `}
        />
        {error && (
          <div className="absolute top-3 right-3">
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="font-sans text-[11px] text-red-400 mt-2 flex items-center gap-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && (
        <p className="font-sans text-[11px] text-white/30 mt-2">
          {hint}
        </p>
      )}
    </div>
  );
}
