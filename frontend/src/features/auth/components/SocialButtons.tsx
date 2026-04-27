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

  const buttonStyle = "w-full cursor-pointer flex items-center justify-center gap-3 py-3 px-4 border border-[#222222] bg-[#0a0a0a] text-[#ffffff] font-sans text-[14px] font-medium hover:bg-[#1a1a1a] transition-colors duration-200 rounded-lg";

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
