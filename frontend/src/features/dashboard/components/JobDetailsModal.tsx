"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileUp, Loader2, Sparkles } from "lucide-react";
import { memberAPI } from "@/features/settings/api/memberAPI";
import { Member, MemberUpdatePayload, OnboardingAutofillResponse } from "@/@types/member";
import { useToast } from "@/components/ui/Toast";

const onboardingDoneKey = (memberId: string) => `resume_onboarding_done_${memberId}`;

function hasProfileDetails(member: Member) {
  return Boolean(
    member.summary?.trim() ||
      member.location?.trim() ||
      member.phoneNumber?.trim() ||
      (member.experiences && member.experiences.length > 0) ||
      (member.educations && member.educations.length > 0) ||
      (member.skills && member.skills.length > 0) ||
      (member.projects && member.projects.length > 0) ||
      (member.certifications && member.certifications.length > 0) ||
      (member.languages && member.languages.length > 0),
  );
}

function toPayload(extracted: OnboardingAutofillResponse): MemberUpdatePayload {
  return {
    ...(extracted.jobRole?.trim() ? { jobRole: extracted.jobRole.trim() } : {}),
    ...(extracted.experience?.trim() ? { experience: extracted.experience.trim() } : {}),
    ...(extracted.country?.trim() ? { country: extracted.country.trim() } : {}),
    ...(extracted.location?.trim() ? { location: extracted.location.trim() } : {}),
    ...(extracted.phone?.trim() ? { phoneNumber: extracted.phone.trim() } : {}),
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

export default function JobDetailsModal() {
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const member: Member = await memberAPI.get();
        const id = member.memberId || "anonymous";
        setMemberId(id);

        const done = localStorage.getItem(onboardingDoneKey(id)) === "1";
        if (done || hasProfileDetails(member)) {
          localStorage.setItem(onboardingDoneKey(id), "1");
          setOpen(false);
          return;
        }

        setOpen(true);
      } catch {
        setOpen(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

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
      const extracted = (await memberAPI.extractOnboardingFromCV(file)) as OnboardingAutofillResponse;
      const payload = toPayload(extracted);

      await memberAPI.update(payload);

      const resolvedMemberId = memberId || "anonymous";
      localStorage.setItem(onboardingDoneKey(resolvedMemberId), "1");
      setOpen(false);

      addToast({
        type: "success",
        title: "Profile details recorded",
        description: "Your CV details were saved successfully and your dashboard is now personalized.",
      });
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message;
      setError(backendMessage || "We could not process this CV. Please try another PDF.");
      addToast({
        type: "error",
        title: "CV upload failed",
        description: backendMessage || "We could not process this CV. Please try another PDF.",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading || !open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className="relative w-full max-w-xl rounded-2xl border p-6 shadow-2xl"
            style={{
              backgroundColor: "var(--d-surface)",
              borderColor: "var(--d-border)",
            }}
          >
            <div className="mb-5 flex items-start gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "var(--d-accent-blue)" }}
              >
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: "var(--d-text-primary)" }}>
                  Upload your CV to continue
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--d-text-muted)" }}>
                  We use your CV to set up your profile and personalize your dashboard.
                </p>
              </div>
            </div>

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

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full rounded-2xl border border-dashed px-5 py-10 text-left transition-colors disabled:opacity-70"
              style={{
                borderColor: "var(--d-border)",
                backgroundColor: "color-mix(in srgb, var(--d-surface-elevated) 80%, transparent)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "color-mix(in srgb, var(--d-accent-blue) 35%, transparent)" }}
                >
                  {uploading ? <Loader2 size={20} className="animate-spin" /> : <FileUp size={20} />}
                </div>
                <div>
                  <p className="font-medium" style={{ color: "var(--d-text-primary)" }}>
                    {uploading ? "Analyzing your CV..." : "Choose CV PDF"}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--d-text-muted)" }}>
                    Required once. Max size: 10MB.
                  </p>
                </div>
              </div>
            </button>

            {error && (
              <p className="mt-3 text-sm" style={{ color: "#f87171" }}>
                {error}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
