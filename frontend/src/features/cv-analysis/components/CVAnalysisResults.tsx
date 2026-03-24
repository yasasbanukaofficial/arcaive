"use client";

import React, { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Target, 
  Zap, 
  Trophy, 
  Flag, 
  MessageCircle,
  FileText,
  ChevronRight,
  Maximize2,
  TrendingUp,
  Brain,
  ShieldAlert,
  HelpCircle,
  Download,
  ExternalLink,
  ChevronDown,
  Info
} from "lucide-react";
import { CvAnalysisResponseDTO } from "../api/cvAnalysisAPI";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface CVAnalysisResultsProps {
  data: CvAnalysisResponseDTO;
  file: File;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function CVAnalysisResults({ data, file }: CVAnalysisResultsProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"skills" | "flags" | "probes">("skills");

  useEffect(() => {
    if (file && file instanceof File) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const displayScore = useMemo(() => {
    const score = data?.overallMatchScore ?? 0;
    return Math.round(score <= 1 ? score * 100 : score);
  }, [data?.overallMatchScore]);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10b981"; // emerald-500
    if (score >= 60) return "#3b82f6"; // blue-500
    if (score >= 40) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };

  const getSeniorityBadge = (fit: string) => {
    const f = fit?.toUpperCase() || "";
    if (f.includes("IDEAL") || f.includes("MATCH")) return { variant: "green" as const, icon: <CheckCircle2 size={12} /> };
    if (f.includes("OVER")) return { variant: "purple" as const, icon: <TrendingUp size={12} /> };
    if (f.includes("UNDER")) return { variant: "red" as const, icon: <AlertTriangle size={12} /> };
    return { variant: "blue" as const, icon: <Info size={12} /> };
  };

  const seniority = getSeniorityBadge(data.seniorityFit);

  if (!data) return (
    <div className="flex flex-col items-center justify-center py-20 opacity-50">
      <Brain className="w-12 h-12 mb-4 animate-pulse" />
      <p className="font-medium">Synthesizing analysis results...</p>
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-20"
    >
      {/* Hero Section - Executive Summary */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[var(--d-border)] bg-[var(--d-surface)] p-8 md:p-12">
          {/* Animated Background Accents */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] blur-[120px] opacity-[0.08] pointer-events-none"
               style={{ background: `radial-gradient(circle, ${getScoreColor(displayScore)}, transparent)` }} />
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
            {/* Score Ring */}
            <div className="relative shrink-0">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96" cy="96" r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-[var(--d-border-subtle)]"
                />
                <motion.circle
                  cx="96" cy="96" r="88"
                  stroke={getScoreColor(displayScore)}
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={552.92}
                  initial={{ strokeDashoffset: 552.92 }}
                  animate={{ strokeDashoffset: 552.92 - (552.92 * displayScore) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black tracking-tighter" style={{ color: getScoreColor(displayScore) }}>
                  {displayScore}%
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest opacity-40">Match Score</span>
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Badge variant="blue" className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                  AI Verdict
                </Badge>
                <Badge variant={seniority.variant} icon={seniority.icon} className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                  {data.seniorityFit?.replace(/_/g, " ")}
                </Badge>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  {data.targetJobTitle}
                </h2>
                <p className="text-lg md:text-xl font-medium leading-relaxed opacity-70 max-w-3xl">
                  {data.semanticVerdict}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-2">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-widest opacity-40 mb-1">Technical Fit</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-[var(--d-border-subtle)] overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, data.skillGap?.technicalAlignmentScore * 100 || 0)}%` }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="h-full bg-blue-500"
                      />
                    </div>
                    <span className="text-sm font-bold">{Math.round(data.skillGap?.technicalAlignmentScore * 100 || 0)}%</span>
                  </div>
                </div>
                
                <div className="h-10 w-[1px] bg-[var(--d-border-subtle)] hidden sm:block" />

                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-widest opacity-40 mb-1">Red Flags</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${data.redFlags?.length > 0 ? "text-red-500" : "text-emerald-500"}`}>
                      {data.redFlags?.length || 0} Identified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column - Detailed Breakdown */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Skill Matrix */}
          <motion.div variants={itemVariants}>
            <Card 
              title="Skill Alignment Matrix" 
              icon={<Brain className="text-blue-500" />}
              description="Deep analysis of your technical arsenal against the job requirements."
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Matched */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[var(--d-border-subtle)]">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-[13px] font-bold uppercase tracking-wider opacity-60">Matched</span>
                    <span className="ml-auto text-[11px] font-black bg-emerald-500/10 text-emerald-500 px-1.5 rounded">
                      {data.skillGap?.matchedSkills?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.skillGap?.matchedSkills?.map((skill, i) => (
                      <Badge key={i} variant="green" className="rounded-lg">{skill}</Badge>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[var(--d-border-subtle)]">
                    <XCircle size={16} className="text-red-500" />
                    <span className="text-[13px] font-bold uppercase tracking-wider opacity-60">Missing</span>
                    <span className="ml-auto text-[11px] font-black bg-red-500/10 text-red-500 px-1.5 rounded">
                      {data.skillGap?.missingEssentials?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.skillGap?.missingEssentials?.map((skill, i) => (
                      <Badge key={i} variant="red" className="rounded-lg">{skill}</Badge>
                    ))}
                    {(!data.skillGap?.missingEssentials || data.skillGap.missingEssentials.length === 0) && (
                      <p className="text-[12px] opacity-40 italic">No critical gaps found.</p>
                    )}
                  </div>
                </div>

                {/* Bonus */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[var(--d-border-subtle)]">
                    <Zap size={16} className="text-amber-500" />
                    <span className="text-[13px] font-bold uppercase tracking-wider opacity-60">Bonus</span>
                    <span className="ml-auto text-[11px] font-black bg-amber-500/10 text-amber-500 px-1.5 rounded">
                      {data.skillGap?.bonusSkills?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.skillGap?.bonusSkills?.map((skill, i) => (
                      <Badge key={i} variant="yellow" className="rounded-lg">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Red Flags */}
            <motion.div variants={itemVariants}>
              <Card 
                title="Critical Red Flags" 
                icon={<ShieldAlert className="text-red-500" />}
                className="h-full"
              >
                <div className="space-y-3">
                  {data.redFlags?.length > 0 ? (
                    data.redFlags.map((flag, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ x: 4 }}
                        className="flex gap-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 group transition-colors hover:bg-red-500/10"
                      >
                        <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                        <p className="text-[14px] font-medium leading-relaxed opacity-90">{flag}</p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center opacity-40">
                      <CheckCircle2 size={32} className="mb-2 text-emerald-500" />
                      <p className="text-sm">No red flags detected. Your profile looks clean.</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Interview Probes */}
            <motion.div variants={itemVariants}>
              <Card 
                title="Interview Probes" 
                icon={<HelpCircle className="text-purple-500" />}
                className="h-full"
              >
                <div className="space-y-4">
                  {data.interviewProbes?.map((probe, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ x: 4 }}
                      className="group flex gap-4 p-4 rounded-2xl bg-[var(--d-surface-active)] border border-[var(--d-border-subtle)] transition-all hover:bg-[var(--d-surface-hover)]"
                    >
                      <div className="mt-1">
                        <MessageCircle size={18} className="text-purple-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-[14px] font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                        "{probe}"
                      </p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Source Preview */}
        <div className="xl:col-span-4">
          <motion.div variants={itemVariants} className="xl:sticky xl:top-24 space-y-6">
            <div className="rounded-[2.5rem] overflow-hidden border border-[var(--d-border)] bg-[var(--d-surface)] shadow-2xl">
              <div className="p-6 border-b border-[var(--d-border-subtle)] bg-[var(--d-surface-active)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-black truncate">{file?.name}</p>
                    <p className="text-[11px] opacity-40 font-bold uppercase tracking-wider">
                      {(file?.size / 1024 / 1024).toFixed(2)} MB • PDF
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.open(pdfUrl || "", "_blank")}
                    className="p-2 rounded-lg hover:bg-[var(--d-surface-hover)] transition-colors text-[var(--d-text-muted)] hover:text-[var(--d-text-primary)]"
                    title="Open full view"
                  >
                    <Maximize2 size={18} />
                  </button>
                  <a 
                    href={pdfUrl || ""} 
                    download={file?.name}
                    className="p-2 rounded-lg hover:bg-[var(--d-surface-hover)] transition-colors text-[var(--d-text-muted)] hover:text-[var(--d-text-primary)]"
                    title="Download document"
                  >
                    <Download size={18} />
                  </a>
                </div>
              </div>

              <div className="aspect-[1/1.4] w-full bg-[var(--d-bg)] relative overflow-hidden group">
                {pdfUrl ? (
                  <iframe 
                    src={pdfUrl + "#toolbar=0&navpanes=0&scrollbar=0"} 
                    className="w-full h-full border-none grayscale-[0.5] opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                    title="CV Preview"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center">
                    <FileText size={48} className="opacity-10 mb-4" />
                    <p className="text-[14px] opacity-50">Document preview unavailable</p>
                  </div>
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[var(--d-surface)]/20 to-transparent" />
              </div>
            </div>

            <Button 
              variant="secondary" 
              fullWidth 
              size="lg"
              className="rounded-2xl h-14 border-dashed border-2 opacity-60 hover:opacity-100"
              onClick={() => window.location.reload()}
            >
              Analyze Another CV
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
