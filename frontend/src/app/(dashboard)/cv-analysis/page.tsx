"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import CVAnalysisModal from "@/features/cv-analysis/components/CVAnalysisModal";
import CVAnalysisResults from "@/features/cv-analysis/components/CVAnalysisResults";
import { CvAnalysisResponseDTO } from "@/features/cv-analysis/api/cvAnalysisAPI";
import { fadeUp } from "@/components/animations/animations";
import { jobAPI } from "@/features/jobs/api/jobAPI";

import { 
  DashboardPageWrapper,
  DashboardGrid,
} from "@/features/dashboard/components/DashboardLayoutComponents";

export default function CVAnalysisPage() {
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CvAnalysisResponseDTO | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [initialJobDescription, setInitialJobDescription] = useState("");

  useEffect(() => {
    const jobId = searchParams.get("jobId");
    if (!analysisResult && !jobId) {
      setIsModalOpen(true);
    }
  }, [analysisResult, searchParams]);

  useEffect(() => {
    const jobId = searchParams.get("jobId");
    if (jobId) {
      const decodedJobId = decodeURIComponent(jobId);
      const fetchJobDetails = async () => {
        try {
          let job = jobAPI.getCachedJob(decodedJobId);
          if (!job) {
            const jobs = await jobAPI.get();
            job = jobs.find((j) => j.id === decodedJobId) || null;
          }
          if (job) setInitialJobDescription(job.description);
        } catch (error) { console.error(error); }
      };
      fetchJobDetails();
    }
  }, [searchParams]);

  const handleAnalysisComplete = (data: CvAnalysisResponseDTO, file: File) => {
    setUploadedFile(file);
    setAnalysisResult(data);
    setTimeout(() => setIsModalOpen(false), 100);
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setUploadedFile(null);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-20 px-4 md:px-8">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-[44px] md:text-[56px] font-semibold text-[var(--text-primary)] tracking-[-0.04em] leading-none capitalize">
            CV Analysis
          </h1>
          <p className="text-[var(--text-secondary)] text-[14px] font-medium tracking-tight">Neural alignment engine for high-precision profile matching</p>
        </div>
        {analysisResult && (
          <button
            onClick={handleNewAnalysis}
            className="h-[52px] px-8 bg-[var(--text-primary)] text-[var(--bg-color)] rounded-full font-bold text-[12px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl flex items-center gap-2"
          >
            New Analysis
          </button>
        )}
      </div>

      <div className="w-full mt-4">
        <AnimatePresence mode="wait">
          {!analysisResult ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative min-h-[640px] flex items-center justify-center overflow-hidden bg-[var(--d-surface)] border border-[var(--glass-border)] rounded-[40px] p-8 sm:p-20 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-brand)]/[0.03] to-transparent pointer-events-none" />
              <div className="absolute inset-0 opacity-[0.015] pointer-events-none" 
                   style={{ backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
              
              <div className="relative z-10 max-w-2xl mx-auto space-y-12 text-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--bg-color)]/60 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-brand)] animate-pulse" />
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--text-tertiary)] uppercase">Stable Protocol v4.2</span>
                  </div>
                  <h2 className="text-[56px] sm:text-[72px] font-bold leading-[0.9] tracking-tight text-[var(--text-primary)] capitalize">
                    Precision AI <br /><span className="text-[var(--accent-brand)]">Alignment</span>
                  </h2>
                  <p className="text-[16px] sm:text-[18px] text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed font-medium">
                    Initialize semantic cross-referencing between your professional profile and target organizational parameters.
                  </p>
                </div>

                <div className="pt-4">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-12 py-5 text-[14px] font-bold tracking-widest transition-all bg-[var(--text-primary)] text-[var(--bg-color)] hover:opacity-90 hover:scale-105 active:scale-95 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                    >
                      INITIALIZE ENGINE →
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-12 pt-12 border-t border-[var(--glass-border)]">
                  <div className="space-y-1">
                    <p className="text-[18px] font-bold text-[var(--text-primary)] tracking-tight">ATS</p>
                    <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Parsing</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[18px] font-bold text-[var(--text-primary)] tracking-tight">NLP</p>
                    <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Alignment</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[18px] font-bold text-[var(--text-primary)] tracking-tight">GPT-4</p>
                    <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Synthesis</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <CVAnalysisResults data={analysisResult} file={uploadedFile!} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CVAnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAnalysisComplete={handleAnalysisComplete}
        initialJobDescription={initialJobDescription}
      />
    </div>
  );
}
