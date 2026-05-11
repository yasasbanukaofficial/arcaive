"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, CheckCircle2, Loader2, Sparkles, AlertCircle, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

type UploadStatus = "idle" | "uploading" | "scanning" | "complete" | "confirm-skip";

interface CVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  onSkip: () => Promise<void>;
}

export default function CVUploadModal({ isOpen, onClose, onUpload, onSkip }: CVUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setStatus("idle");
    }
  }, [isOpen]);

  const handleAction = async () => {
    if (!file) return;
    
    try {
      setStatus("uploading");
      await new Promise(r => setTimeout(r, 1200));
      
      setStatus("scanning");
      await onUpload(file);
      
      setStatus("complete");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setStatus("idle");
    }
  };

  const handleSkipConfirm = async () => {
    try {
      await onSkip(); // Mark onboarding as complete in backend
      onClose();
    } catch (error) {
      setStatus("idle");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-all" 
          onClick={status === "idle" || status === "confirm-skip" ? onClose : undefined} 
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[32px] p-8 md:p-10 w-full max-w-md shadow-[0_32px_64px_rgba(0,0,0,0.5)] relative overflow-hidden transition-colors duration-300"
        >
          {/* Status content */}
          <div className="relative z-10">
            {status === "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="idle"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight mb-2">Build Profile</h2>
                    <p className="text-[14px] text-[var(--text-secondary)]">Upload your CV to let our AI scan and build your professional profile.</p>
                  </div>
                  <X 
                    className="w-5 h-5 text-[var(--text-tertiary)] cursor-pointer hover:text-[var(--text-primary)] transition-colors" 
                    onClick={onClose}
                  />
                </div>
                
                <input 
                  type="file" 
                  onChange={(e) => e.target.files && setFile(e.target.files[0])} 
                  className="hidden" 
                  id="cv-upload"
                  accept=".pdf,.doc,.docx"
                />
                <label 
                  htmlFor="cv-upload" 
                  className="group block w-full py-16 border border-dashed border-[var(--glass-border)] rounded-3xl text-center cursor-pointer hover:border-[#dfe7d8]/40 hover:bg-[var(--text-primary)]/[0.02] transition-all duration-300"
                >
                   {file ? (
                       <div className="flex flex-col items-center gap-3">
                           <div className="w-16 h-16 rounded-2xl bg-[#dfe7d8]/10 flex items-center justify-center mb-2">
                               <FileText className="w-8 h-8 text-[#dfe7d8]" />
                           </div>
                           <span className="text-[15px] font-medium text-[var(--text-primary)]">{file.name}</span>
                       </div>
                   ) : (
                      <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-2xl bg-[var(--text-primary)]/[0.03] flex items-center justify-center mb-2 group-hover:bg-[#dfe7d8]/5 transition-colors">
                              <Upload className="w-8 h-8 text-[var(--text-tertiary)] group-hover:text-[#dfe7d8] transition-colors" />
                          </div>
                          <span className="text-[14px] text-[var(--text-secondary)]">Select your professional resume</span>
                          <span className="text-[11px] uppercase tracking-widest text-[var(--text-tertiary)] hover:text-[#dfe7d8]">PDF, DOCX up to 10MB</span>
                      </div>
                   )}
                </label>

                <div className="grid grid-cols-2 gap-4 mt-10">
                  <button 
                    className="py-3.5 rounded-2xl bg-[var(--text-primary)]/[0.05] text-[var(--text-primary)] text-[13px] font-bold uppercase tracking-widest hover:bg-[var(--text-primary)]/[0.1] transition-all border border-[var(--glass-border)]"
                    onClick={() => setStatus("confirm-skip")}
                  >
                    Skip
                  </button>
                  <button 
                    disabled={!file}
                    className="py-3.5 rounded-2xl bg-[#dfe7d8] text-black text-[13px] font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    onClick={handleAction}
                  >
                    Start Scan
                  </button>
                </div>
              </motion.div>
            )}

            {status === "confirm-skip" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                key="skip-warning"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-8">
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                </div>
                
                <h2 className="text-[24px] font-bold text-[var(--text-primary)] mb-4 tracking-tight">Wait, one thing...</h2>
                <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed mb-10">
                  We collect this data to automatically build your **Neural Identity**, so you don't need to enter your details repeatedly for job searches, interview readiness, and agent training.
                </p>

                <div className="flex flex-col gap-3">
                  <button 
                    className="w-full py-4 rounded-2xl bg-[var(--text-primary)] text-[var(--bg-color)] text-[14px] font-bold uppercase tracking-widest hover:opacity-90 transition-all font-sans"
                    onClick={() => setStatus("idle")}
                  >
                    <div className="flex items-center justify-center gap-2">
                       <ArrowLeft className="w-4 h-4" /> Go Back
                    </div>
                  </button>
                  <button 
                    className="w-full py-4 rounded-2xl bg-transparent text-[var(--text-tertiary)] text-[12px] font-bold uppercase tracking-widest hover:text-[var(--text-primary)] transition-all font-sans"
                    onClick={handleSkipConfirm}
                  >
                    Proceed Anyway
                  </button>
                </div>
              </motion.div>
            )}

            {(status === "uploading" || status === "scanning") && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key="processing"
                className="flex flex-col items-center py-10"
              >
                <div className="relative mb-12">
                  <div className="w-24 h-32 bg-[var(--text-primary)]/[0.02] border border-[var(--glass-border)] rounded-xl flex items-center justify-center relative overflow-hidden">
                    <FileText className="w-10 h-10 text-[var(--text-tertiary)]" />
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-[2px] bg-[#dfe7d8] shadow-[0_0_15px_#dfe7d8] z-20"
                    />
                    <AnimatePresence>
                        {status === "scanning" && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-gradient-to-b from-[#dfe7d8]/5 to-transparent"
                            />
                        )}
                    </AnimatePresence>
                  </div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-8 pointer-events-none"
                  >
                    <Sparkles className="absolute top-0 right-0 text-[#dfe7d8]/30 w-4 h-4" />
                    <Sparkles className="absolute bottom-0 left-0 text-[#dfe7d8]/30 w-5 h-5" />
                  </motion.div>
                </div>

                <div className="text-center space-y-3">
                  <h3 className="text-[20px] font-bold text-[var(--text-primary)]">
                    {status === "uploading" ? "Broadcasting Data" : "Neural Analysis"}
                  </h3>
                  <div className="flex items-center gap-2 text-[14px] text-[var(--text-secondary)] justify-center">
                    <Loader2 className="w-3 h-3 animate-spin text-[#dfe7d8]" />
                    <span>{status === "uploading" ? "Uploading encrypted package..." : "Extracting professional nodes..."}</span>
                  </div>
                </div>

                <div className="w-full max-w-[200px] h-[3px] bg-[var(--text-primary)]/[0.05] rounded-full mt-10 overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: status === "uploading" ? "40%" : "95%" }}
                    transition={{ duration: 3 }}
                    className="h-full bg-[#dfe7d8] shadow-[0_0_10px_#dfe7d8]"
                  />
                </div>
              </motion.div>
            )}

            {status === "complete" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key="complete"
                className="flex flex-col items-center py-10"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-20 h-20 rounded-full bg-[#dfe7d8] flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(223,231,216,0.3)]"
                >
                  <CheckCircle2 className="w-10 h-10 text-black" />
                </motion.div>
                
                <h3 className="text-[24px] font-bold text-[var(--text-primary)] mb-2">Scan Complete</h3>
                <p className="text-[14px] text-[var(--text-secondary)] text-center max-w-[200px]">
                  Professional identity synchronized successfully.
                </p>
                
                <p className="mt-12 text-[11px] uppercase tracking-[0.2em] text-[#dfe7d8]/60 font-bold">
                  Redirecting to Command Center
                </p>
              </motion.div>
            )}
          </div>

          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#dfe7d8]/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
