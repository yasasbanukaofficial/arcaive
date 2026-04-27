"use client";

import React from "react";

type Props = {
  label: string;
  title: string | React.ReactNode;
  subtitle?: string;
};

const SectionHeader = ({ label, title, subtitle }: Props) => (
  <div className="space-y-3 sm:space-y-4 max-w-2xl mb-8 sm:mb-10 md:mb-12">
    <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-medium text-white/40 uppercase tracking-[0.2em]">
      <span className="w-1 h-1  bg-white/40" />
      {label}
    </div>
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight leading-tight text-white/90">
      {title}{" "}
      {subtitle && <span className="text-white/40 italic">{subtitle}</span>}
    </h2>
  </div>
);

export default SectionHeader;
