"use client";

import React from "react";
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
  const accent = getAccentForCompany(job.company);
  const accent2 = secondAccent(job.company);
  const salary = formatSalary(job);
  const snippet = job.description ? descriptionSnippet(job.description) : null;

  // Unique tags
  const tags = [
    ...new Set([
      fmtType(job.employmentType),
      ...(job.employmentTypes || [])
        .filter((t) => t !== job.employmentType)
        .map(fmtType),
    ]),
  ].filter(Boolean);

  // All highlight categories — show up to 2 categories, 2 items each
  const hlEntries = Object.entries(job.highlights || {})
    .filter(([, items]) => items.length > 0)
    .slice(0, 2);

  // Benefits — up to 4
  const benefits = (job.benefits || []).slice(0, 4);

  // Location string
  const loc =
    job.city && job.state
      ? `${job.city}, ${job.state}`
      : job.location;

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
      className="group relative rounded-2xl cursor-pointer h-full flex flex-col overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1"
      style={{
        backgroundColor: "var(--d-surface)",
        border: "1px solid var(--d-border)",
      }}
    >
      {/* ─── Ambient glow (hover) ─── */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 10% 10%, ${accent.bg} 0%, transparent 45%),
            radial-gradient(circle at 90% 90%, ${accent2.bg} 0%, transparent 45%)
          `,
        }}
      />

      {/* ─── Top accent bar ─── */}
      <div
        className="h-1 w-full shrink-0 rounded-t-2xl"
        style={{ background: "rgba(255, 255, 255, 0.8)" }}
      />

      {/* ════════════ HEADER ════════════ */}
      <div className="relative z-10 px-5 pt-4 pb-0 flex items-start gap-3">
        {/* Logo */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${accent.bg}, ${accent2.bg})`,
            border: `1px solid ${accent.border}`,
          }}
        >
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-full h-full object-cover"
            />
          ) : (
            <Building2 className="w-5 h-5" style={{ color: accent.dot }} />
          )}
        </div>

        {/* Company info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p
              className="text-[13px] font-semibold truncate"
              style={{ color: "var(--d-text-primary)" }}
            >
              {job.company}
            </p>
            {job.companyWebsite && (
              <a
                href={job.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 opacity-30 hover:opacity-80 transition-opacity"
                title="Company website"
              >
                <Globe
                  className="w-3 h-3"
                  style={{ color: "var(--d-icon-hover)" }}
                />
              </a>
            )}
          </div>
          {/* Source • Date • Country */}
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span
              className="text-[10px] font-medium"
              style={{ color: "var(--d-text-muted)" }}
            >
              {getSourceIcon(job.publisher)} {job.publisher}
            </span>
            <span className="text-[8px]" style={{ color: "var(--d-text-ghost)" }}>•</span>
            <span
              className="text-[10px]"
              style={{ color: "var(--d-text-muted)" }}
              title={job.postedAtDatetime ? fmtDate(job.postedAtDatetime) : undefined}
            >
              {job.postedAt}
            </span>
            {job.country && (
              <>
                <span className="text-[8px]" style={{ color: "var(--d-text-ghost)" }}>•</span>
                <span
                  className="text-[10px]"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  {job.country}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Remote badge */}
        {job.isRemote && (
          <span
            className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg shrink-0"
            style={{
              backgroundColor: "var(--accent-emerald-bg)",
              border: "1px solid var(--accent-emerald-border)",
              color: "var(--accent-emerald-dot)",
              boxShadow: "0 0 12px var(--accent-emerald-bg)",
            }}
          >
            <Wifi className="w-2.5 h-2.5" />
            Remote
          </span>
        )}
      </div>

      {/* ════════════ BODY ════════════ */}
      <div className="relative z-10 flex-1 flex flex-col px-5 pt-3 pb-4">
        {/* Title */}
        <h3
          className="text-[16px] font-semibold tracking-tight leading-snug mb-2"
          style={{ color: "var(--d-text-primary)" }}
        >
          {job.title}
        </h3>

        {/* Location */}
        <div className="flex items-start gap-2 mb-2.5">
          <MapPin
            className="w-3.5 h-3.5 shrink-0 mt-0.5"
            style={{ color: accent.dot }}
          />
          <span
            className="text-[12px] leading-relaxed"
            style={{ color: "var(--d-text-tertiary)" }}
          >
            {loc}
          </span>
        </div>

        {/* ── Description preview ── */}
        {snippet && (
          <div className="flex items-start gap-2 mb-3">
            <FileText
              className="w-3 h-3 shrink-0 mt-0.5"
              style={{ color: "var(--d-icon)" }}
            />
            <p
              className="text-[11px] leading-relaxed line-clamp-2"
              style={{ color: "var(--d-text-muted)" }}
            >
              {snippet}
            </p>
          </div>
        )}

        {/* ── Tags — colorful pills ── */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag, i) => {
            const c = getColorByIndex(i);
            return (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-lg"
                style={{
                  backgroundColor: c.bg,
                  border: `1px solid ${c.border}`,
                  color: c.dot,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: c.dot }}
                />
                {tag}
              </span>
            );
          })}
        </div>

        {/* ── Salary chip ── */}
        {salary && (
          <div
            className="inline-flex items-center gap-2 self-start mb-3 px-3 py-1.5 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${accent.bg}, ${accent2.bg})`,
              border: `1px solid ${accent.border}`,
            }}
          >
            <DollarSign className="w-3.5 h-3.5" style={{ color: accent.dot }} />
            <span
              className="text-[13px] font-semibold tracking-tight"
              style={{ color: "var(--d-text-primary)" }}
            >
              {salary}
            </span>
          </div>
        )}

        {/* ── Highlights (all categories) ── */}
        {hlEntries.length > 0 && (
          <div className="space-y-2.5 mb-3">
            {hlEntries.map(([category, items], catIdx) => {
              const catColor = getColorByIndex(catIdx + 1);
              return (
                <div key={category}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles
                      className="w-3 h-3"
                      style={{ color: catColor.dot }}
                    />
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest"
                      style={{ color: catColor.dot }}
                    >
                      {category}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {items.slice(0, 2).map((item, idx) => {
                      const ic = getColorByIndex(catIdx * 2 + idx + 3);
                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-[11px] leading-relaxed"
                          style={{ color: "var(--d-text-tertiary)" }}
                        >
                          <span
                            className="w-1 h-1 rounded-full shrink-0 mt-1.5"
                            style={{ backgroundColor: ic.dot }}
                          />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Benefits ── */}
        {benefits.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {benefits.map((b, i) => {
              const bc = getColorByIndex(i + 4);
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: bc.bg,
                    border: `1px solid ${bc.border}`,
                    color: bc.dot,
                  }}
                >
                  <Heart className="w-2.5 h-2.5" />
                  {b}
                </span>
              );
            })}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* ════════════ FOOTER ════════════ */}
        <div
          className="flex items-center justify-between gap-3 pt-3 mt-auto"
          style={{ borderTop: "1px solid var(--d-border-subtle)" }}
        >
          {/* Left: apply info + exact date */}
          <div className="flex items-center gap-3 min-w-0 flex-wrap">
            {job.applyOptions && job.applyOptions.length > 1 ? (
              <div className="flex items-center gap-1.5">
                <Layers
                  className="w-3 h-3 shrink-0"
                  style={{ color: "var(--d-icon)" }}
                />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  {job.applyOptions.length} apply sources
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <ExternalLink
                  className="w-3 h-3 shrink-0"
                  style={{ color: "var(--d-icon)" }}
                />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  {job.applyIsDirect ? "Direct apply" : "Apply"}
                </span>
              </div>
            )}
            {job.postedAtDatetime && (
              <div className="flex items-center gap-1">
                <CalendarDays
                  className="w-2.5 h-2.5 shrink-0"
                  style={{ color: "var(--d-icon)" }}
                />
                <span
                  className="text-[9px]"
                  style={{ color: "var(--d-text-ghost)" }}
                >
                  {fmtDate(job.postedAtDatetime)}
                </span>
              </div>
            )}
          </div>

          {/* CTA */}
          <Link
            href={`/jobs/${encodeURIComponent(job.id)}`}
            className="shrink-0"
          >
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              transition={{
                type: "tween",
                duration: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 pl-4 pr-3 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200"
              style={{
                background: `linear-gradient(135deg, ${accent.bg}, ${accent2.bg})`,
                border: `1px solid ${accent.border}`,
                color: accent.dot,
              }}
            >
              View
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}
