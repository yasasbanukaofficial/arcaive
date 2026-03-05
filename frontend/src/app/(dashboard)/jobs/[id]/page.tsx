"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  Calendar,
  Sparkles,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Share2,
  Building2,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Globe,
  Copy,
  Check,
} from "lucide-react";
import { dashboardStagger, fadeUp } from "@/components/animations/animations";
import { getJobById } from "@/features/jobs/constants/mockData";
import {
  getAccentForCompany,
  getMatchColor,
  getSourceIcon,
} from "@/styles/jobColors";
import Button from "@/components/ui/Button";

/* ── Detail info row (unique to this page) ── */
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{
          backgroundColor: "var(--d-surface-hover)",
          border: "1px solid var(--d-border-subtle)",
        }}
      >
        <Icon className="w-4 h-4" style={{ color: "var(--d-icon-hover)" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[11px] font-medium uppercase tracking-wider mb-0.5"
          style={{ color: "var(--d-text-muted)" }}
        >
          {label}
        </p>
        <p
          className="text-[14px] font-medium"
          style={{ color: "var(--d-text-primary)" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [bookmarked, setBookmarked] = useState<boolean | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const job = getJobById(id);

  const isBookmarked =
    bookmarked !== null ? bookmarked : (job?.bookmarked ?? false);

  if (!job) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <p
          className="text-[20px] font-semibold mb-2"
          style={{ color: "var(--d-text-primary)" }}
        >
          Job not found
        </p>
        <p
          className="text-[14px] mb-6"
          style={{ color: "var(--d-text-muted)" }}
        >
          The job listing you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button
          variant="secondary"
          size="md"
          onClick={() => router.push("/jobs")}
          icon={<ArrowLeft className="w-4 h-4" />}
          iconPosition="left"
        >
          Back to Jobs
        </Button>
      </motion.div>
    );
  }

  const accent = getAccentForCompany(job.company);
  const matchColor = getMatchColor(job.matchScore);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={dashboardStagger(0.05, 0.02)}
      className="max-w-300 mx-auto space-y-6"
    >
      {/* ── Back button ── */}
      <motion.div variants={fadeUp}>
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
          transition={{
            type: "tween",
            duration: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          onClick={() => router.push("/jobs")}
          className="flex items-center gap-2 text-[13px] font-medium py-2 group"
          style={{ color: "var(--d-text-tertiary)" }}
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Jobs
        </motion.button>
      </motion.div>

      {/* ── Header card ── */}
      <motion.div
        variants={fadeUp}
        className="relative rounded-2xl p-8 overflow-hidden"
        style={{
          backgroundColor: "var(--d-surface)",
          border: "1px solid var(--d-border)",
        }}
      >
        {/* Accent glow */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at top left, ${accent.bg}, transparent 60%)`,
          }}
        />

        <div className="relative z-10">
          {/* Top row: source + date + actions */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span
                className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg"
                style={{
                  backgroundColor: accent.bg,
                  border: `1px solid ${accent.border}`,
                  color: accent.dot,
                }}
              >
                {getSourceIcon(job.source)} {job.source}
              </span>
              <span
                className="text-[12px] font-medium px-3 py-1.5 rounded-lg"
                style={{
                  backgroundColor: "var(--d-surface-hover)",
                  border: "1px solid var(--d-border-subtle)",
                  color: "var(--d-text-muted)",
                }}
              >
                <Calendar className="w-3 h-3 inline-block mr-1.5 -mt-px" />
                {job.postedDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyLink}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: "var(--d-surface-hover)",
                  border: "1px solid var(--d-border-subtle)",
                  color: linkCopied ? "rgb(52,211,153)" : "var(--d-icon)",
                }}
                title="Copy link"
              >
                {linkCopied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBookmarked(!isBookmarked)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: isBookmarked
                    ? "rgba(245,158,11,0.1)"
                    : "var(--d-surface-hover)",
                  border: isBookmarked
                    ? "1px solid rgba(245,158,11,0.2)"
                    : "1px solid var(--d-border-subtle)",
                  color: isBookmarked ? "rgb(251,191,36)" : "var(--d-icon)",
                }}
                title={isBookmarked ? "Remove bookmark" : "Bookmark"}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Company + Title */}
          <div className="flex items-start gap-5 mb-6">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-[20px] sm:text-[28px] shrink-0"
              style={{
                backgroundColor: "var(--d-surface-hover)",
                border: "1px solid var(--d-border)",
              }}
            >
              {job.companyLogo}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[14px] font-medium mb-1.5"
                style={{ color: "var(--d-text-tertiary)" }}
              >
                {job.company}
              </p>
              <h1
                className="text-[28px] font-semibold tracking-tight leading-tight mb-3"
                style={{ color: "var(--d-text-primary)" }}
              >
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="flex items-center gap-1.5 text-[13px]"
                  style={{ color: "var(--d-text-tertiary)" }}
                >
                  <MapPin
                    className="w-3.5 h-3.5"
                    style={{ color: "var(--d-icon)" }}
                  />
                  {job.location}
                </span>
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: "var(--d-border)" }}
                />
                <span
                  className="flex items-center gap-1.5 text-[13px] font-semibold"
                  style={{ color: "var(--d-text-primary)" }}
                >
                  <DollarSign
                    className="w-3.5 h-3.5"
                    style={{ color: "var(--d-icon)" }}
                  />
                  {job.salary}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="text-[12px] font-medium px-3 py-1.5 rounded-lg"
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
        </div>
      </motion.div>

      {/* ── Content grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Main content ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Match score card */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl p-6 overflow-hidden"
            style={{
              backgroundColor: matchColor.bg,
              border: `1px solid ${matchColor.border}`,
            }}
          >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <Sparkles
                  className="w-5 h-5"
                  style={{ color: matchColor.text }}
                />
                <span
                  className="text-[16px] font-semibold"
                  style={{ color: "var(--d-text-primary)" }}
                >
                  AI Match Score
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[28px] font-bold tracking-tight"
                  style={{ color: matchColor.text }}
                >
                  {job.matchScore}%
                </span>
                <span
                  className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg"
                  style={{
                    backgroundColor: matchColor.bg,
                    border: `1px solid ${matchColor.border}`,
                    color: matchColor.text,
                  }}
                >
                  {matchColor.label}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div
              className="h-2.5 rounded-full overflow-hidden mb-4"
              style={{ backgroundColor: "var(--d-surface-hover)" }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${job.matchScore}%` }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full rounded-full"
                style={{ backgroundColor: matchColor.text }}
              />
            </div>

            {/* Why you match */}
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="w-4 h-4 mt-0.5 shrink-0"
                style={{ color: matchColor.text }}
              />
              <div>
                <p
                  className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  Why you match
                </p>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: "var(--d-text-secondary)" }}
                >
                  {job.whyYouMatch}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "var(--d-surface)",
              border: "1px solid var(--d-border)",
            }}
          >
            <h2
              className="text-[17px] font-semibold tracking-tight mb-4"
              style={{ color: "var(--d-text-primary)" }}
            >
              Job Description
            </h2>
            <p
              className="text-[14px] leading-[1.75] whitespace-pre-line"
              style={{ color: "var(--d-text-secondary)" }}
            >
              {job.description}
            </p>
          </motion.div>

          {/* Apply CTA */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "var(--d-surface)",
              border: "1px solid var(--d-border)",
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3
                  className="text-[16px] font-semibold tracking-tight mb-1"
                  style={{ color: "var(--d-text-primary)" }}
                >
                  Interested in this role?
                </h3>
                <p
                  className="text-[13px]"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  Apply directly through {job.source} or let your AI agent
                  handle it
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="white"
                  size="lg"
                  icon={<ExternalLink className="w-3.5 h-3.5" />}
                  iconPosition="right"
                  className="font-semibold"
                >
                  Apply Now
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  icon={<Share2 className="w-3.5 h-3.5" />}
                  iconPosition="left"
                >
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Right: Sidebar ── */}
        <div className="space-y-6">
          {/* Job details card */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "var(--d-surface)",
              border: "1px solid var(--d-border)",
            }}
          >
            <h2
              className="text-[15px] font-semibold tracking-tight mb-1"
              style={{ color: "var(--d-text-primary)" }}
            >
              Job Details
            </h2>
            <p
              className="text-[12px] mb-4"
              style={{ color: "var(--d-text-muted)" }}
            >
              Overview of this position
            </p>

            <div
              className="space-y-0 divide-y"
              style={{ borderColor: "var(--d-border-subtle)" }}
            >
              <InfoRow icon={DollarSign} label="Salary" value={job.salary} />
              <InfoRow icon={MapPin} label="Location" value={job.location} />
              <InfoRow
                icon={Clock}
                label="Work Schedule"
                value={job.workSchedule}
              />
              <InfoRow
                icon={Briefcase}
                label="Employment Type"
                value={job.employmentType}
              />
              <InfoRow
                icon={TrendingUp}
                label="Experience Level"
                value={job.experienceLevel}
              />
              <InfoRow
                icon={Calendar}
                label="Posted Date"
                value={job.postedDate}
              />
            </div>
          </motion.div>

          {/* Company card */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "var(--d-surface)",
              border: "1px solid var(--d-border)",
            }}
          >
            <h2
              className="text-[15px] font-semibold tracking-tight mb-4"
              style={{ color: "var(--d-text-primary)" }}
            >
              About the Company
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-[24px]"
                style={{
                  backgroundColor: "var(--d-surface-hover)",
                  border: "1px solid var(--d-border)",
                }}
              >
                {job.companyLogo}
              </div>
              <div>
                <p
                  className="text-[16px] font-semibold"
                  style={{ color: "var(--d-text-primary)" }}
                >
                  {job.company}
                </p>
                <p
                  className="text-[12px] flex items-center gap-1.5 mt-0.5"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  <Globe className="w-3 h-3" />
                  {job.location}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors"
              style={{
                backgroundColor: "var(--d-surface-hover)",
                border: "1px solid var(--d-border)",
                color: "var(--d-text-secondary)",
              }}
            >
              <Building2 className="w-3.5 h-3.5" />
              View Company Profile
            </motion.button>
          </motion.div>

          {/* Source badge card */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "var(--d-surface)",
              border: "1px solid var(--d-border)",
            }}
          >
            <h2
              className="text-[15px] font-semibold tracking-tight mb-4"
              style={{ color: "var(--d-text-primary)" }}
            >
              Found Via
            </h2>
            <div
              className="flex items-center gap-3 p-3.5 rounded-xl"
              style={{
                backgroundColor: accent.bg,
                border: `1px solid ${accent.border}`,
              }}
            >
              <span className="text-[20px]">{getSourceIcon(job.source)}</span>
              <div>
                <p
                  className="text-[14px] font-semibold"
                  style={{ color: accent.dot }}
                >
                  {job.source}
                </p>
                <p
                  className="text-[11px]"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  Job aggregator source
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
