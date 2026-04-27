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
          <h1 className="font-sans text-[28px] font-bold text-black uppercase tracking-tight">
            CV Analysis.
          </h1>
          <p className="font-sans text-[14px] text-[#888880] max-w-xl">
            Deep semantic alignment engine for precision profile matching.
          </p>
        </div>

        {analysisResult && (
          <div className="flex items-center gap-4">
            <button
              onClick={handleNewAnalysis}
              className="btn-primary"
            >
              NEW ANALYSIS
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
              className="relative  sm: p-6 sm:p-10 lg:p-16 overflow-hidden text-center"
              style={{
                backgroundColor: "var(--d-surface)",
                border: "1px solid var(--d-border)",
              }}
            >
              <div className="relative z-10 max-w-2xl mx-auto space-y-5 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-xl sm:text-2xl lg:text-[40px] font-semibold leading-tight">
                    Precision AI Profile Matching
                  </h2>
                  <p className="text-sm sm:text-base" style={{ color: "var(--d-text-muted)" }}>
                    Upload your professional resume and a target job description. <br className="hidden sm:block" />
                    Our neural engine will perform deep semantic analysis.
                  </p>
                </div>

                <div className="pt-4 sm:pt-6">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setIsModalOpen(true)}
                    className="h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base font-medium "
                  >
                    Start Analysis
                  </Button>
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
