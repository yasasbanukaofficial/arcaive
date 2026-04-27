"use client";

import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

type BadgeVariant = "default" | "blue" | "green" | "red" | "purple" | "yellow";
type BadgeSize = "sm" | "md";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  removable?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
  className?: string;
};

function getVariantClass(variant: BadgeVariant): string {
  switch (variant) {
    case "red":
      return "border-[#D83B2A] text-[#D83B2A] bg-[#D83B2A]/5";
    case "green":
      return "border-[#000] text-[var(--text-primary)] bg-[var(--glass-border)]";
    case "blue":
      return "border-[#000] text-[var(--text-primary)] bg-[var(--glass-border)]";
    case "purple":
      return "border-[#000] text-[var(--text-primary)] bg-[var(--glass-border)]";
    case "yellow":
      return "border-[#000] text-[var(--text-primary)] bg-[var(--glass-border)]";
    default:
      return "border-[var(--glass-border)] text-[var(--text-secondary)] bg-[var(--glass-bg)]";
  }
}

export default function Badge({
  children,
  variant = "default",
  size = "md",
  removable = false,
  onRemove,
  className = "",
}: BadgeProps) {
  const variantClass = getVariantClass(variant);

  return (
    <motion.span
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`
        inline-flex items-center font-mono text-[10px] font-bold uppercase tracking-widest whitespace-nowrap select-none border transition-colors
        ${size === "sm" ? "px-1.5 py-0.5" : "px-2 py-1"}
        ${variantClass}
        ${className}
      `}
      style={{ borderRadius: 0 }}
    >
      <span>{children}</span>
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-2 font-mono text-[11px] hover:text-[var(--text-primary)] transition-colors"
          aria-label={`Remove ${children}`}
        >
          ×
        </button>
      )}
    </motion.span>
  );
}
