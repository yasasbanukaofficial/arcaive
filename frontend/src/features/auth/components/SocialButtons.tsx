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

  const buttonStyle = "cursor-pointer flex items-center justify-center gap-3 py-[14px] px-[28px] border border-black bg-white text-black font-mono text-[11px] font-bold uppercase tracking-[0.15em]  hover:bg-[#F5F4EF]";

  return (
    <div className="grid grid-cols-1 gap-3">
      <Link href={buildOAuthUrl(googleUrl)} className={buttonStyle} style={{ borderRadius: 0 }}>
        Continue with Google
      </Link>
      <Link href={buildOAuthUrl(githubUrl)} className={buttonStyle} style={{ borderRadius: 0 }}>
        Continue with GitHub
      </Link>
    </div>
  );
}
