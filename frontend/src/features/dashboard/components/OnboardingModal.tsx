"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileUp, Loader2, UserPlus, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
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
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[560px] bg-white rounded-[40px] border border-black/5 shadow-2xl overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex flex-col p-12">
              <div className="flex flex-col gap-4 mb-12">

                <div>
                  <h2 className="font-sans text-[28px] font-medium text-black tracking-tight leading-tight mb-2">
                    Start your automated journey.
                  </h2>
                  <p className="font-sans text-[16px] font-light text-black/40 leading-relaxed max-w-[360px]">
                    Let's personalize your experience. How would you like to set up your profile?
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="group relative w-full p-8 bg-[#FAF9F6] rounded-[32px] border border-black/[0.03] text-left hover:bg-white hover:shadow-xl transition-all duration-500 disabled:opacity-50"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-white border border-black/[0.05] flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                      <FileUp className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-sans text-[16px] font-medium text-black tracking-tight">
                        {uploading ? "Analyzing CV..." : "Upload CV PDF"}
                      </p>
                      <p className="font-sans text-[13px] text-black/40 font-light">
                        {uploading ? steps[currentStep] : "Autofill your profile in seconds"}
                      </p>
                    </div>
                  </div>
                  {uploading && (
                    <div className="mt-6 h-1 w-full bg-black/5 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-black origin-left"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                      />
                    </div>
                  )}
                </button>

                <button
                  onClick={handleManualSetup}
                  disabled={uploading}
                  className="group relative w-full p-8 bg-[#FAF9F6] rounded-[32px] border border-black/[0.03] text-left hover:bg-white hover:shadow-xl transition-all duration-500 disabled:opacity-50"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-white border border-black/[0.05] flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-sans text-[16px] font-medium text-black tracking-tight">
                        Manual Setup
                      </p>
                      <p className="font-sans text-[13px] text-black/40 font-light">
                        Fill in your professional details manually
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-center gap-8 py-10 opacity-30">
                <div className="flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-widest text-black">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Secure Data
                </div>
                <div className="flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-widest text-black">
                  ATS Optimized
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-[20px] border border-orange-500/10 bg-orange-500/5 font-sans text-[12px] text-orange-600 text-center"
                >
                  {error}
                </motion.div>
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
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed bottom-8 right-8 z-[1000] w-80 bg-white rounded-[32px] border border-black/5 p-6 shadow-2xl cursor-pointer hover:bg-[#FAF9F6] transition-all duration-500 flex flex-col gap-4"
          onClick={() => setMinimized(false)}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <p className="font-sans text-[12px] font-bold uppercase tracking-widest text-black">
                Analyzing_CV
              </p>
            </div>
            <span className="font-sans text-[12px] font-bold text-black/40">{Math.round(progress)}%</span>
          </div>
          <p className="font-sans text-[13px] text-black/50 font-light truncate">
            {steps[currentStep]}
          </p>
          <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-black origin-left"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
