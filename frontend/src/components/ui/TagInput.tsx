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
      return {
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        color: "#60a5fa",
        border: "1px solid rgba(59, 130, 246, 0.3)",
      };
    case "green":
      return {
        backgroundColor: "rgba(34, 197, 94, 0.15)",
        color: "#4ade80",
        border: "1px solid rgba(34, 197, 94, 0.3)",
      };
    case "purple":
      return {
        backgroundColor: "rgba(139, 92, 246, 0.15)",
        color: "#a78bfa",
        border: "1px solid rgba(139, 92, 246, 0.3)",
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
  variant = "default",
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

  const tagStyle = getTagStyles(variant);
  const atLimit = maxTags !== undefined && tags.length >= maxTags;

  return (
    <div className={`space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            className="block text-xs font-bold ml-0.5 tracking-widest uppercase"
            style={{ color: "var(--d-text-secondary)" }}
          >
            {label}
            {required && <span className="text-red-400/70 ml-0.5">*</span>}
          </label>
          {maxTags && (
            <span
              className="text-[11px] tabular-nums"
              style={{
                color: atLimit
                  ? "rgba(234, 179, 8, 0.7)"
                  : "var(--d-text-muted)",
              }}
            >
              {tags.length}/{maxTags}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <div
          onClick={handleContainerClick}
          className={`
            flex flex-wrap items-center gap-2 rounded-xl px-4 py-3 min-h-[50px]
            transition-all duration-200
            ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-text"}
          `}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: error
              ? "1.5px solid rgba(239, 68, 68, 0.5)"
              : isFocused
                ? "1.5px solid #3b82f6"
                : "1.5px solid rgba(255, 255, 255, 0.12)",
            boxShadow: isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.15)" : "none",
          }}
        >
          <AnimatePresence mode="popLayout">
            {tags.map((tag, index) => (
              <motion.span
                key={tag}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, width: 0, marginRight: -4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold select-none shrink-0"
                style={tagStyle}
              >
                <span className="truncate max-w-[150px]">{tag}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(index);
                    }}
                    className="shrink-0 w-4 h-4 flex items-center justify-center rounded-full transition-all duration-150 hover:opacity-70 -mr-0.5"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="w-3 h-3" />
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
              className="flex-1 min-w-[80px] bg-transparent text-sm font-semibold outline-none placeholder:text-white/40 placeholder:font-medium py-1"
              style={{ color: "var(--d-text-primary)" }}
            />
          )}
        </div>
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute z-50 w-full mt-1.5 rounded-xl py-1 overflow-hidden backdrop-blur-xl max-h-48 overflow-y-auto"
              style={{
                backgroundColor: "var(--d-bg)",
                border: "1px solid var(--d-border-hover)",
                boxShadow:
                  "0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15)",
              }}
            >
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addTag(suggestion);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[13px] transition-colors duration-150 outline-none"
                  style={{
                    color: "var(--d-text-secondary)",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--d-surface-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Plus
                    className="w-3 h-3 shrink-0"
                    style={{ color: "var(--d-text-muted)" }}
                  />
                  <span className="truncate">{suggestion}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="text-[12px] ml-0.5 text-red-400/80">{error}</p>
      )}
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
