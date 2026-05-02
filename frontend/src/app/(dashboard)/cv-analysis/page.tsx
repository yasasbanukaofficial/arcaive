"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, History } from "lucide-react";
import Button from "@/components/ui/Button";
import CVAnalysisModal from "@/features/cv-analysis/components/CVAnalysisModal";
import CVAnalysisResults from "@/features/cv-analysis/components/CVAnalysisResults";
import { CvAnalysisResponseDTO } from "@/features/cv-analysis/api/cvAnalysisAPI";
import { dashboardStagger, fadeUp } from "@/components/animations/animations";
import { jobAPI } from "@/features/jobs/api/jobAPI";

export default function CVAnalysisPage() {
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CvAnalysisResponseDTO | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [initialJobDescription, setInitialJobDescription] = useState("");

  useEffect(() => {
    if (!analysisResult) {
      setIsModalOpen(true);
    }
  }, [analysisResult]);

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
    <motion.div 
      initial="hidden"
      animate="show"
      variants={dashboardStagger(0.05, 0.02)}
      className="max-w-[1200px] mx-auto space-y-6 sm:space-y-8 pb-20 px-3 sm:px-6"
    >
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="font-sans text-[28px] font-bold text-[var(--text-primary)] capitalize tracking-tight">
            CV analysis
          </h1>
          <p className="font-sans text-[14px] text-[var(--text-secondary)] max-w-xl">
            Advanced semantic analysis engine for precise profile matching and optimization.
          </p>
        </div>

        {analysisResult && (
          <div className="flex items-center gap-4">
              <button
                onClick={handleNewAnalysis}
                className="px-6 py-3 text-[12px] font-bold tracking-widest transition-all hover:opacity-80"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  border: "1px solid #000000",
                }}
              >
                New analysis
              </button>
          </div>
        )}
      </motion.div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {!analysisResult ? (
            <motion.div
              key="empty-state"
              variants={fadeUp}
              className="relative min-h-[500px] flex items-center justify-center overflow-hidden p-8 sm:p-20"
              style={{
                backgroundColor: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
              }}
            >
              {/* Decorative Landing-style Grid */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                   style={{ 
                     backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
                     backgroundSize: '40px 40px' 
                   }} 
              />
              
              <div className="relative z-10 max-w-2xl mx-auto space-y-8 text-center">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 border border-[var(--glass-border)] font-mono text-[10px] tracking-[0.2em] text-[var(--text-secondary)] mb-4">
                    Neural alignment v4.0
                  </div>
                  <h2 className="font-display text-[40px] sm:text-[64px] font-bold leading-[0.9] tracking-tight text-[var(--text-primary)] capitalize">
                    Precision AI <br />profile matching
                  </h2>
                  <p className="text-[16px] sm:text-[18px] text-[var(--text-secondary)] max-w-lg mx-auto">
                    Upload your professional resume and a target job description. Our intelligent engine will perform comprehensive semantic analysis.
                  </p>
                </div>

                <div className="pt-8">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-10 py-5 text-[14px] font-bold tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#000000",
                        border: "1px solid #000000",
                      }}
                    >
                      Start analysis →
                    </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
    </motion.div>
  );
}
