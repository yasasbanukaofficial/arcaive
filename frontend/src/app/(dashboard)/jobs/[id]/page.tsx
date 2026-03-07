"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  Calendar,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Share2,
  Building2,
  DollarSign,
  Globe,
  Copy,
  Check,
  Wifi,
  Loader2,
} from "lucide-react";
import { dashboardStagger, fadeUp } from "@/components/animations/animations";
import type { JobListing } from "@/@types/jobs";
import {
  getAccentForCompany,
  getSourceIcon,
} from "@/styles/jobColors";
import Button from "@/components/ui/Button";

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

function formatSalary(job: JobListing): string {
  if (job.salary) return job.salary;
  if (job.minSalary != null && job.maxSalary != null) {
    const period = job.salaryPeriod ? `/${job.salaryPeriod}` : "";
    return `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}${period}`;
  }
  if (job.minSalary != null) return `From $${job.minSalary.toLocaleString()}`;
  if (job.maxSalary != null) return `Up to $${job.maxSalary.toLocaleString()}`;
  return "Not specified";
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [bookmarked, setBookmarked] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await fetch("/api/jobs");
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const found = result.data.find((j: JobListing) => j.id === id);
          setJob(found || null);
        }
      } catch (err) {
        console.error("Failed to fetch job:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: "var(--d-text-muted)" }}
        />
      </div>
    );
  }

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const tags = [
    job.employmentType,
    ...(job.isRemote ? ["Remote"] : []),
    ...(job.employmentTypes?.filter((t) => t !== "FULLTIME" && t !== job.employmentType) || []),
  ].filter(Boolean);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={dashboardStagger(0.05, 0.02)}
      className="max-w-300 mx-auto space-y-6"
    >
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

      <motion.div
        variants={fadeUp}
        className="relative rounded-2xl p-8 overflow-hidden"
        style={{
          backgroundColor: "var(--d-surface)",
          border: "1px solid var(--d-border)",
        }}
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at top left, ${accent.bg}, transparent 60%)`,
          }}
        />

        <div className="relative z-10">
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
                {getSourceIcon(job.publisher)} {job.publisher}
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
                {job.postedAt}
              </span>
              {job.isRemote && (
                <span
                  className="text-[12px] font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                  style={{
                    backgroundColor: "var(--d-surface-hover)",
                    border: "1px solid var(--d-border-subtle)",
                    color: "var(--accent-emerald-dot)",
                  }}
                >
                  <Wifi className="w-3 h-3" />
                  Remote
                </span>
              )}
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
                onClick={() => setBookmarked(!bookmarked)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: bookmarked
                    ? "rgba(245,158,11,0.1)"
                    : "var(--d-surface-hover)",
                  border: bookmarked
                    ? "1px solid rgba(245,158,11,0.2)"
                    : "1px solid var(--d-border-subtle)",
                  color: bookmarked ? "rgb(251,191,36)" : "var(--d-icon)",
                }}
                title={bookmarked ? "Remove bookmark" : "Bookmark"}
              >
                {bookmarked ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </div>

          <div className="flex items-start gap-5 mb-6">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden"
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
                  className="w-6 h-6 sm:w-8 sm:h-8"
                  style={{ color: "var(--d-icon)" }}
                />
              )}
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
                {(job.salary || job.minSalary || job.maxSalary) && (
                  <>
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
                      {formatSalary(job)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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

          {job.applyOptions && job.applyOptions.length > 0 && (
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
                Apply Options
              </h2>
              <div className="space-y-3">
                {job.applyOptions
                  .filter((opt, i, arr) =>
                    arr.findIndex((o) => o.applyLink === opt.applyLink) === i
                  )
                  .slice(0, 5)
                  .map((opt, i) => (
                    <a
                      key={i}
                      href={opt.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl transition-colors duration-150 hover:opacity-90 group"
                      style={{
                        backgroundColor: "var(--d-surface-hover)",
                        border: "1px solid var(--d-border-subtle)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[16px]">
                          {getSourceIcon(opt.publisher)}
                        </span>
                        <span
                          className="text-[13px] font-medium"
                          style={{ color: "var(--d-text-secondary)" }}
                        >
                          {opt.publisher}
                        </span>
                        {opt.isDirect && (
                          <span
                            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: "var(--accent-emerald-bg)",
                              color: "var(--accent-emerald-dot)",
                              border: "1px solid var(--accent-emerald-border)",
                            }}
                          >
                            Direct
                          </span>
                        )}
                      </div>
                      <ExternalLink
                        className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                        style={{ color: "var(--d-icon)" }}
                      />
                    </a>
                  ))}
              </div>
            </motion.div>
          )}

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
                  Apply directly through {job.publisher}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={job.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="white"
                    size="lg"
                    icon={<ExternalLink className="w-3.5 h-3.5" />}
                    iconPosition="right"
                    className="font-semibold"
                  >
                    Apply Now
                  </Button>
                </a>
                <Button
                  variant="secondary"
                  size="lg"
                  icon={<Share2 className="w-3.5 h-3.5" />}
                  iconPosition="left"
                  onClick={handleCopyLink}
                >
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
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
              <InfoRow icon={DollarSign} label="Salary" value={formatSalary(job)} />
              <InfoRow icon={MapPin} label="Location" value={job.location} />
              <InfoRow
                icon={Briefcase}
                label="Employment Type"
                value={job.employmentType}
              />
              <InfoRow
                icon={Wifi}
                label="Work Mode"
                value={job.isRemote ? "Remote" : "On-site"}
              />
              <InfoRow
                icon={Globe}
                label="Country"
                value={job.country}
              />
              <InfoRow
                icon={Calendar}
                label="Posted"
                value={job.postedAt}
              />
            </div>
          </motion.div>

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
                className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden"
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
                    className="w-6 h-6"
                    style={{ color: "var(--d-icon)" }}
                  />
                )}
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
            {job.companyWebsite && (
              <a
                href={job.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
              >
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
                  <Globe className="w-3.5 h-3.5" />
                  Visit Website
                </motion.button>
              </a>
            )}
            {!job.companyWebsite && (
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
            )}
          </motion.div>

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
              <span className="text-[20px]">{getSourceIcon(job.publisher)}</span>
              <div>
                <p
                  className="text-[14px] font-semibold"
                  style={{ color: accent.dot }}
                >
                  {job.publisher}
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
