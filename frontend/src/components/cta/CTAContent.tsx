import React from "react";

interface CTAContentProps {
  heading: string;
  headingHighlight?: string;
  subtext: string;
}

const CTAContent: React.FC<CTAContentProps> = ({
  heading,
  headingHighlight,
  subtext,
}) => {
  return (
    <div className="max-w-xs sm:max-w-sm md:max-w-md space-y-3 sm:space-y-4">
      <h2 className="text-xl sm:text-2xl md:text-[32px] lg:text-[40px] font-normal text-zinc-100 leading-[1.15] sm:leading-[1.1] tracking-tight">
        {heading}
        {headingHighlight && (
          <>
            {" "}
            <br />
            {headingHighlight}
          </>
        )}
      </h2>

      <p className="text-[11px] sm:text-[13px] md:text-sm text-zinc-400/90 max-w-[220px] sm:max-w-[260px] md:max-w-[280px] leading-relaxed">
        {subtext}
      </p>
    </div>
  );
};

export default CTAContent;
