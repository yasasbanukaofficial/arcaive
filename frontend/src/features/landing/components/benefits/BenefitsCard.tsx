"use client";

import React from "react";

type Props = {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
};

const BenefitsCard = ({ icon: Icon, title, description }: Props) => {
  return (
    <div className="group relative p-8 sm:p-10 bg-[#111] border border-white/10 hover:border-white/30 transition-[border-color] duration-300 overflow-hidden h-full" style={{ borderRadius: 0 }}>
      <div className="relative z-10">
        <div className="mb-8 inline-flex items-center justify-center w-12 h-12 border border-white/20 text-white/50 group-hover:text-white group-hover:border-white transition-colors" style={{ borderRadius: 0 }}>
          <Icon size={24} strokeWidth={1.5} />
        </div>

        <h3 className="font-sans text-[20px] font-bold text-white mb-4 uppercase tracking-tight">
          {title}
        </h3>

        <p className="font-sans text-[14px] leading-relaxed text-[#888880] group-hover:text-white transition-colors">
          {description}
        </p>
      </div>
    </div>
  );
};

export default BenefitsCard;
