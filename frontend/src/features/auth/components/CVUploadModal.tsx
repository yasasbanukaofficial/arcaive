"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText } from "lucide-react";
import Button from "@/components/ui/Button";

interface CVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

export default function CVUploadModal({ isOpen, onClose, onUpload }: CVUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[var(--d-surface)] border border-[var(--glass-border)] rounded-[32px] p-8 w-full max-w-md shadow-2xl relative"
        >
          <h2 className="text-xl font-bold mb-2">Upload Resume</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Upload your CV to complete your profile.</p>
          
          <input 
            type="file" 
            onChange={(e) => e.target.files && setFile(e.target.files[0])} 
            className="hidden" 
            id="cv-upload"
          />
          <label htmlFor="cv-upload" className="block w-full py-12 border-2 border-dashed border-[var(--glass-border)] rounded-2xl text-center cursor-pointer hover:border-[var(--accent-brand)] transition-colors">
             {file ? (
                 <div className="flex flex-col items-center gap-2">
                     <FileText className="w-8 h-8 text-[var(--accent-brand)]" />
                     <span className="text-xs">{file.name}</span>
                 </div>
             ) : (
                <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-[var(--text-tertiary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">Click to select PDF</span>
                </div>
             )}
          </label>

          <div className="flex gap-4 mt-8">
            <Button variant="secondary" className="flex-1" onClick={onClose}>Skip</Button>
            <Button variant="primary" className="flex-1" disabled={!file} onClick={() => file && onUpload(file)}>Upload</Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
