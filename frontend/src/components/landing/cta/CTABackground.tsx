import React from "react";

interface CTABackgroundProps {
  imageUrl: string;
  imageAlt: string;
}

const CTABackground = ({
  imageUrl,
  imageAlt,
}: CTABackgroundProps) => {
  return (
    <>
      <div className="absolute inset-0 z-0">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover brightness-[0.45] contrast-[1.1] saturate-[0.7]"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </>
  );
};

export default CTABackground;
