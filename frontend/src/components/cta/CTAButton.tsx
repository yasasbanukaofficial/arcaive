import React from "react";
import Link from "next/link";

interface CTAButtonProps {
  text: string;
  href: string;
}

const CTAButton: React.FC<CTAButtonProps> = ({ text, href }) => {
  return (
    <div className="pt-1.5 sm:pt-2">
      <Link
        href={href}
        className="inline-block bg-zinc-100 hover:bg-white text-black font-semibold py-1.5 px-4 sm:px-5 rounded-full text-[12px] sm:text-[13px] transition-all duration-200"
      >
        {text}
      </Link>
    </div>
  );
};

export default CTAButton;
