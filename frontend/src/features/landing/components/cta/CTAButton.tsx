import React from "react";
import Link from "next/link";

interface CTAButtonProps {
  text: string;
  href: string;
}

const CTAButton = ({ text, href }: CTAButtonProps) => {
  return (
    <div className="pt-2">
      <Link
        href={href}
        className="cursor-pointer inline-flex items-center justify-center bg-white text-black font-mono text-[11px] font-bold uppercase tracking-widest py-3 px-6 border border-white hover:bg-black hover:text-white transition-colors duration-200"
        style={{ borderRadius: 0 }}
      >
        {text.replace(/\s+/g, '_')}
      </Link>
    </div>
  );
};

export default CTAButton;
