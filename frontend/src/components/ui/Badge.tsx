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

function getVariantStyles(variant: BadgeVariant): React.CSSProperties {
  switch (variant) {
    case "blue":
      return {
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        color: "rgba(59, 130, 246, 0.8)",
        border: "1px solid rgba(59, 130, 246, 0.15)",
      };
    case "green":
      return {
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        color: "rgba(34, 197, 94, 0.8)",
        border: "1px solid rgba(34, 197, 94, 0.15)",
      };
    case "red":
      return {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        color: "rgba(239, 68, 68, 0.8)",
        border: "1px solid rgba(239, 68, 68, 0.15)",
      };
    case "purple":
      return {
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        color: "rgba(139, 92, 246, 0.8)",
        border: "1px solid rgba(139, 92, 246, 0.15)",
      };
    case "yellow":
      return {
        backgroundColor: "rgba(234, 179, 8, 0.1)",
        color: "rgba(234, 179, 8, 0.8)",
        border: "1px solid rgba(234, 179, 8, 0.15)",
      };
    case "default":
    default:
      return {
        backgroundColor: "var(--d-surface)",
        color: "var(--d-text-secondary)",
        border: "1px solid var(--d-border)",
      };
  }
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[11px] gap-1 rounded-md",
  md: "px-2.5 py-1 text-[12px] gap-1.5 rounded-lg",
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  removable = false,
  onRemove,
  icon,
  className = "",
}: BadgeProps) {
  const variantStyle = getVariantStyles(variant);

  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`
        inline-flex items-center font-medium whitespace-nowrap select-none
        ${sizeClasses[size]}
        ${className}
      `}
      style={variantStyle}
    >
      {icon && (
        <span className="shrink-0 w-3 h-3 flex items-center justify-center">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="shrink-0 w-3.5 h-3.5 flex items-center justify-center rounded-full transition-colors duration-150 hover:bg-black/10 -mr-0.5"
          aria-label={`Remove ${children}`}
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </motion.span>
  );
}
