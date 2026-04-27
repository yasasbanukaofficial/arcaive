"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
};

type SelectProps = {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
};

export default function Select({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  disabled = false,
  hint,
  error,
  required = false,
  icon,
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClickOutside, handleKeyDown]);

  return (
    <div className={`flex flex-col ${className}`} ref={containerRef}>
      {label && (
        <label className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">
          {label}
          {required && <span className="text-accent ml-1 font-mono">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              if (!isOpen) {
                const rect = containerRef.current?.getBoundingClientRect();
                const spaceBelow = window.innerHeight - (rect?.bottom || 0);
                setOpenUp(spaceBelow < 300);
              }
              setIsOpen(!isOpen);
            }
          }}
          className={`
            w-full flex items-center justify-between gap-2
            px-[14px] py-[12px] font-sans text-[15px] text-left border 
            focus:outline-none transition-all duration-200
            disabled:opacity-40 disabled:cursor-not-allowed
            ${error ? "border-red-500" : isOpen ? "border-black bg-black/5" : "border-black bg-white"}
          `}
          style={{ 
            borderRadius: "var(--radius)",
            color: "#000000",
            borderWidth: "1px",
            borderStyle: "solid",
            zIndex: isOpen ? 51 : 1
          }}
        >
          <div className="flex items-center gap-3 truncate">
            {icon && <span className="shrink-0 text-gray-500">{icon}</span>}
            <span className={`truncate ${!selected ? "text-gray-500" : "text-black font-medium"}`}>
              {selected ? selected.label : placeholder}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 shrink-0 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: openUp ? 10 : -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: openUp ? 10 : -10 }}
              className={`absolute left-0 right-0 z-[10000] overflow-y-auto max-h-[280px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] ${openUp ? "bottom-full mb-2" : "top-full mt-2"}`}
              style={{ 
                borderRadius: "var(--radius)",
                backgroundColor: "#ffffff",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "#000000"
              }}
            >
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-[14px] py-[10px] text-left transition-colors border-b last:border-b-0
                      ${isSelected ? "bg-gray-100" : "hover:bg-gray-50"}
                    `}
                    style={{ borderColor: "#e5e5e5" }}
                  >
                    <span className="font-sans text-[14px] font-medium text-black">
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="font-mono text-[10px] text-gray-500 uppercase mt-0.5">
                        {option.description}
                      </span>
                    )}
                  </button>
                );
              })}

              {options.length === 0 && (
                <div className="px-[14px] py-[12px] font-mono text-[11px] text-gray-500 text-center">
                  No options available
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="font-mono text-[11px] text-red-500 mt-2">! {error}</p>
      )}
      {hint && !error && (
        <p className="font-mono text-[10px] text-gray-500 mt-2">
          {hint}
        </p>
      )}
    </div>
  );
}