"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  ArrowUpRight,
  Wifi,
  Building2,
  DollarSign,
  Globe,
  Sparkles,
  Heart,
  ExternalLink,
  Layers,
  FileText,
  Flag,
  CalendarDays,
} from "lucide-react";
import type { JobListing } from "@/@types/jobs";
import {
  getAccentForCompany,
  getSourceIcon,
  getColorByIndex,
  ACCENT_COLORS,
  hashStringToIndex,
} from "@/styles/jobColors";

/* ───────── helpers ───────── */

interface JobCardProps {
  job: JobListing;
}

function formatSalary(job: JobListing): string | null {
  if (job.salary) return job.salary;
  if (job.minSalary != null && job.maxSalary != null) {
    const p = job.salaryPeriod ? `/${job.salaryPeriod}` : "";
    return `$${job.minSalary.toLocaleString()} – $${job.maxSalary.toLocaleString()}${p}`;
  }
  if (job.minSalary != null) return `From $${job.minSalary.toLocaleString()}`;
  if (job.maxSalary != null) return `Up to $${job.maxSalary.toLocaleString()}`;
  return null;
}

const TYPE_LABELS: Record<string, string> = {
  FULLTIME: "Full-time",
  PARTTIME: "Part-time",
  CONTRACTOR: "Contract",
  INTERN: "Internship",
};
const fmtType = (t: string) => TYPE_LABELS[t] || t;

function secondAccent(company: string) {
  const i = hashStringToIndex(company, ACCENT_COLORS.length);
  return ACCENT_COLORS[(i + 3) % ACCENT_COLORS.length];
}

/** Strip HTML and trim to plain text snippet */
function descriptionSnippet(raw: string, maxLen = 120): string {
  const plain = raw.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).replace(/\s\S*$/, "") + "…";
}

/** Format ISO date to readable string */
function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/* ───────── component ───────── */

export default function JobCard({ job }: JobCardProps) {
  const router = useRouter();
  
  // Pseudo match % for visual design consistency
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
      className="group w-full flex items-center justify-between py-6 px-6 border-b border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors cursor-pointer"
    >
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="font-sans text-[16px] font-bold text-[var(--text-primary)] uppercase truncate">
          {job.title}
        </h3>
        <div className="flex items-center gap-3 font-sans text-[14px] text-[var(--text-secondary)]">
          <span className="uppercase">{job.company}</span>
          <span>—</span>
          <span>{job.location}</span>
        </div>
      </div>

      <div className="flex items-center gap-12 shrink-0">
        <div className="hidden md:flex flex-col items-end">
          <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1">POSTED</span>
          <span className="font-mono text-[12px] text-[var(--text-primary)]">
            {job.postedAt.toUpperCase()}
          </span>
        </div>

        <div className="flex flex-col items-end w-24">
          <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1">MATCH</span>
          <span className="font-mono text-[14px] font-bold text-[var(--text-primary)]">
            {matchScore}%
          </span>
        </div>

        <div className="text-[var(--text-primary)] group-hover:translate-x-1 transition-transform">
          →
        </div>
      </div>
    </div>
  );
}
