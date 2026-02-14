"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Sparkles, ExternalLink } from "lucide-react";
import type { JobListing } from "@/@types/jobs";
import { getAccentForCompany, getMatchColor } from "@/utils/jobColors";

interface JobCardProps {
  job: JobListing;
}

export default function JobCard({ job }: JobCardProps) {
  const accent = getAccentForCompany(job.company);
  const matchColor = getMatchColor(job.matchScore);

  return (
    <div
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
          {job.postedDate}
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
            {job.source}
          </span>
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-[16px] font-bold"
            style={{
              backgroundColor: "var(--d-surface-hover)",
              border: "1px solid var(--d-border)",
              color: "var(--d-text-tertiary)",
            }}
          >
            {job.companyLogo}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap gap-1.5 mb-4">
        {job.tags.slice(0, 4).map((tag) => (
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

      <div className="relative z-10 mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" style={{ color: matchColor.text }} />
            <span
              className="text-[13px] font-semibold"
              style={{ color: "var(--d-text-secondary)" }}
            >
              {job.matchScore}% Match
            </span>
          </div>
          <span
            className="text-[11px]"
            style={{ color: "var(--d-text-muted)" }}
          >
            AI Score
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--d-surface-hover)" }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${job.matchScore}%` }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full"
            style={{
              backgroundColor: matchColor.border,
            }}
          />
        </div>
      </div>

      <div
        className="relative z-10 rounded-xl p-3.5 mb-4"
        style={{
          backgroundColor: matchColor.bg,
          border: `1px solid ${matchColor.border}`,
        }}
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-wider mb-1"
          style={{ color: "var(--d-text-muted)" }}
        >
          Why you match
        </p>
        <p
          className="text-[12px] leading-relaxed"
          style={{ color: "var(--d-text-tertiary)" }}
        >
          {job.whyYouMatch}
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p
            className="text-[17px] font-semibold tracking-tight"
            style={{ color: "var(--d-text-primary)" }}
          >
            {job.salary}
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
        <Link href={`/jobs/${job.id}`}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{
              type: "tween",
              duration: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
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
