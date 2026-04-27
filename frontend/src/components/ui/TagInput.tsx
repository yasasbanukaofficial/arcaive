"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";

type TagInputProps = {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  maxTags?: number;
  disabled?: boolean;
  hint?: string;
  error?: string;
  required?: boolean;
  variant?: "default" | "blue" | "green" | "purple";
  className?: string;
};

function getTagStyles(variant: string): React.CSSProperties {
  switch (variant) {
    case "blue":
    case "green":
    case "purple":
      return {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        color: "var(--text-primary)",
        border: "1px solid var(--glass-border)",
      };
    default:
      return {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        color: "var(--d-text-primary)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
      };
  }
}

export default function TagInput({
  label,
  tags,
  onChange,
  placeholder = "Type and press Enter...",
  suggestions = [],
  maxTags,
  disabled = false,
  hint,
  error,
  required = false,
  className = "",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(s) &&
      inputValue.length > 0,
  );

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim();
      if (!trimmed) return;
      if (tags.includes(trimmed)) return;
      if (maxTags && tags.length >= maxTags) return;

      onChange([...tags, trimmed]);
      setInputValue("");
      setShowSuggestions(false);
      inputRef.current?.focus();
    },
    [tags, onChange, maxTags],
  );

  const removeTag = useCallback(
    (index: number) => {
      if (disabled) return;
      const updated = tags.filter((_, i) => i !== index);
      onChange(updated);
      inputRef.current?.focus();
    },
    [tags, onChange, disabled],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addTag(inputValue);
      } else if (
        e.key === "Backspace" &&
        inputValue === "" &&
        tags.length > 0
      ) {
        removeTag(tags.length - 1);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
        inputRef.current?.blur();
      }
    },
    [inputValue, tags, addTag, removeTag],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val.includes(",")) {
        const parts = val.split(",");
        parts.forEach((part) => {
          const trimmed = part.trim();
          if (trimmed) addTag(trimmed);
        });
        return;
      }
      setInputValue(val);
      setShowSuggestions(val.length > 0 && filteredSuggestions.length > 0);
    },
    [addTag, filteredSuggestions.length],
  );

  const handleContainerClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    }, 150);
  }, [inputValue, addTag]);

  const atLimit = maxTags !== undefined && tags.length >= maxTags;

  return (
    <div className={`flex flex-col ${className}`} ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
            {label}
            {required && <span className="text-accent ml-1 font-mono">*</span>}
          </label>
          {maxTags && (
            <span className="font-mono text-[10px] text-[var(--text-secondary)]">
              {tags.length}/{maxTags}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <div
          onClick={handleContainerClick}
          className={`
            flex flex-wrap items-center gap-2 px-[14px] py-[12px] min-h-[50px] border 
            ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-text"}
            ${error ? "border-[#D83B2A]" : isFocused ? "border-[var(--text-primary)]" : "border-[var(--glass-border)] bg-[var(--glass-bg)]"}
          `}
          style={{ borderRadius: "var(--radius)" }}
        >
          <AnimatePresence mode="popLayout">
            {tags.map((tag, index) => (
              <motion.span
                key={tag}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-2 px-2 py-1 border border-[var(--glass-border)] bg-[var(--glass-border)] font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] shrink-0"
                style={{ borderRadius: "var(--radius)" }}
              >
                <span className="truncate max-w-[150px]">{tag}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(index);
                    }}
                    className="font-mono text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    aria-label={`Remove ${tag}`}
                  >
                    ×
                  </button>
                )}
              </motion.span>
            ))}
          </AnimatePresence>
          {!atLimit && !disabled && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setIsFocused(true);
                if (inputValue.length > 0 && filteredSuggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={handleBlur}
              placeholder={tags.length === 0 ? placeholder : ""}
              disabled={disabled}
              className="flex-1 min-w-[120px] bg-transparent font-sans text-[15px] outline-none placeholder:text-[var(--text-secondary)]/30 py-1"
            />
          )}
        </div>
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute z-[9999] w-full mt-2 bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--text-primary)] overflow-y-auto max-h-[220px] shadow-2xl"
              style={{ borderRadius: "var(--radius)" }}
            >
              {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addTag(suggestion);
                    }}
                    className="w-full flex items-center gap-3 px-[14px] py-[10px] text-left hover:bg-white/5 transition-colors border-b border-[var(--glass-border)] last:border-b-0"
                  >
                    <span className="font-mono text-[10px] text-[var(--text-secondary)]">→</span>
                    <span className="font-sans text-[13px] font-bold uppercase tracking-tight text-[var(--text-primary)] truncate">{suggestion}</span>
                  </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="font-mono text-[11px] text-[#D83B2A] mt-2">! {error}</p>
      )}
      {hint && !error && (
        <p className="font-mono text-[10px] text-[var(--text-secondary)] mt-2">
          {hint}
        </p>
      )}
    </div>
  );
}
