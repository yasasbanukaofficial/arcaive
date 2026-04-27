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
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70" />

          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            className="relative w-full max-w-[560px] bg-white border border-[#E8E6DE] overflow-hidden"
            style={{ borderRadius: 0 }}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-[48px] py-6">
                <h2 className="font-sans text-[20px] font-bold text-black uppercase">
                  Welcome to Arcaive
                </h2>
              </div>
              <div className="h-[1px] bg-[#E8E6DE] mx-[48px]" />

              <div className="p-[48px] space-y-8">
                <p className="font-sans text-[15px] leading-relaxed text-[#888880]">
                  Let&apos;s personalize your experience. How would you like to set up your profile?
                </p>

                <div className="space-y-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="group relative w-full p-6 border border-[#E8E6DE] text-left  hover:bg-[#F5F4EF] disabled:opacity-50"
                  >
                    <div className="flex items-center gap-5">
                      <span className="font-mono text-[18px] text-black">→</span>
                      <div className="flex-1 space-y-1">
                        <p className="font-mono text-[12px] font-bold uppercase tracking-widest text-black">
                          {uploading ? "Analyzing CV..." : "Upload CV PDF"}
                        </p>
                        <p className="font-sans text-[13px] text-[#888880]">
                          {uploading ? steps[currentStep] : "Autofill your profile in seconds"}
                        </p>
                      </div>
                    </div>
                    {uploading && (
                      <div className="mt-4 h-[2px] w-full bg-[#E8E6DE]">
                        <motion.div 
                          className="h-full bg-black"
                          initial={{ width: "0%" }}
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </button>

                  <button
                    onClick={handleManualSetup}
                    disabled={uploading}
                    className="group relative w-full p-6 border border-[#E8E6DE] text-left  hover:bg-[#F5F4EF] disabled:opacity-50"
                  >
                    <div className="flex items-center gap-5">
                      <span className="font-mono text-[18px] text-black">→</span>
                      <div className="flex-1 space-y-1">
                        <p className="font-mono text-[12px] font-bold uppercase tracking-widest text-black">
                          Manual Setup
                        </p>
                        <p className="font-sans text-[13px] text-[#888880]">
                          Fill in your professional details manually
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-6 py-2 opacity-60">
                  <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-black">
                    [ SECURE_DATA ]
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-black">
                    [ ATS_OPTIMIZED ]
                  </div>
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-[#D83B2A] bg-[#D83B2A]/5 font-mono text-[11px] text-[#D83B2A] text-center"
                  >
                    ! {error}
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
            </div>
          </motion.div>
        </motion.div>
      )}

      {minimized && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[1000] w-72 bg-white border border-black p-4 cursor-pointer hover:bg-[#F5F4EF] transition-colors"
          onClick={() => setMinimized(false)}
        >
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-black">
                ANALYZING_CV...
              </p>
              <span className="font-mono text-[11px] font-bold text-black">{Math.round(progress)}%</span>
            </div>
            <p className="font-sans text-[12px] text-[#888880] truncate">
              {steps[currentStep]}
            </p>
            <div className="h-[2px] w-full bg-[#E8E6DE]">
              <motion.div 
                className="h-full bg-black"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
