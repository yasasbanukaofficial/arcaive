"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2, CheckCircle2, X } from "lucide-react";

export interface UploadProgress {
  id: string;
  fileName: string;
  progress: number;
  status: "uploading" | "processing" | "completed" | "error";
  startTime: number;
}

// Simple singleton to manage progression from anywhere
type Listener = (uploads: UploadProgress[]) => void;
let listeners: Listener[] = [];
let uploads: UploadProgress[] = [];

export const uploadTracker = {
  subscribe: (listener: Listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  start: (id: string, fileName: string) => {
    uploads = [...uploads, { id, fileName, progress: 0, status: "uploading", startTime: Date.now() }];
    notify();
  },
  update: (id: string, progress: number, status?: UploadProgress["status"]) => {
    uploads = uploads.map(u => 
      u.id === id ? { ...u, progress: Math.max(u.progress, progress), status: status || u.status } : u
    );
    notify();
  },
  complete: (id: string) => {
    uploads = uploads.map(u => u.id === id ? { ...u, progress: 100, status: "completed" } : u);
    notify();
    setTimeout(() => {
      uploads = uploads.filter(u => u.id !== id);
      notify();
    }, 5000);
  },
  remove: (id: string) => {
    uploads = uploads.filter(u => u.id !== id);
    notify();
  }
};

const notify = () => listeners.forEach(l => l(uploads));

export default function BackgroundUploadTracker() {
  const [activeUploads, setActiveUploads] = useState<UploadProgress[]>([]);
  const [showMinimized, setShowMinimized] = useState<Record<string, boolean>>({});

  useEffect(() => {
    return uploadTracker.subscribe(setActiveUploads);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveUploads(prev => {
        let changed = false;
        const newState = prev.map(u => {
          if (u.status !== "completed" && u.status !== "error" && now - u.startTime > 10000 && !showMinimized[u.id]) {
            changed = true;
            return u;
          }
          return u;
        });
        
        if (changed) {
            const newShowMinimized = { ...showMinimized };
            prev.forEach(u => {
                if (now - u.startTime > 10000) newShowMinimized[u.id] = true;
            });
            setShowMinimized(newShowMinimized);
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showMinimized]);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {activeUploads.filter(u => showMinimized[u.id] || u.status === "completed").map((upload) => (
          <motion.div
            key={upload.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="pointer-events-auto bg-[#161616] border border-[#2a2a2a] rounded-2xl p-4 w-72 shadow-[0_12px_24px_rgba(0,0,0,0.4)] flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#dfe7d8]/10 flex items-center justify-center shrink-0">
                {upload.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-[#dfe7d8]" />
                ) : (
                    <FileText className="w-5 h-5 text-white/40" />
                )}
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <p className="text-[13px] font-medium text-white truncate pr-2">{upload.fileName}</p>
                    {upload.status === "completed" && (
                        <button onClick={() => uploadTracker.remove(upload.id)}>
                            <X className="w-3 h-3 text-white/30 hover:text-white" />
                        </button>
                    )}
                </div>
                
                {upload.status !== "completed" ? (
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase tracking-wider text-white/40 font-bold">
                            <span>{upload.status === "uploading" ? "Broadcasting" : "Neural Analysis"}</span>
                            <span>{Math.round(upload.progress)}%</span>
                        </div>
                        <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-[#dfe7d8]"
                                initial={{ width: 0 }}
                                animate={{ width: `${upload.progress}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <p className="text-[11px] text-[#dfe7d8]/80 font-medium">Processing Complete</p>
                )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
