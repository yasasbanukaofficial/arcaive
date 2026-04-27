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
      className={`bg-[var(--glass-bg)] border border-[var(--glass-border)] oryzo-card-glow transition-colors duration-300 ${className}`}
      style={{ borderRadius: "var(--radius)" }}
    >
      {(title || actions) && (
        <div
          className={`flex items-start justify-between gap-4 px-8 pt-6 ${
            collapsed ? "pb-6" : description ? "pb-1" : "pb-6"
          }`}
        >
          <div className="flex flex-col min-w-0 flex-1">
            {title && (
              <h3 className="font-sans text-[18px] font-bold text-[var(--text-primary)] uppercase tracking-tight">
                {title}
              </h3>
            )}
            {description && !collapsed && (
              <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mt-2">
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
                className="font-mono text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                aria-label={collapsed ? "Expand section" : "Collapse section"}
              >
                {collapsed ? "[+]" : "[-]"}
              </button>
            )}
          </div>
        </div>
      )}
      {!collapsed && (
        <div>
          {(title || actions) && (
            <div className="h-[1px] bg-[#E8E6DE] mx-8 mt-4" />
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
      className={`flex flex-col sm:flex-row sm:items-start justify-between gap-6 py-6 border-b border-[var(--glass-border)] last:border-b-0 ${className}`}
    >
      <div className="sm:flex-1 min-w-0 sm:max-w-[50%]">
        <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--text-primary)]">
          {label}
        </p>
        {description && (
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mt-1.5">
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
