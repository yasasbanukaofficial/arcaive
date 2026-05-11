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
        className="cursor-pointer inline-flex items-center justify-center text-[var(--text-primary)] font-mono text-[11px] font-bold uppercase tracking-widest py-3 px-6 border border-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-color)] transition-colors duration-200"
        style={{ borderRadius: "var(--radius)" }}
      >
        {text}
      </Link>
    </div>
  );
};

export default CTAButton;
