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
                <div className="flex items-center justify-between px-10 py-8">
                  <div className="space-y-1">
                    <h2 className="font-sans text-[20px] font-medium text-white tracking-tight">
                      Analysis Configuration
                    </h2>
                    <p className="font-sans text-[12px] text-white/40">Set parameters for the matching engine.</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white border border-[#2a2a2a] hover:bg-[#1f1f1f] transition-all rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-10 space-y-8">
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
                    rows={8}
                    disabled={status === "uploading"}
                  />
                </div>

                <div className="px-10 py-10 flex justify-end gap-6 border-t border-[#2a2a2a] mt-8 bg-[#1a1a1a]/40">
                  <button
                    className="text-[12px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                    onClick={onClose}
                    disabled={status === "uploading"}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={files.length === 0 || !jobDescription.trim() || status === "uploading"}
                    className="px-8 py-3 text-[12px] font-bold uppercase tracking-widest transition-all bg-[#e6efdf] text-[#111] hover:opacity-90 active:scale-[0.98] rounded-full disabled:opacity-20 shadow-[0_4px_20px_rgba(230,239,223,0.15)]"
                  >
                    Run alignment →
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
