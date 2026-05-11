"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/features/dashboard/components/animations";

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
      className={`bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[24px] transition-colors duration-300 shadow-[var(--shadow-premium)] ${className}`}
    >
      {(title || actions) && (
        <div
          className={`flex items-start justify-between gap-4 px-8 pt-7 ${
            collapsed ? "pb-7" : description ? "pb-1" : "pb-7"
          }`}
        >
          <div className="flex flex-col min-w-0 flex-1">
            {title && (
              <h3 className="font-sans text-[16px] font-semibold text-[var(--text-primary)]/90 tracking-tight">
                {title}
              </h3>
            )}
            {description && !collapsed && (
              <p className="font-sans text-[13px] text-[var(--text-secondary)] mt-1.5">
                {description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {actions}
            {collapsible && (
              <button
                type="button"
                onClick={() => setCollapsed((c) => !c)}
                className="w-8 h-8 rounded-full border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-border)] transition-colors text-[12px]"
                aria-label={collapsed ? "Expand section" : "Collapse section"}
              >
                {collapsed ? "+" : "−"}
              </button>
            )}
          </div>
        </div>
      )}
      {!collapsed && (
        <div>
          {(title || actions) && (
            <div className="h-[1px] bg-[var(--glass-border)] mx-8 mt-4" />
          )}
          <div className={noPadding ? "" : "px-8 py-6"}>
            {children}
          </div>
        </div>
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
      className={`flex flex-col sm:flex-row sm:items-start justify-between gap-6 py-6 border-b last:border-b-0 border-[var(--glass-border)] ${className}`}
    >
      <div className="sm:flex-1 min-w-0 sm:max-w-[50%]">
        <p className="font-sans text-[13px] font-medium text-[var(--text-primary)]/80">
          {label}
        </p>
        {description && (
          <p className="font-sans text-[11px] text-[var(--text-secondary)]/35 mt-1">
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
