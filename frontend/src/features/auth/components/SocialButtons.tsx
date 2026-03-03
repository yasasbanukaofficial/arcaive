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
  return (
    <div className="grid grid-cols-2 gap-4">
      <Link
        href={googleUrl}
        className="cursor-pointer flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium"
      >
        <Chrome size={18} />
        Google
      </Link>
      <Link
        href={githubUrl}
        className="cursor-pointer flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium"
      >
        <Github size={18} />
        GitHub
      </Link>
    </div>
  );
}
