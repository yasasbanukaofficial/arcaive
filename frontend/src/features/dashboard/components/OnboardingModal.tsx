"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileUp, Loader2, Sparkles, UserPlus, CheckCircle2, ShieldCheck, BrainCircuit } from "lucide-react";
import { memberAPI } from "@/features/settings/api/memberAPI";
import { Member, MemberUpdatePayload, OnboardingAutofillResponse } from "@/@types/member";
import { useToast } from "@/components/ui/Toast";
import { useRouter, usePathname } from "next/navigation";

function getProfileSource(member: Member) {
  return member.profile ?? member;
}

function hasProfileDetails(member: Member) {
  const profile = getProfileSource(member);

  return Boolean(
    profile.summary?.trim() ||
      profile.location?.trim() ||
      profile.phone?.trim() ||
      (profile.experiences && profile.experiences.length > 0) ||
      (profile.educations && profile.educations.length > 0) ||
      (profile.skills && profile.skills.length > 0) ||
      (profile.projects && profile.projects.length > 0) ||
      (profile.certifications && profile.certifications.length > 0) ||
      (profile.languages && profile.languages.length > 0),
  );
}

function normalizeOnboardingResponse(
  extracted: OnboardingAutofillResponse | { profile?: OnboardingAutofillResponse } | null | undefined,
): OnboardingAutofillResponse {
  if (!extracted) return {};
  if ("profile" in extracted && extracted.profile) {
    return extracted.profile;
  }
  return extracted as OnboardingAutofillResponse;
}

function toPayload(extracted: OnboardingAutofillResponse): MemberUpdatePayload {
  return {
    ...(extracted.jobRole?.trim() ? { jobRole: extracted.jobRole.trim() } : {}),
    ...(extracted.experience?.trim() ? { experience: extracted.experience.trim() } : {}),
    ...(extracted.country?.trim() ? { country: extracted.country.trim() } : {}),
    ...(extracted.location?.trim() ? { location: extracted.location.trim() } : {}),
    ...(extracted.phone?.trim() ? { phone: extracted.phone.trim() } : {}),
    ...(extracted.linkedin?.trim() ? { linkedin: extracted.linkedin.trim() } : {}),
    ...(extracted.summary?.trim() ? { summary: extracted.summary.trim() } : {}),
    experiences: Array.isArray(extracted.experiences) ? extracted.experiences : [],
    educations: Array.isArray(extracted.educations) ? extracted.educations : [],
    skills: Array.isArray(extracted.skills) ? extracted.skills : [],
    projects: Array.isArray(extracted.projects) ? extracted.projects : [],
    certifications: Array.isArray(extracted.certifications)
      ? extracted.certifications.filter(Boolean)
      : [],
    languages: Array.isArray(extracted.languages)
      ? extracted.languages.filter(Boolean)
      : [],
  };
}

export default function OnboardingModal() {
  const { addToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const steps = [
    "Reading PDF structure...",
    "Extracting experience history...",
    "Identifying core skills...",
    "Finalizing profile layout..."
  ];

  useEffect(() => {
    (async () => {
      if (pathname === "/onboarding/manual") {
        setOpen(false);
        setLoading(false);
        return;
      }

      try {
        const member: Member = await memberAPI.get();
        if (!hasProfileDetails(member)) {
          setOpen(true);
        } else {
          setOpen(false);
        }
      } catch {
        setOpen(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [pathname]);

  useEffect(() => {
    if (!open || minimized) {
      document.body.style.overflow = "auto";
      return;
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open, minimized]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (uploading) {
      timer = setTimeout(() => {
        setMinimized(true);
      }, 5000);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev;
          const next = prev + (100 - prev) * 0.1;
          setCurrentStep(Math.min(Math.floor((next / 100) * steps.length), steps.length - 1));
          return next;
        });
      }, 800);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    } else {
      setProgress(0);
      setCurrentStep(0);
      setMinimized(false);
    }
  }, [uploading]);

  const handleCVUpload = async (file: File | null) => {
    if (!file) return;

    const validType = file.type === "application/pdf" || /\.(pdf)$/i.test(file.name);
    if (!validType) {
      setError("Please upload your CV as a PDF file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("CV file size must be less than 10MB.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const extractedRaw = await memberAPI.extractOnboardingFromCV(file);
      const extracted = normalizeOnboardingResponse(extractedRaw as OnboardingAutofillResponse);
      const payload = toPayload(extracted);

      await memberAPI.update(payload);

      const refreshedMember: Member = await memberAPI.get();
      if (!hasProfileDetails(refreshedMember)) {
        throw new Error("Profile data was not saved correctly. Please try uploading again.");
      }
      
      setProgress(100);
      setTimeout(() => {
        setOpen(false);
        setMinimized(false);
        addToast({
          type: "success",
          title: "Setup Complete",
          description: "Your profile has been built using your CV data.",
        });
      }, 500);
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message;
      setError(backendMessage || "We could not process this CV. Please try another PDF.");
      setMinimized(false);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleManualSetup = () => {
    setOpen(false);
    router.push("/onboarding/manual");
  };

  if (loading || !open) return null;

  return (
    <AnimatePresence>
      {open && !minimized && (
        <motion.div
          className="fixed inset-0 z-1000 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border shadow-2xl"
            style={{
              backgroundColor: "var(--d-surface)",
              borderColor: "rgba(255, 255, 255, 0.08)",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
              />
            </div>

            <div className="p-8 sm:p-10">
              <div className="mb-8 text-center space-y-3">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Sparkles className="w-8 h-8 text-blue-400" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--d-text-primary)" }}>
                    Welcome to Arcaive
                  </h2>
                  <p className="text-[15px]" style={{ color: "var(--d-text-muted)" }}>
                    Let&apos;s personalize your experience. How would you like to set up your profile?
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="group relative w-full p-6 rounded-3xl border text-left transition-all hover:bg-white/5 active:scale-[0.98] disabled:opacity-50"
                  style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                      {uploading ? <BrainCircuit className="w-7 h-7 text-blue-400 animate-pulse" /> : <FileUp className="w-7 h-7 text-blue-400" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-bold text-lg" style={{ color: "var(--d-text-primary)" }}>
                        {uploading ? "Analyzing CV..." : "Upload CV PDF"}
                      </p>
                      <p className="text-sm" style={{ color: "var(--d-text-muted)" }}>
                        {uploading ? steps[currentStep] : "Autofill your profile in seconds"}
                      </p>
                    </div>
                  </div>
                  
                  {uploading && (
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-blue-400/80 uppercase tracking-widest">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      AI Processing...
                    </div>
                  )}
                </button>

                <button
                  onClick={handleManualSetup}
                  disabled={uploading}
                  className="group relative w-full p-6 rounded-3xl border text-left transition-all hover:bg-white/5 active:scale-[0.98] disabled:opacity-50"
                  style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                      <UserPlus className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-bold text-lg" style={{ color: "var(--d-text-primary)" }}>
                        Manual Setup
                      </p>
                      <p className="text-sm" style={{ color: "var(--d-text-muted)" }}>
                        Fill in your professional details manually
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-6 py-2 opacity-40">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" />
                  Secure Data
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <CheckCircle2 className="w-3 h-3" />
                  ATS Optimized
                </div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 text-center text-sm font-medium text-red-400 bg-red-400/10 py-3 rounded-xl border border-red-400/20"
                >
                  {error}
                </motion.p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  void handleCVUpload(e.target.files?.[0] ?? null);
                  e.target.value = "";
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {minimized && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed bottom-6 right-6 z-1000 w-72 overflow-hidden rounded-2xl border shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform"
          style={{
            backgroundColor: "var(--d-surface)",
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
          onClick={() => setMinimized(false)}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <BrainCircuit className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: "var(--d-text-primary)" }}>
                Analyzing CV...
              </p>
              <p className="text-[11px] truncate" style={{ color: "var(--d-text-muted)" }}>
                {steps[currentStep]}
              </p>
            </div>
            <div className="text-[10px] font-bold text-blue-400">
              {Math.round(progress)}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
