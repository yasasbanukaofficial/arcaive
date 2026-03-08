"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, ExternalLink, Wifi, Building2 } from "lucide-react";
import type { JobListing } from "@/@types/jobs";
import { getAccentForCompany, getSourceIcon } from "@/styles/jobColors";

interface JobCardProps {
  job: JobListing;
}

function formatSalary(job: JobListing): string {
  if (job.salary) return job.salary;
  if (job.minSalary != null && job.maxSalary != null) {
    const period = job.salaryPeriod ? `/${job.salaryPeriod}` : "";
    return `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}${period}`;
  }
  if (job.minSalary != null) return `From $${job.minSalary.toLocaleString()}`;
  if (job.maxSalary != null) return `Up to $${job.maxSalary.toLocaleString()}`;
  return "Salary not specified";
}

export default function JobCard({ job }: JobCardProps) {
  const router = useRouter();
  const accent = getAccentForCompany(job.company);

  const tags = [
    job.employmentType,
    ...(job.isRemote ? ["Remote"] : []),
    ...(job.employmentTypes?.filter((t) => t !== "FULLTIME" && t !== job.employmentType) || []),
  ].filter(Boolean);

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
      className="group relative rounded-2xl p-6 cursor-pointer hover:-translate-y-0.5 transition-[transform,border-color] duration-200 ease-out"
      style={{
        backgroundColor: "var(--d-surface)",
        border: `1px solid var(--d-border)`,
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${accent.bg}, transparent)`,
        }}
      />

      <div className="relative z-10 flex items-center justify-start mb-4">
        <span
          className="text-[12px] font-medium px-3 py-1.5 rounded-lg"
          style={{
            backgroundColor: accent.bg,
            border: `1px solid ${accent.border}`,
            color: accent.dot,
          }}
        >
          {job.postedAt}
        </span>
      </div>

      <div className="relative z-10 flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p
            className="text-[12px] font-medium mb-1"
            style={{ color: "var(--d-text-muted)" }}
          >
            {job.company}
          </p>
          <h3
            className="text-[17px] font-semibold tracking-tight leading-snug"
            style={{ color: "var(--d-text-primary)" }}
          >
            {job.title}
          </h3>
        </div>
        <div className="flex flex-col items-end ml-3 gap-2 shrink-0 -translate-y-1">
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
            style={{
              backgroundColor: "var(--d-surface-hover)",
              color: "var(--d-text-ghost)",
            }}
          >
            {getSourceIcon(job.publisher)} {job.publisher}
          </span>
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden"
            style={{
              backgroundColor: "var(--d-surface-hover)",
              border: "1px solid var(--d-border)",
            }}
          >
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2
                className="w-5 h-5"
                style={{ color: "var(--d-icon)" }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap gap-1.5 mb-4">
        {tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="text-[11px] font-medium px-2.5 py-1 rounded-md"
            style={{
              backgroundColor: "var(--d-surface-hover)",
              border: "1px solid var(--d-border-subtle)",
              color: "var(--d-text-tertiary)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {job.isRemote && (
        <div className="relative z-10 flex items-center gap-1.5 mb-3">
          <Wifi className="w-3.5 h-3.5" style={{ color: "var(--accent-emerald-dot)" }} />
          <span
            className="text-[12px] font-medium"
            style={{ color: "var(--accent-emerald-dot)" }}
          >
            Remote
          </span>
        </div>
      )}

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p
            className="text-[17px] font-semibold tracking-tight"
            style={{ color: "var(--d-text-primary)" }}
          >
            {formatSalary(job)}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin
              className="w-3.5 h-3.5"
              style={{ color: "var(--d-icon)" }}
            />
            <span
              className="text-[12px]"
              style={{ color: "var(--d-text-muted)" }}
            >
              {job.location}
            </span>
          </div>
        </div>
        <Link href={`/jobs/${encodeURIComponent(job.id)}`}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{
              type: "tween",
              duration: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium transition-[background-color,border-color,color] duration-150"
            style={{
              backgroundColor: "var(--d-surface-active)",
              border: "1px solid var(--d-border-hover)",
              color: "var(--d-text-secondary)",
            }}
          >
            Details
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
