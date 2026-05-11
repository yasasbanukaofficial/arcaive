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
        <div className="absolute inset-0 bg-[var(--bg-color)]/80 backdrop-blur-md" onClick={() => status !== "uploading" && onClose()} />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[600px] bg-[var(--d-surface)] border border-[var(--glass-border)] overflow-hidden rounded-[40px] shadow-[var(--shadow-premium)]"
        >
          <AnimatePresence mode="wait">
            {status === "uploading" ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-16"
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
                <div className="flex items-center justify-between px-10 py-10">
                  <div className="space-y-1">
                    <h2 className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight">
                      Protocol Configuration
                    </h2>
                    <p className="text-[13px] font-medium text-[var(--text-secondary)]">Define parameters for semantic alignment.</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] border border-[var(--glass-border)] hover:bg-[var(--text-primary)]/[0.05] transition-all rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-10 space-y-10">
                  <FileUpload
                    label="Source Document"
                    files={files}
                    onFilesChange={setFiles}
                    status={status}
                    progress={progress}
                    maxSizeMB={5}
                    disabled={status === "uploading"}
                  />

                  <TextArea
                    label="Target parameters (Job Description)"
                    placeholder="Input organizational requirements here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={8}
                    disabled={status === "uploading"}
                  />
                </div>

                <div className="px-10 py-10 flex justify-end gap-6 border-t border-[var(--glass-border)] mt-12 bg-[var(--text-primary)]/[0.02]">
                  <button
                    className="text-[12px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                    onClick={onClose}
                    disabled={status === "uploading"}
                  >
                    Terminate
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={files.length === 0 || !jobDescription.trim() || status === "uploading"}
                    className="px-10 py-4 text-[13px] font-bold uppercase tracking-widest transition-all bg-[var(--text-primary)] text-[var(--bg-color)] hover:opacity-90 active:scale-95 rounded-full disabled:opacity-20 shadow-xl"
                  >
                    Execute Alignment →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
