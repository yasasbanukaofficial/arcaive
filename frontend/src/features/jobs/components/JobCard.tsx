"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { JobListing } from "@/@types/jobs";

interface JobCardProps {
  job: JobListing;
}

export default function JobCard({ job }: JobCardProps) {
  const router = useRouter();
  
  const matchScore = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < job.id.length; i++) {
      hash = job.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return 85 + (Math.abs(hash) % 12);
  }, [job.id]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(`/jobs/${encodeURIComponent(job.id)}`);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => router.push(`/jobs/${encodeURIComponent(job.id)}`)}
      className="group w-full flex items-center justify-between py-5 px-6 border-b border-[#2a2a2a] bg-transparent hover:bg-[#161616] transition-colors cursor-pointer rounded-[16px] mb-1"
    >
      <div className="flex flex-col gap-1.5 min-w-0">
        <h3 className="font-sans text-[15px] font-semibold text-white/90 truncate">
          {job.title}
        </h3>
        <div className="flex items-center gap-2 font-sans text-[13px] text-white/40">
          <span>{job.company}</span>
          <span className="text-white/15">•</span>
          <span>{job.location}</span>
          {job.isRemote && (
            <>
              <span className="text-white/15">•</span>
              <span className="text-[#4a7c59]">Remote</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-8 shrink-0">
        <div className="hidden md:flex flex-col items-end">
          <span className="font-sans text-[11px] text-white/25 mb-0.5">Posted</span>
          <span className="font-sans text-[12px] text-white/60">
            {job.postedAt}
          </span>
        </div>

        <div className="flex flex-col items-end w-16">
          <span className="font-sans text-[11px] text-white/25 mb-0.5">Match</span>
          <span className="font-mono text-[14px] font-bold text-[#e6efdf]">
            {matchScore}%
          </span>
        </div>

        <div className="text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all text-lg">
          →
        </div>
      </div>
    </div>
  );
}
