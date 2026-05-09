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
          
          if (job) {
            setInitialJobDescription(job.description);
          }
        } catch (error) {
          console.error("Failed to fetch job for CV analysis:", error);
        }
      };
      
      fetchJobDetails();
    }
  }, [searchParams]);

  const handleAnalysisComplete = (data: CvAnalysisResponseDTO, file: File) => {
    setUploadedFile(file);
    setAnalysisResult(data);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 100);
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setUploadedFile(null);
    setIsModalOpen(true);
  };

  return (
    <DashboardPageWrapper>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#2a2a2a] pb-8">
        <div className="space-y-2">
          <h1 className="font-sans text-[32px] font-medium text-white tracking-tight leading-none capitalize">
            CV Analysis
          </h1>
          <p className="font-sans text-[15px] max-w-2xl text-white/50 leading-relaxed">
            Neural alignment engine for high-precision profile matching.
          </p>
        </div>
        {analysisResult && (
          <button
            onClick={handleNewAnalysis}
            className="px-6 py-2.5 text-[12px] font-bold tracking-widest transition-all bg-[#e6efdf] text-[#111] hover:opacity-90 active:scale-[0.98] rounded-full shadow-[0_4px_20px_rgba(230,239,223,0.15)]"
          >
            NEW ANALYSIS
          </button>
        )}
      </div>

      <DashboardGrid>
        <div className="lg:col-span-12">
          <AnimatePresence mode="wait">
            {!analysisResult ? (
              <motion.div
                key="empty-state"
                initial="hidden"
                animate="show"
                variants={fadeUp}
                className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-[#161616] border border-[#2a2a2a] rounded-[32px] p-8 sm:p-20"
              >
                {/* Decorative Grid */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                     style={{ 
                       backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                       backgroundSize: '40px 40px' 
                     }} 
                />
                
                <div className="relative z-10 max-w-2xl mx-auto space-y-12 text-center">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2a2a2a] bg-[#0d0d0d]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e6efdf] animate-pulse" />
                      <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">Engine Stable v4.0</span>
                    </div>
                    <h2 className="font-sans text-[48px] sm:text-[64px] font-medium leading-[0.95] tracking-tight text-white capitalize">
                      Precision AI <br /><span className="text-[#e6efdf]">Profile Matching</span>
                    </h2>
                    <p className="font-sans text-[16px] sm:text-[18px] text-white/40 max-w-lg mx-auto leading-relaxed">
                      Upload your professional resume and a target job description. Our intelligent engine will perform comprehensive semantic analysis.
                    </p>
                  </div>

                  <div className="pt-4">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-12 py-5 text-[14px] font-bold tracking-widest transition-all bg-[#e6efdf] text-[#111] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] rounded-full shadow-[0_4px_30px_rgba(230,239,223,0.2)]"
                      >
                        START ANALYSIS →
                      </button>
                  </div>

                  <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/5">
                    <div className="space-y-1">
                      <p className="font-mono text-[14px] font-bold text-white">ATS</p>
                      <p className="font-sans text-[11px] text-white/30 uppercase tracking-widest">Parsing</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-mono text-[14px] font-bold text-white">NLP</p>
                      <p className="font-sans text-[11px] text-white/30 uppercase tracking-widest">Alignment</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-mono text-[14px] font-bold text-white">GPT-4</p>
                      <p className="font-sans text-[11px] text-white/30 uppercase tracking-widest">Synthesis</p>
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
      </DashboardGrid>

      <CVAnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAnalysisComplete={handleAnalysisComplete}
        initialJobDescription={initialJobDescription}
      />
    </DashboardPageWrapper>
  );
}
