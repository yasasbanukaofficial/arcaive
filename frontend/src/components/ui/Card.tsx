"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/components/dashboard/animations";

type CardProps = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  noPadding?: boolean;
  className?: string;
};

export default function Card({
  title,
  description,
  icon,
  children,
  actions,
  collapsible = false,
  defaultCollapsed = false,
  noPadding = false,
  className = "",
}: CardProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  return (
    <motion.div
      variants={fadeUp}
      className={`rounded-2xl overflow-hidden transition-colors duration-300 ${className}`}
      style={{
        backgroundColor: "var(--d-surface)",
        border: "1px solid var(--d-border)",
      }}
    >
      {/* Header */}
      {(title || actions) && (
        <div
          className={`flex items-start justify-between gap-4 px-6 pt-5 ${
            collapsed ? "pb-5" : description ? "pb-1" : "pb-4"
          }`}
        >
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {icon && (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  backgroundColor: "var(--d-surface-active)",
                  border: "1px solid var(--d-border)",
                }}
              >
                <span
                  className="w-4 h-4 flex items-center justify-center"
                  style={{ color: "var(--d-text-tertiary)" }}
                >
                  {icon}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              {title && (
                <h3
                  className="text-[15px] font-semibold tracking-tight"
                  style={{ color: "var(--d-text-primary)" }}
                >
                  {title}
                </h3>
              )}
              {description && !collapsed && (
                <p
                  className="text-[12px] leading-relaxed mt-1 max-w-lg"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {actions}
            {collapsible && (
              <button
                type="button"
                onClick={() => setCollapsed((c) => !c)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150"
                style={{
                  color: "var(--d-text-muted)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--d-surface-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                aria-label={collapsed ? "Expand section" : "Collapse section"}
              >
                <motion.svg
                  animate={{ rotate: collapsed ? 0 : 180 }}
                  transition={{ duration: 0.2 }}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </motion.svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Body */}
      {!collapsed && (
        <motion.div
          initial={collapsible ? { opacity: 0, height: 0 } : undefined}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {(title || actions) && (
            <div
              className="mx-6 mt-3 mb-0"
              style={{
                borderTop: "1px solid var(--d-border-subtle)",
              }}
            />
          )}
          <div className={noPadding ? "" : "px-6 py-5"}>
            {children}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

type CardGridProps = {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
};

export function CardGrid({
  children,
  columns = 2,
  className = "",
}: CardGridProps) {
  const colClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid ${colClass} gap-4 ${className}`}>{children}</div>
  );
}

type CardRowProps = {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function CardRow({
  label,
  description,
  children,
  className = "",
}: CardRowProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-start justify-between gap-3 py-3.5 ${className}`}
      style={{
        borderBottom: "1px solid var(--d-border-subtle)",
      }}
    >
      <div className="sm:flex-1 min-w-0 sm:max-w-[50%]">
        <p
          className="text-[13px] font-medium"
          style={{ color: "var(--d-text-secondary)" }}
        >
          {label}
        </p>
        {description && (
          <p
            className="text-[12px] leading-relaxed mt-0.5"
            style={{ color: "var(--d-text-muted)" }}
          >
            {description}
          </p>
        )}
      </div>
      <div className="sm:flex-1 flex items-start justify-start sm:justify-end">
        {children}
      </div>
    </div>
  );
}
