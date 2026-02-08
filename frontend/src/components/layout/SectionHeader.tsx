"use client";

import React from "react";

type Props = {
  label: string;
  title: string | React.ReactNode;
  subtitle?: string;
};

const SectionHeader: React.FC<Props> = ({ label, title, subtitle }) => (
  <div className="space-y-4 max-w-2xl mb-12">
    <div className="flex items-center gap-2 text-[10px] font-medium text-white/40 uppercase tracking-[0.2em]">
      <span className="w-1 h-1 rounded-full bg-white/40" />
      {label}
    </div>
    <h2 className="text-3xl md:text-4xl font-light tracking-tight leading-tight text-white/90">
      {title}{" "}
      {subtitle && <span className="text-white/40 italic">{subtitle}</span>}
    </h2>
  </div>
);

export default SectionHeader;
