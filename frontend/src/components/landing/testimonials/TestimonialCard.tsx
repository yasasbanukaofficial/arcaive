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
      } border border-white/10 p-6 md:p-8 flex flex-col justify-between aspect-[4/3] md:group-hover:hover:opacity-100 group hover:border-white/20 transition-colors`}
    >
      <p className="text-lg font-light leading-relaxed text-white/80">
        {quote}
      </p>

      <div className="pt-8 flex justify-between items-end border-t border-white/5">
        <div>
          <div className="text-sm font-medium text-white">{name}</div>
          <div className="text-xs text-white/30">{role}</div>
        </div>
        <div className="text-[10px] font-mono text-white/20">
          {index + 1}/{total}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
