"use client";
import React from "react";
import { Github, Chrome } from "lucide-react";
import Link from "next/link";

export default function SocialButtons({
  googleUrl,
  githubUrl,
}: {
  googleUrl: string;
  githubUrl: string;
}) {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || window.location.origin;
  const oauthCallbackUrl = `${frontendUrl}/login/oauth`;

  const buildOAuthUrl = (baseUrl: string) => {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}redirect_uri=${encodeURIComponent(oauthCallbackUrl)}`;
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      <Link href={buildOAuthUrl(googleUrl)} className="w-full cursor-pointer flex items-center justify-center gap-3 py-3.5 px-4 border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-primary)] font-sans text-[13px] font-medium hover:bg-[var(--btn-hover-bg)] hover:text-[var(--btn-hover-text)] transition-all duration-200" style={{ borderRadius: "var(--radius)" }}>
        <Chrome size={16} />
        <span>Continue with Google</span>
      </Link>
      <Link href={buildOAuthUrl(githubUrl)} className="w-full cursor-pointer flex items-center justify-center gap-3 py-3.5 px-4 border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-primary)] font-sans text-[13px] font-medium hover:bg-[var(--btn-hover-bg)] hover:text-[var(--btn-hover-text)] transition-all duration-200" style={{ borderRadius: "var(--radius)" }}>
        <Github size={16} />
        <span>Continue with GitHub</span>
      </Link>
    </div>
  );
}
