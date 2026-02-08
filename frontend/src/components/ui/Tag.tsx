"use client";

import React from "react";

type Props = {
  label: string;
  variant?: "block" | "inline";
  className?: string;
};

export default function Tag({
  label,
  variant = "block",
  className = "",
}: Props) {
  const base = "text-[11px] font-bold text-white/30 uppercase tracking-[0.3em]";
  const variantClass = variant === "block" ? "block mb-4" : "inline";

  return (
    <span className={`${base} ${variantClass} ${className}`.trim()}>
      {label}
    </span>
  );
}
