"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import type { JobListing } from "@/@types/jobs";
import type { MemberIdentityData, MemberProfileDTO } from "@/@types/member";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
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
  Info,
  Sparkles,
  Search,
  FileSearch,
} from "lucide-react";
import { dashboardStagger, fadeUp } from "@/components/animations/animations";
import {
  getAccentForCompany,
  getSourceIcon,
  getTagColor,
} from "@/styles/jobColors";
import Button from "@/components/ui/Button";
import { jobAPI } from "@/features/jobs/api/jobAPI";
import { memberAPI } from "@/features/settings/api/memberAPI";
import { cvAnalysisAPI } from "@/features/cv-analysis/api/cvAnalysisAPI";
import { TAILORED_CV_DRAFT_KEY } from "@/features/cv-analysis/constants/tailoredDraft";
import JobStatCard from "@/features/jobs/components/JobStatCard";
import JobTag from "@/features/jobs/components/JobTag";
import JobHighlightSection from "@/features/jobs/components/JobHighlightSection";
import formatSalary from "@/features/jobs/utils/formatSalary";
import { useToast } from "@/components/ui/Toast";
import { useQueryClient } from "@tanstack/react-query";
import TailoringProgressModal from "@/features/cv-analysis/components/TailoringProgressModal";

function toMemberProfile(member: MemberIdentityData): MemberProfileDTO {
  if (member.profile) {
    return member.profile;
  }

  return {
    jobRole: member.jobRole,
    experience: member.experience,
    country: member.country,
    location: member.location,
    phone: member.phone,
    summary: member.summary,
    experiences: member.experiences,
    educations: member.educations,
    projects: member.projects,
    skills: member.skills,
    certifications: member.certifications,
    languages: member.languages,
  };
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const [bookmarked, setBookmarked] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTailoring, setIsTailoring] = useState(false);

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
        <div className="h-5 w-28 bg-[var(--glass-bg)]/5" />
        <div className="h-80 w-full bg-[var(--glass-bg)]/5" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 space-y-6">
              <div className="h-64 w-full bg-[var(--glass-bg)]/5" />
           </div>
           <div className="space-y-6">
              <div className="h-96 w-full bg-[var(--glass-bg)]/5" />
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
        <div className="w-20 h-20  bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
          <Info className="w-10 h-10 text-red-500" />
        </div>
        <p className="text-[24px] font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Job not found
        </p>
        <p className="text-[15px] mb-8 max-w-sm" style={{ color: "var(--text-secondary)" }}>
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

  const handleCreateTailoredCV = async () => {
    if (!job || isTailoring) return;

    setIsTailoring(true);
    try {
      const cachedMember = queryClient.getQueryData<MemberIdentityData>(["member", "settings"]);
      const member = cachedMember || ((await memberAPI.get()) as MemberIdentityData);

      const tailoredProfile = await cvAnalysisAPI.tailor({
        jobTitle: job.title,
        jobDescription: job.description,
        profile: toMemberProfile(member),
      });

      sessionStorage.setItem(
        TAILORED_CV_DRAFT_KEY,
        JSON.stringify({
          profile: tailoredProfile,
          jobId: id,
          createdAt: Date.now(),
        }),
      );

      router.push(`/create?source=tailored&jobId=${encodeURIComponent(id)}`);
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;
      addToast({
        type: "error",
        title: "Tailoring failed",
        description: backendMessage || "Could not create a tailored CV draft right now.",
      });
    } finally {
      setIsTailoring(false);
    }
  };

  return (
    <>
      <TailoringProgressModal isOpen={isTailoring} />
      <motion.div
        initial="hidden"
        animate="show"
        variants={dashboardStagger(0.05, 0.02)}
        className="max-w-[1200px] mx-auto space-y-10 pb-20 px-4 sm:px-6"
      >
        {/* Navigation Header */}
        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/jobs")}
            className="flex items-center gap-3 text-[13px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--d-surface)] border border-[var(--glass-border)] flex items-center justify-center">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Listings
          </motion.button>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className="w-10 h-10 rounded-full bg-[var(--d-surface)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            >
              {linkCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setBookmarked(!bookmarked)}
              className="w-10 h-10 rounded-full bg-[var(--d-surface)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            >
              {bookmarked ? <BookmarkCheck className="w-5 h-5 text-amber-500" /> : <Bookmark className="w-5 h-5" />}
            </motion.button>
          </div>
        </motion.div>

        {/* Hero Section - Futuristic SaaS Aesthetic */}
        <motion.div
          variants={fadeUp}
          className="relative p-10 sm:p-12 bg-[var(--d-surface)] border border-[var(--glass-border)] rounded-[32px] overflow-hidden shadow-2xl"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--accent-brand)]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
            <div
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-[24px] flex items-center justify-center shrink-0 border border-[var(--glass-border)] bg-[var(--bg-color)] shadow-xl"
            >
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover p-4" />
              ) : (
                <Building2 className="w-12 h-12 opacity-30" />
              )}
            </div>

            <div className="flex-1 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border"
                  style={{ backgroundColor: accent.bg, borderColor: accent.border, color: accent.dot }}
                >
                  {job.publisher}
                </span>
                <span className="text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  {job.postedAt}
                </span>
              </div>

              <h1 className="text-[36px] sm:text-[52px] font-bold tracking-tight text-[var(--text-primary)] leading-[1.05]">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-[13px] font-bold text-[var(--text-secondary)]">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--glass-border)] bg-[var(--bg-color)]/50">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-brand)]" />
                  {job.location}
                </div>
                {job.isRemote && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--glass-border)] bg-[var(--bg-color)]/50">
                    <Wifi className="w-3.5 h-3.5 text-[var(--accent-brand)]" />
                    Remote
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <JobStatCard icon={TrendingUp} label="Salary" value={formatSalary(job)} accent={getTagColor("Salary")} />
              <JobStatCard icon={Briefcase} label="Type" value={job.employmentType} accent={getTagColor("Type")} />
              <JobStatCard icon={Globe} label="Country" value={job.country} accent={getTagColor("Region")} />
              <JobStatCard icon={Search} label="Source" value={job.publisher} accent={accent} />
            </div>

            {/* Description Card */}
            <motion.div variants={fadeUp} className="p-8 sm:p-10 bg-[var(--d-surface)] border border-[var(--glass-border)] rounded-[32px]">
              <h2 className="text-[20px] font-bold text-[var(--text-primary)] mb-8">Detailed Description</h2>
              <div className="text-[15px] text-[var(--text-secondary)] leading-[1.8] whitespace-pre-line space-y-4">
                {job.description}
              </div>
            </motion.div>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <motion.div variants={fadeUp} className="p-8 bg-[var(--d-surface)] border border-[var(--glass-border)] rounded-[32px] shadow-xl">
              <h3 className="text-[18px] font-bold text-[var(--text-primary)] mb-6">Actions</h3>
              <div className="space-y-4">
                <Button variant="primary" size="lg" className="w-full h-14 font-bold text-[14px]" onClick={() => window.open(job.applyLink, "_blank")}>
                  Apply Directly
                </Button>
                <Button variant="secondary" size="lg" className="w-full h-14 font-bold text-[14px]" onClick={() => router.push(`/interview?jobId=${id}`)}>
                  Simulate Interview
                </Button>
                <Button variant="secondary" size="lg" className="w-full h-14 font-bold text-[14px]" onClick={() => router.push(`/cv-analysis?jobId=${encodeURIComponent(id)}`)}>
                  Analyze CV
                </Button>
                <Button variant="secondary" size="lg" className="w-full h-14 font-bold text-[14px]" onClick={handleCreateTailoredCV} loading={isTailoring}>
                  Create Tailored CV
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
