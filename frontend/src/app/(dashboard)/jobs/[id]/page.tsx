"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Star,
  Sparkles,
  Info,
  Search,
  GraduationCap,
  Hammer,
} from "lucide-react";
import { dashboardStagger, fadeUp } from "@/components/animations/animations";
import type { JobListing } from "@/@types/jobs";
import {
  getAccentForCompany,
  getSourceIcon,
  getTagColor,
  AccentColor,
} from "@/styles/jobColors";
import Button from "@/components/ui/Button";
import { jobAPI } from "@/features/jobs/api/jobAPI";

// --- Components ---

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: AccentColor;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col gap-2 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
      style={{
        backgroundColor: "var(--d-surface)",
        border: "1px solid var(--d-border-subtle)",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mb-1"
        style={{
          backgroundColor: accent ? accent.bg : "var(--d-surface-hover)",
          border: accent ? `1px solid ${accent.border}` : "1px solid var(--d-border-subtle)",
        }}
      >
        <Icon className="w-5 h-5" style={{ color: accent ? accent.dot : "var(--d-icon-hover)" }} />
      </div>
      <div>
        <p
          className="text-[11px] font-bold uppercase tracking-widest mb-0.5"
          style={{ color: "var(--d-text-muted)" }}
        >
          {label}
        </p>
        <p
          className="text-[15px] font-semibold truncate"
          style={{ color: "var(--d-text-primary)" }}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
}

function Tag({ children }: { children: string }) {
  const accent = getTagColor(children);
  return (
    <span
      className="text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-transform hover:scale-105 select-none"
      style={{
        backgroundColor: accent.bg,
        borderColor: accent.border,
        color: accent.dot,
      }}
    >
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent.dot }} />
      {children}
    </span>
  );
}

function HighlightSection({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;

  const getIcon = (t: string) => {
    const l = t.toLowerCase();
    if (l.includes("qualification") || l.includes("requirement")) return <GraduationCap className="w-5 h-5" />;
    if (l.includes("responsibilit")) return <Hammer className="w-5 h-5" />;
    if (l.includes("benefit")) return <Star className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  return (
    <motion.div variants={fadeUp} className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg" style={{ backgroundColor: "var(--d-surface-hover)", border: "1px solid var(--d-border-subtle)" }}>
          {getIcon(title)}
        </div>
        <h3 className="text-[18px] font-bold tracking-tight" style={{ color: "var(--d-text-primary)" }}>
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-4 rounded-xl border transition-colors hover:bg-[var(--d-surface-hover)] group"
            style={{
              backgroundColor: "var(--d-surface)",
              borderColor: "var(--d-border-subtle)",
            }}
          >
            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 group-hover:scale-125 transition-transform" />
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--d-text-secondary)" }}>
              {item}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// --- Utils ---

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

// --- Main Page ---

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [bookmarked, setBookmarked] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const decodedId = decodeURIComponent(id);
    const cached = jobAPI.getCachedJob(decodedId);
    if (cached) {
      setJob(cached);
      setLoading(false);
      return;
    }

    async function fetchAndFind() {
      try {
        const jobs = await jobAPI.get();
        const found = jobs.find((j) => j.id === decodedId) ?? null;
        setJob(found);
      } catch (err) {
        console.error("Failed to fetch job:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAndFind();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-300 mx-auto space-y-6 py-4 px-4 sm:px-6">
        <div className="h-5 w-28 rounded-lg animate-pulse" style={{ backgroundColor: "var(--d-surface-hover)" }} />
        <div className="h-80 w-full rounded-2xl animate-pulse" style={{ backgroundColor: "var(--d-surface-hover)" }} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 space-y-6">
              <div className="h-64 w-full rounded-2xl animate-pulse" style={{ backgroundColor: "var(--d-surface-hover)" }} />
           </div>
           <div className="space-y-6">
              <div className="h-96 w-full rounded-2xl animate-pulse" style={{ backgroundColor: "var(--d-surface-hover)" }} />
           </div>
        </div>
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
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
          <Info className="w-10 h-10 text-red-500" />
        </div>
        <p className="text-[24px] font-bold mb-2" style={{ color: "var(--d-text-primary)" }}>
          Job not found
        </p>
        <p className="text-[15px] mb-8 max-w-sm" style={{ color: "var(--d-text-muted)" }}>
          The job listing you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => router.push("/jobs")}
          icon={<ArrowLeft className="w-4 h-4" />}
          iconPosition="left"
        >
          Back to Listings
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

  const allTags = Array.from(new Set([
    job.employmentType,
    ...(job.isRemote ? ["Remote"] : []),
    ...(job.employmentTypes || []),
    job.country,
  ])).filter(Boolean);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={dashboardStagger(0.05, 0.02)}
      className="max-w-[1200px] mx-auto space-y-8 pb-20 px-4 sm:px-6"
    >
      {/* Navigation & Actions Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/jobs")}
          className="flex items-center gap-2.5 text-[14px] font-bold uppercase tracking-wider group py-2"
          style={{ color: "var(--d-text-tertiary)" }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors group-hover:bg-[var(--d-surface-hover)] border border-transparent group-hover:border-[var(--d-border-subtle)]">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </div>
          Back to Explorers
        </motion.button>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyLink}
            className="px-4 h-10 rounded-xl flex items-center justify-center gap-2 transition-all border font-semibold text-[13px]"
            style={{
              backgroundColor: "var(--d-surface)",
              borderColor: linkCopied ? "var(--accent-emerald-border)" : "var(--d-border-subtle)",
              color: linkCopied ? "var(--accent-emerald-dot)" : "var(--d-text-secondary)",
            }}
          >
            {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {linkCopied ? "Copied!" : "Copy Link"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setBookmarked(!bookmarked)}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all border"
            style={{
              backgroundColor: bookmarked ? "var(--accent-amber-bg)" : "var(--d-surface)",
              borderColor: bookmarked ? "var(--accent-amber-border)" : "var(--d-border-subtle)",
              color: bookmarked ? "var(--accent-amber-dot)" : "var(--d-icon)",
            }}
          >
            {bookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </motion.button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        variants={fadeUp}
        className="relative rounded-[2.5rem] p-8 sm:p-12 overflow-hidden shadow-2xl shadow-black/20"
        style={{
          backgroundColor: "var(--d-surface)",
          border: "1px solid var(--d-border)",
        }}
      >
        {/* Animated Background Gradients */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] blur-[120px] opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${accent.dot}, transparent)` }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] blur-[100px] opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(circle, var(--accent-blue-dot), transparent)` }}
        />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Logo Wrapper */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center shrink-0 overflow-hidden shadow-xl border-4"
              style={{
                backgroundColor: "var(--d-surface-hover)",
                borderColor: accent.bg,
              }}
            >
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover p-2" />
              ) : (
                <Building2 className="w-10 h-10 sm:w-14 h-14" style={{ color: accent.dot }} />
              )}
            </motion.div>

            <div className="flex-1 min-w-0 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border"
                  style={{ backgroundColor: accent.bg, borderColor: accent.border, color: accent.dot }}
                >
                  {job.publisher}
                </span>
                <span className="flex items-center gap-1.5 text-[13px] font-medium opacity-60">
                  <Clock className="w-3.5 h-3.5" />
                  Posted {job.postedAt}
                </span>
              </div>

              <h1 className="text-[32px] sm:text-[44px] font-black tracking-tight leading-[1.1] sm:leading-tight">
                <span className="bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">
                  {job.title}
                </span>
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-[15px] font-semibold">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  {job.location}
                </div>
                {(job.salary || job.minSalary) && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                    {formatSalary(job)}
                  </div>
                )}
                {job.isRemote && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                    <Wifi className="w-4 h-4" />
                    Remote Available
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-2.5">
            {allTags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Description & Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard icon={TrendingUp} label="Salary Range" value={formatSalary(job)} accent={getTagColor("Salary")} />
            <StatCard icon={Briefcase} label="Job Type" value={job.employmentType} accent={getTagColor("Type")} />
            <StatCard icon={Globe} label="Country" value={job.country} accent={getTagColor("Region")} />
            <StatCard icon={Search} label="Source" value={job.publisher} accent={accent} />
          </div>

          {/* Highlights (Responsibilities/Qualifications) */}
          {Object.entries(job.highlights).map(([title, items]) => (
            <HighlightSection key={title} title={title} items={items as string[]} />
          ))}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <motion.div variants={fadeUp} className="space-y-4">
               <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "var(--d-surface-hover)", border: "1px solid var(--d-border-subtle)" }}>
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-[18px] font-bold tracking-tight" style={{ color: "var(--d-text-primary)" }}>
                  Employee Benefits
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {job.benefits.map((benefit, i) => (
                  <span
                    key={i}
                    className="px-4 py-2.5 rounded-xl border flex items-center gap-2 text-[14px] font-medium transition-all hover:translate-y-[-2px] hover:shadow-lg"
                    style={{
                      backgroundColor: "var(--d-surface)",
                      borderColor: "var(--d-border-subtle)",
                      color: "var(--d-text-secondary)",
                    }}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    {benefit}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Full Description */}
          <motion.div
            variants={fadeUp}
            className="rounded-3xl p-8 space-y-6"
            style={{
              backgroundColor: "var(--d-surface)",
              border: "1px solid var(--d-border)",
            }}
          >
            <h2 className="text-[20px] font-bold tracking-tight" style={{ color: "var(--d-text-primary)" }}>
              Detailed Description
            </h2>
            <div
              className="text-[15px] leading-[1.8] whitespace-pre-line space-y-4"
              style={{ color: "var(--d-text-secondary)" }}
            >
              {job.description}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Main Action Card */}
          <motion.div
            variants={fadeUp}
            className="rounded-[2rem] p-8 space-y-6 border-2"
            style={{
              backgroundColor: "var(--d-surface)",
              borderColor: accent.bg,
            }}
          >
            <div className="space-y-2">
              <h3 className="text-[20px] font-bold tracking-tight">Ready to Apply?</h3>
              <p className="text-[14px] opacity-70 leading-relaxed">
                Take the next step in your career with <span className="font-bold text-white">{job.company}</span>.
              </p>
            </div>

            <div className="space-y-3">
              <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="block">
                <Button
                  variant="white"
                  size="lg"
                  className="w-full h-14 text-[16px] font-bold rounded-2xl shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20"
                  icon={<ExternalLink className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Apply Directly
                </Button>
              </a>

              {job.googleLink && (
                <a href={job.googleLink} target="_blank" rel="noopener noreferrer" className="block">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl text-[14px] font-bold border transition-all"
                    style={{
                      backgroundColor: "rgba(66, 133, 244, 0.1)",
                      borderColor: "rgba(66, 133, 244, 0.2)",
                      color: "#4285F4",
                    }}
                  >
                    🔍 View on Google Jobs
                  </motion.button>
                </a>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] opacity-40">
                Other Platforms
              </p>
              <div className="space-y-2.5">
                {job.applyOptions.slice(0, 4).map((opt, i) => (
                  <a
                    key={i}
                    href={opt.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[18px] grayscale group-hover:grayscale-0 transition-all">
                        {getSourceIcon(opt.publisher)}
                      </span>
                      <span className="text-[13px] font-semibold opacity-80 group-hover:opacity-100">
                        {opt.publisher}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Company Profile Card */}
          <motion.div
            variants={fadeUp}
            className="rounded-[2rem] p-8 space-y-6"
            style={{
              backgroundColor: "var(--d-surface)",
              border: "1px solid var(--d-border)",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover p-1.5" />
                ) : (
                  <Building2 className="w-6 h-6 opacity-40" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-[18px] font-bold truncate tracking-tight">{job.company}</h3>
                <p className="text-[13px] opacity-50 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {job.city || job.location}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {job.companyWebsite && (
                <a
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-[13px] font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Visit Website
                </a>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-[13px] font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                <Building2 className="w-3.5 h-3.5" />
                Company Profile
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
