"use client";

import React from "react";
import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "white";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-[12px] rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-[13px] rounded-xl gap-2",
  lg: "px-6 py-3 text-[14px] rounded-xl gap-2.5",
};

function getVariantStyles(variant: ButtonVariant): React.CSSProperties {
  switch (variant) {
    case "primary":
      return {
        backgroundColor: "var(--d-text-primary)",
        color: "var(--d-bg)",
        border: "none",
      };
    case "secondary":
      return {
        backgroundColor: "var(--d-surface)",
        color: "var(--d-text-secondary)",
        border: "1px solid var(--d-border)",
      };
    case "danger":
      return {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        color: "rgba(239, 68, 68, 0.8)",
        border: "1px solid rgba(239, 68, 68, 0.2)",
      };
    case "ghost":
      return {
        backgroundColor: "transparent",
        color: "var(--d-text-tertiary)",
        border: "1px solid transparent",
      };
    case "white":
      return {
        backgroundColor: "#ffffff",
        color: "#000000",
        border: "1px solid var(--d-border)",
      };
    default:
      return {};
  }
}

function getHoverStyles(variant: ButtonVariant): React.CSSProperties {
  switch (variant) {
    case "primary":
      return {
        backgroundColor: "var(--d-text-secondary)",
      };
    case "secondary":
      return {
        backgroundColor: "var(--d-surface-hover)",
        borderColor: "var(--d-border-hover)",
      };
    case "danger":
      return {
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        borderColor: "rgba(239, 68, 68, 0.3)",
      };
    case "ghost":
      return {
        backgroundColor: "var(--d-surface)",
        borderColor: "var(--d-border)",
      };
    case "white":
      return {
        backgroundColor: "#f5f5f5",
        color: "#000000",
        borderColor: "var(--d-border-hover)",
      };
    default:
      return {};
  }
}

export default function Button({
  children,
  variant = "secondary",
  size = "md",
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  style: customStyle,
  backgroundColor,
  textColor,
  borderColor,
}: ButtonProps) {
  const baseStyle = getVariantStyles(variant);
  const hoverStyle = getHoverStyles(variant);

  // Allow custom style overrides
  const finalBaseStyle = {
    ...baseStyle,
    ...(backgroundColor && { backgroundColor }),
    ...(textColor && { color: textColor }),
    ...(borderColor && { border: `1px solid ${borderColor}` }),
    ...customStyle,
  };

  const finalHoverStyle = {
    ...hoverStyle,
    ...(backgroundColor && { backgroundColor }),
    ...(textColor && { color: textColor }),
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={disabled || loading ? undefined : { scale: 1.02 }}
      whileTap={disabled || loading ? undefined : { scale: 0.97 }}
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      style={finalBaseStyle}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, finalHoverStyle);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, finalBaseStyle);
        }
      }}
    >
      {loading && (
        <svg
          className="animate-spin w-3.5 h-3.5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {!loading && icon && iconPosition === "left" && (
        <span className="shrink-0 w-4 h-4 flex items-center justify-center">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === "right" && (
        <span className="shrink-0 w-4 h-4 flex items-center justify-center">
          {icon}
        </span>
      )}
    </motion.button>
  );
}
