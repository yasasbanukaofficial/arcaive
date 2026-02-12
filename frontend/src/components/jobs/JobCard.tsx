"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bookmark, MapPin, Sparkles, ExternalLink } from "lucide-react";
import type { JobListing } from "@/@types/jobs";

const ACCENT_COLORS = [
  {
    bg: "rgba(59,130,246,0.06)",
    border: "rgba(59,130,246,0.12)",
    dot: "rgba(59,130,246,0.7)",
  },
  {
    bg: "rgba(16,185,129,0.06)",
    border: "rgba(16,185,129,0.12)",
    dot: "rgba(16,185,129,0.7)",
  },
  {
    bg: "rgba(139,92,246,0.06)",
    border: "rgba(139,92,246,0.12)",
    dot: "rgba(139,92,246,0.7)",
  },
  {
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.12)",
    dot: "rgba(245,158,11,0.7)",
  },
  {
    bg: "rgba(236,72,153,0.06)",
    border: "rgba(236,72,153,0.12)",
    dot: "rgba(236,72,153,0.7)",
  },
  {
    bg: "rgba(20,184,166,0.06)",
    border: "rgba(20,184,166,0.12)",
    dot: "rgba(20,184,166,0.7)",
  },
];

function hashStringToIndex(str: string, max: number) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % max;
}

function getMatchColor(score: number) {
  if (score >= 85)
    return {
      text: "text-emerald-400",
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.2)",
    };
  if (score >= 70)
    return {
      text: "text-blue-400",
      bg: "rgba(59,130,246,0.1)",
      border: "rgba(59,130,246,0.2)",
    };
  if (score >= 50)
    return {
      text: "text-amber-400",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.2)",
    };
  return {
    text: "text-zinc-400",
    bg: "rgba(161,161,170,0.1)",
    border: "rgba(161,161,170,0.2)",
  };
}

interface JobCardProps {
  job: JobListing;
}

export default function JobCard({ job }: JobCardProps) {
  const accent =
    ACCENT_COLORS[hashStringToIndex(job.company, ACCENT_COLORS.length)];
  const matchColor = getMatchColor(job.matchScore);

  return (
    <div
      className="group relative rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--d-surface)",
        border: `1px solid var(--d-border)`,
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${accent.bg}, transparent)`,
        }}
      />

      <div className="relative z-10 flex items-center justify-between mb-4">
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
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
          style={{
            backgroundColor: job.bookmarked
              ? "var(--d-surface-active)"
              : "transparent",
            color: job.bookmarked ? "var(--d-text-primary)" : "var(--d-icon)",
          }}
        >
          <Bookmark
            className="w-4 h-4"
            fill={job.bookmarked ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="relative z-10 flex items-start justify-between mb-3">
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
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ml-3 text-[16px] font-bold"
          style={{
            backgroundColor: "var(--d-surface-hover)",
            border: "1px solid var(--d-border)",
            color: "var(--d-text-tertiary)",
          }}
        >
          {job.companyLogo}
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
            <Sparkles
              className="w-3 h-3"
              style={{
                color: matchColor.text.replace("text-", "").includes("emerald")
                  ? "rgb(52,211,153)"
                  : matchColor.text.includes("blue")
                    ? "rgb(96,165,250)"
                    : matchColor.text.includes("amber")
                      ? "rgb(251,191,36)"
                      : "rgb(161,161,170)",
              }}
            />
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
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
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
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200"
          style={{
            backgroundColor: "var(--d-surface-active)",
            border: "1px solid var(--d-border-hover)",
            color: "var(--d-text-secondary)",
          }}
        >
          Details
          <ExternalLink className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      <div className="absolute top-5 right-14 z-10">
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
          style={{
            backgroundColor: "var(--d-surface-hover)",
            color: "var(--d-text-ghost)",
          }}
        >
          {job.source}
        </span>
      </div>
    </div>
  );
}
