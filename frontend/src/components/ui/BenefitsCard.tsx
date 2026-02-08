"use client";

import React from "react";

type Props = {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
};

const BenefitsCard: React.FC<Props> = ({ icon: Icon, title, description }) => {
  return (
    <div className="group relative p-10 md:p-5 bg-[#121212]/50 border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-full border border-white/20 text-white/70 group-hover:text-white group-hover:border-white/40 transition-colors">
          <Icon size={24} strokeWidth={1.6} />
        </div>

        <h3 className="text-lg font-medium text-white mb-3 tracking-tight">
          {title}
        </h3>

        <p className="text-sm leading-relaxed text-white/40 group-hover:text-white/60 transition-colors">
          {description}
        </p>
      </div>
    </div>
  );
};

export default BenefitsCard;
