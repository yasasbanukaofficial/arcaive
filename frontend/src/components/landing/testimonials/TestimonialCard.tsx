"use client";

import React from "react";

type Props = {
  quote: string;
  name: string;
  role: string;
  index: number;
  total: number;
  mode?: "grid" | "carousel";
};

const TestimonialCard: React.FC<Props> = ({
  quote,
  name,
  role,
  index,
  total,
  mode = "carousel",
}) => {
  return (
    <div
      className={`${
        mode === "carousel" ? "w-full flex-shrink-0" : "w-full"
      } border border-white/10 p-5 sm:p-6 md:p-8 flex flex-col justify-between aspect-auto min-h-[240px] sm:min-h-[260px] md:aspect-[4/3] md:min-h-0 group hover:border-white/20 transition-colors`}
    >
      <p className="text-[15px] sm:text-base md:text-lg font-light leading-relaxed text-white/80">
        {quote}
      </p>

      <div className="pt-5 sm:pt-6 md:pt-8 flex justify-between items-end border-t border-white/5 mt-auto">
        <div>
          <div className="text-[13px] sm:text-sm font-medium text-white">
            {name}
          </div>
          <div className="text-[11px] sm:text-xs text-white/30">{role}</div>
        </div>
        <div className="text-[9px] sm:text-[10px] font-mono text-white/20">
          {index + 1}/{total}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
