"use client";

import React from "react";

type Props = {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
};

const BenefitsCard = ({ icon: Icon, title, description }: Props) => {
  return (
    <div className="group relative p-6 sm:p-8 md:p-8 lg:p-10 bg-[#121212]/50 border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="mb-5 sm:mb-6 md:mb-8 inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border border-white/20 text-white/70 group-hover:text-white group-hover:border-white/40 transition-colors">
          <Icon size={20} className="sm:hidden" strokeWidth={1.6} />
          <Icon size={24} className="hidden sm:block" strokeWidth={1.6} />
        </div>

        <h3 className="text-base sm:text-lg font-medium text-white mb-2 sm:mb-3 tracking-tight">
          {title}
        </h3>

        <p className="text-[13px] sm:text-sm leading-relaxed text-white/40 group-hover:text-white/60 transition-colors">
          {description}
        </p>
      </div>
    </div>
  );
};

export default BenefitsCard;
