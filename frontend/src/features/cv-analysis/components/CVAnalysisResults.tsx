"use client";

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CvAnalysisResponseDTO } from "../api/cvAnalysisAPI";
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
  const [activeTab, setActiveTab] = useState<"strengths" | "weaknesses">("strengths");

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
  
  if (!data) return null;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      {/* Overall Score Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-12 items-start">
        <div className="flex flex-col">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#888880] mb-2">MATCH SCORE</span>
          <div className="font-sans text-[80px] font-bold leading-none text-black">
            {displayScore}<span className="text-[32px] opacity-20">%</span>
          </div>
        </div>
        
        <div className="flex-1 space-y-4 pt-4">
          <div className="inline-block font-mono text-[10px] border border-black px-2 py-1 uppercase tracking-widest mb-4">
            AI VERDICT: {data.seniorityFit?.replace(/_/g, " ")}
          </div>
          <h2 className="font-sans text-[32px] font-bold leading-tight uppercase">
            {data.targetJobTitle}
          </h2>
          <p className="font-sans text-[18px] text-[#888880] leading-relaxed max-w-2xl italic">
            &quot;{data.semanticVerdict}&quot;
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-12">
          {/* Section Scores */}
          <div className="space-y-6">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-[#888880]">DIMENSIONAL ALIGNMENT</h3>
            <div className="border-t border-[#E8E6DE]">
              <div className="flex justify-between py-4 border-b border-[#E8E6DE] hover:bg-[#F5F4EF] px-2 transition-colors">
                <span className="font-sans text-[16px] font-bold uppercase">TECHNICAL SKILLS</span>
                <span className="font-mono text-[16px]">{Math.round(data.skillGap?.technicalAlignmentScore * 100 || 0)}%</span>
              </div>
              <div className="flex justify-between py-4 border-b border-[#E8E6DE] hover:bg-[#F5F4EF] px-2 transition-colors">
                <span className="font-sans text-[16px] font-bold uppercase">EXPERIENCE RELEVANCE</span>
                <span className="font-mono text-[16px]">{displayScore}%</span>
              </div>
              <div className="flex justify-between py-4 border-b border-[#E8E6DE] hover:bg-[#F5F4EF] px-2 transition-colors">
                <span className="font-sans text-[16px] font-bold uppercase">CRITICAL FLAGS</span>
                <span className="font-mono text-[16px]">{data.redFlags?.length || 0} FOUND</span>
              </div>
            </div>
          </div>

          {/* Feedback Tabs */}
          <div className="space-y-8">
            <div className="flex gap-8 border-b border-[#E8E6DE]">
              <button 
                onClick={() => setActiveTab("strengths")}
                className={`pb-2 font-mono text-[11px] uppercase tracking-widest  ${activeTab === "strengths" ? "text-black border-b-2 border-black" : "text-[#888880] border-b-2 border-transparent"}`}
              >
                Core Strengths
              </button>
              <button 
                onClick={() => setActiveTab("weaknesses")}
                className={`pb-2 font-mono text-[11px] uppercase tracking-widest  ${activeTab === "weaknesses" ? "text-black border-b-2 border-black" : "text-[#888880] border-b-2 border-transparent"}`}
              >
                Skill Gaps
              </button>
            </div>

            <div className="space-y-4">
              {activeTab === "strengths" ? (
                <ul className="space-y-3">
                  {data.skillGap?.matchedSkills?.map((skill, i) => (
                    <li key={i} className="font-sans text-[15px] flex items-start gap-3">
                      <span className="text-[#888880]">—</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                  {(!data.skillGap?.matchedSkills || data.skillGap.matchedSkills.length === 0) && (
                    <p className="font-sans text-[14px] text-[#888880] italic">No specific strengths highlighted.</p>
                  )}
                </ul>
              ) : (
                <ul className="space-y-3">
                  {data.skillGap?.missingEssentials?.map((skill, i) => (
                    <li key={i} className="font-sans text-[15px] flex items-start gap-3">
                      <span className="text-[#D83B2A]">—</span>
                      <span className="text-[#D83B2A]">{skill}</span>
                    </li>
                  ))}
                  {(!data.skillGap?.missingEssentials || data.skillGap.missingEssentials.length === 0) && (
                    <p className="font-sans text-[14px] text-[#888880] italic">No critical skill gaps detected.</p>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Interview Probes */}
          <div className="space-y-6">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-[#888880]">EXPECTED INTERVIEW PROBES</h3>
            <div className="space-y-4">
              {data.interviewProbes?.map((probe, i) => (
                <div key={i} className="p-6 border border-[#E8E6DE] bg-[#F5F4EF] font-sans text-[15px] leading-relaxed">
                  &quot;{probe}&quot;
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 space-y-8">
          <div className="border border-[#E8E6DE] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#888880]">DOCUMENT_ID</span>
              <span className="font-mono text-[11px] uppercase">{file?.name?.split('.').pop()}</span>
            </div>
            <div className="font-sans text-[14px] font-bold uppercase truncate">
              {file?.name}
            </div>
            <div className="aspect-[1/1.4] w-full border border-[#E8E6DE] bg-white overflow-hidden">
              {pdfUrl ? (
                <iframe 
                  src={pdfUrl + "#toolbar=0&navpanes=0&scrollbar=0"} 
                  className="w-full h-full border-none grayscale"
                  title="CV Preview"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mono text-[11px] text-[#888880]">
                  NO_PREVIEW
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button 
                variant="secondary" 
                className="btn-ghost"
                onClick={() => window.open(pdfUrl || "", "_blank")}
              >
                EXPAND
              </Button>
              <Button 
                variant="primary" 
                className="btn-primary"
                onClick={() => window.location.reload()}
              >
                RESET
              </Button>
            </div>
          </div>

          {/* Red Flags Section */}
          {data.redFlags?.length > 0 && (
            <div className="border border-[#D83B2A] p-8 space-y-4">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#D83B2A]">CRITICAL_RED_FLAGS</span>
              <ul className="space-y-3">
                {data.redFlags.map((flag, i) => (
                  <li key={i} className="font-sans text-[14px] text-[#D83B2A] flex items-start gap-3">
                    <span>!</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
