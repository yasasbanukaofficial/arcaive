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
    <div className="max-w-md space-y-4">
      <h2 className="text-2xl md:text-[40px] font-normal text-zinc-100 leading-[1.1] tracking-tight">
        {heading}
        {headingHighlight && (
          <>
            {" "}
            <br />
            {headingHighlight}
          </>
        )}
      </h2>

      <p className="text-[13px] md:text-sm text-zinc-400/90 max-w-[280px] leading-relaxed">
        {subtext}
      </p>
    </div>
  );
};

export default CTAContent;
