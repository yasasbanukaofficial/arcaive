"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import FileUpload, { UploadedFile, FileUploadStatus } from "@/components/ui/FileUpload";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import { cvAnalysisAPI, CvAnalysisResponseDTO } from "../api/cvAnalysisAPI";
import { useToast } from "@/components/ui/Toast";

import CVAnalysisLoading from "./CVAnalysisLoading";

interface CVAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (data: CvAnalysisResponseDTO, file: File) => void;
  initialJobDescription?: string;
}

export default function CVAnalysisModal({ 
  isOpen, 
  onClose,
  onAnalysisComplete, 
  initialJobDescription = "" 
}: CVAnalysisModalProps) {
  const { addToast } = useToast();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [jobDescription, setJobDescription] = useState(initialJobDescription);
  const [status, setStatus] = useState<any>("idle");
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    if (initialJobDescription) {
      setJobDescription(initialJobDescription);
    }
  }, [initialJobDescription]);

  const handleAnalyze = async () => {
    if (files.length === 0 || !jobDescription.trim()) return;

    setStatus("uploading");
    setProgress(10);
    
    try {
      const result = await cvAnalysisAPI.analyze(files[0].file, jobDescription);
      setStatus("success");
      
      setTimeout(() => {
        onAnalysisComplete(result, files[0].file);
      }, 800);
    } catch (error) {
      setStatus("error");
      addToast({
        type: "error",
        title: "Analysis Failed",
        description: "Something went wrong during CV analysis. Please try again.",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/70" onClick={() => status !== "uploading" && onClose()} />
        
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          className="relative w-full max-w-[560px] bg-[#161616] border border-[#2a2a2a] overflow-hidden rounded-[24px]"
        >
          <AnimatePresence mode="wait">
            {status === "uploading" ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-[48px]"
              >
                <CVAnalysisLoading />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 flex flex-col"
              >
                <div className="flex items-center justify-between px-[48px] py-6">
                  <h2 className="font-sans text-[20px] font-bold text-[var(--text-primary)] uppercase">
                    Analysis Config.
                  </h2>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center font-mono text-[18px] text-[var(--text-primary)] border border-[var(--glass-border)] hover:bg-[var(--glass-border)] transition-all rounded-[var(--radius)]"
                  >
                    ×
                  </button>
                </div>
                <div className="h-[1px] bg-[var(--glass-border)] mx-[48px]" />

                <div className="p-[48px] space-y-8">
                  <FileUpload
                    label="Your Resume Document"
                    files={files}
                    onFilesChange={setFiles}
                    status={status}
                    progress={progress}
                    maxSizeMB={5}
                    disabled={status === "uploading"}
                  />

                  <TextArea
                    label="Target Job Description"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={6}
                    disabled={status === "uploading"}
                  />
                </div>

                <div className="mt-4">
                  <div className="h-[1px] bg-[var(--glass-border)] mx-[48px]" />
                  <div className="px-[48px] py-8 flex justify-end gap-4">
                    <button
                      className="px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      onClick={onClose}
                      disabled={status === "uploading"}
                    >
                      CANCEL
                    </button>
                    <button
                      onClick={handleAnalyze}
                      disabled={files.length === 0 || !jobDescription.trim() || status === "uploading"}
                      className="px-6 py-2.5 text-[13px] font-semibold transition-all active:scale-95 rounded-full disabled:opacity-30"
                      style={{ 
                        backgroundColor: "#e6efdf", 
                        color: "#111111",
                      }}
                    >
                      Run analysis
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
