"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Sparkles, UploadCloud } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { memberAPI } from "@/features/settings/api/memberAPI";
import { Member } from "@/@types/member";
import { ResumeData } from "@/@types/resume";
import {
  buildOnboardingPayload,
  onboardingStepSchemas,
} from "@/features/dashboard/utils/onboardingValidation";
import { useRouter } from "next/navigation";

function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  className,
  style,
  minRows = 2,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  minRows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, minRows * 24)}px`;
  }, [value, minRows]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      style={{ ...(style || {}), resize: "none", overflow: "hidden" }}
      rows={minRows}
    />
  );
}

const emptyResumeDraft: ResumeData = {
  personalInfo: {
    fullName: "",
    specializations: [],
    email: "",
    phone: "",
    location: "",
    linkedin: "",
  },
  summary: "",
  workExperience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  languages: [],
};

const resumeDraftKey = (memberId: string) => `resume_draft_${memberId}`;
const onboardingDoneKey = (memberId: string) => `resume_onboarding_done_${memberId}`;

export default function JobDetailsModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);

  const [draft, setDraft] = useState<ResumeData>(emptyResumeDraft);

  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberJobRole, setMemberJobRole] = useState("");
  const [memberCountry, setMemberCountry] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadingCV, setUploadingCV] = useState(false);
  const cvInputRef = useRef<HTMLInputElement | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    "Profile",
    "Summary",
    "Work",
    "Education",
    "Skills",
    "Projects",
    "Extras",
  ];
  const totalSteps = steps.length;

  useEffect(() => {
    (async () => {
      try {
        const member: Member = await memberAPI.get();
        const id = member.memberId || "anonymous";
        setMemberId(id);

        const done = localStorage.getItem(onboardingDoneKey(id)) === "1";
        if (!done) {
          router.push("/onboarding");
          return;
        }
      } catch {
        // If we can't fetch, don't redirect
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    const originalOverscrollBehavior = document.body.style.overscrollBehavior;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscrollBehavior;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [open]);

  const setDraftPersonal = (field: keyof ResumeData["personalInfo"], value: string | string[]) => {
    setDraft((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const validateCurrentStep = async () => {
    const stepErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!draft.personalInfo.fullName.trim()) stepErrors.fullName = "This field needs to be filled.";
      if (!draft.personalInfo.email.trim()) stepErrors.email = "This field needs to be filled.";
      if (!draft.personalInfo.phone.trim()) stepErrors.phone = "This field needs to be filled.";
      if (!draft.personalInfo.location.trim()) stepErrors.location = "This field needs to be filled.";
      if (!draft.personalInfo.linkedin.trim()) stepErrors.linkedin = "This field needs to be filled.";
      if (!draft.personalInfo.specializations.some((s) => s.trim().length > 0)) {
        stepErrors.specializations = "This field needs to be filled.";
      }
    }

    if (currentStep === 3) {
      draft.workExperience.forEach((exp, idx) => {
        if (!exp.role.trim()) stepErrors[`workExperience.${idx}.role`] = "This field needs to be filled.";
        if (!exp.company.trim()) stepErrors[`workExperience.${idx}.company`] = "This field needs to be filled.";
        if (!exp.location.trim()) stepErrors[`workExperience.${idx}.location`] = "This field needs to be filled.";
        if (!exp.period.trim()) stepErrors[`workExperience.${idx}.period`] = "This field needs to be filled.";
        if (!exp.bullets.some((b) => b.trim().length > 0)) stepErrors[`workExperience.${idx}.bullets`] = "This field needs to be filled.";
      });
    }

    if (currentStep === 4) {
      draft.education.forEach((edu, idx) => {
        if (!edu.degree.trim()) stepErrors[`education.${idx}.degree`] = "This field needs to be filled.";
        if (!edu.institution.trim()) stepErrors[`education.${idx}.institution`] = "This field needs to be filled.";
        if (!edu.location.trim()) stepErrors[`education.${idx}.location`] = "This field needs to be filled.";
        if (!edu.period.trim()) stepErrors[`education.${idx}.period`] = "This field needs to be filled.";
      });
    }

    if (currentStep === 5) {
      draft.skills.forEach((skill, idx) => {
        if (!skill.category.trim()) stepErrors[`skills.${idx}.category`] = "This field needs to be filled.";
        if (!skill.items.some((item) => item.trim().length > 0)) stepErrors[`skills.${idx}.items`] = "This field needs to be filled.";
      });
    }

    if (currentStep === 6) {
      (draft.projects || []).forEach((project, idx) => {
        if (!project.name.trim()) stepErrors[`projects.${idx}.name`] = "This field needs to be filled.";
        if (!project.description.trim()) stepErrors[`projects.${idx}.description`] = "This field needs to be filled.";
        if (!project.bullets.some((b) => b.trim().length > 0)) stepErrors[`projects.${idx}.bullets`] = "This field needs to be filled.";
      });
    }

    if (currentStep === 7) {
      if (!memberName.trim()) stepErrors.memberName = "This field needs to be filled.";
      if (!(memberEmail || draft.personalInfo.email || "").trim()) stepErrors.memberEmail = "This field needs to be filled.";
      if (!memberJobRole.trim()) stepErrors.memberJobRole = "This field needs to be filled.";
      if (!memberCountry.trim()) stepErrors.memberCountry = "This field needs to be filled.";
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return false;
    }

    const schema = onboardingStepSchemas[currentStep as keyof typeof onboardingStepSchemas];
    if (!schema) return true;

    const effectiveAccountEmail = (memberEmail || draft.personalInfo.email || "").trim();

    const stepPayloadByNumber: Record<number, Record<string, unknown>> = {
      1: {
        fullName: draft.personalInfo.fullName,
        email: draft.personalInfo.email,
        phone: draft.personalInfo.phone,
        location: draft.personalInfo.location,
        linkedin: draft.personalInfo.linkedin,
        specializations: draft.personalInfo.specializations,
      },
      2: {
        summary: draft.summary,
      },
      3: {
        workExperience: draft.workExperience,
      },
      4: {
        education: draft.education,
      },
      5: {
        skills: draft.skills,
      },
      6: {
        projects: draft.projects || [],
      },
      7: {
        memberName,
        memberEmail: effectiveAccountEmail,
        memberJobRole,
        memberCountry,
      },
    };

    try {
      await schema.validate(stepPayloadByNumber[currentStep], { abortEarly: false });
      setErrors({});
      return true;
    } catch (error: any) {
      const stepErrors: Record<string, string> = {};
      if (Array.isArray(error?.inner)) {
        for (const item of error.inner) {
          if (item?.path && !stepErrors[item.path]) {
            stepErrors[item.path] = item.message;
          }
        }
      } else if (error?.path) {
        stepErrors[error.path] = error.message;
      } else {
        stepErrors.form = "Please fix validation errors before continuing.";
      }
      setErrors(stepErrors);
      return false;
    }
  };

  const handleNext = async () => {
    if (!(await validateCurrentStep())) return;
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const addExperience = () => {
    setDraft((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        { role: "", company: "", location: "", period: "", bullets: [""] },
      ],
    }));
  };

  const addEducation = () => {
    setDraft((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institution: "", location: "", period: "" }],
    }));
  };

  const addSkill = () => {
    setDraft((prev) => ({
      ...prev,
      skills: [...prev.skills, { category: "", items: [] }],
    }));
  };

  const addProject = () => {
    setDraft((prev) => ({
      ...prev,
      projects: [...(prev.projects || []), { name: "", description: "", bullets: [""], year: "" }],
    }));
  };

  const handleCVUpload = async (file: File | null) => {
    if (!file) return;

    const validType = file.type === "application/pdf" || /\.(pdf)$/i.test(file.name);
    if (!validType) {
      setErrors({ form: "Please upload a PDF CV file." });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors({ form: "CV file size must be less than 10MB." });
      return;
    }

    setUploadingCV(true);
    setErrors({});

    try {
      const extracted = await memberAPI.extractOnboardingFromCV(file);

      setMemberJobRole((prev) => (extracted?.jobRole || "").trim() || prev);
      setMemberCountry((prev) => (extracted?.country || "").trim() || prev);

      setDraft((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          phone: (extracted?.phone || "").trim() || prev.personalInfo.phone,
          linkedin: (extracted?.linkedin || "").trim() || prev.personalInfo.linkedin,
          location:
            (extracted?.location || "").trim() ||
            (extracted?.country || "").trim() ||
            prev.personalInfo.location,
          specializations:
            (extracted?.jobRole || "").trim().length > 0
              ? [(extracted.jobRole as string).trim()]
              : prev.personalInfo.specializations,
        },
        summary: (extracted?.summary || "").trim() || prev.summary,
        workExperience:
          Array.isArray(extracted?.experiences) && extracted.experiences.length > 0
            ? extracted.experiences.map((x: any) => ({
                role: x?.role || "",
                company: x?.company || "",
                location: x?.location || "",
                period: x?.period || "",
                bullets: Array.isArray(x?.bullets) ? x.bullets.filter(Boolean) : [],
              }))
            : prev.workExperience,
        education:
          Array.isArray(extracted?.educations) && extracted.educations.length > 0
            ? extracted.educations.map((x: any) => ({
                degree: x?.degree || "",
                institution: x?.institution || "",
                location: x?.location || "",
                period: x?.period || "",
              }))
            : prev.education,
        skills:
          Array.isArray(extracted?.skills) && extracted.skills.length > 0
            ? extracted.skills.map((x: any) => ({
                category: x?.category || "",
                items: Array.isArray(x?.items) ? x.items.filter(Boolean) : [],
              }))
            : prev.skills,
        projects:
          Array.isArray(extracted?.projects) && extracted.projects.length > 0
            ? extracted.projects.map((x: any) => ({
                name: x?.name || "",
                description: x?.description || "",
                bullets: Array.isArray(x?.bullets) ? x.bullets.filter(Boolean) : [],
                year: x?.year || "",
              }))
            : prev.projects,
        certifications:
          Array.isArray(extracted?.certifications) && extracted.certifications.length > 0
            ? extracted.certifications.filter(Boolean)
            : prev.certifications,
        languages:
          Array.isArray(extracted?.languages) && extracted.languages.length > 0
            ? extracted.languages.filter(Boolean)
            : prev.languages,
      }));

      setCurrentStep(1);
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;
      setErrors({ form: backendMessage || "Failed to parse CV. Please try another file." });
    } finally {
      setUploadingCV(false);
      if (cvInputRef.current) cvInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!(await validateCurrentStep())) return;
    setSubmitting(true);
    try {
      const effectiveMemberEmail = (memberEmail || draft.personalInfo.email || "").trim();

      const normalizedDraft: ResumeData = {
        ...draft,
        personalInfo: {
          ...draft.personalInfo,
          fullName: draft.personalInfo.fullName.trim(),
          email: draft.personalInfo.email.trim(),
          location: draft.personalInfo.location.trim(),
          linkedin: draft.personalInfo.linkedin.trim(),
          phone: draft.personalInfo.phone.trim(),
          specializations: draft.personalInfo.specializations.filter(Boolean),
        },
        summary: draft.summary.trim(),
        certifications: draft.certifications?.filter(Boolean) || [],
        languages: draft.languages?.filter(Boolean) || [],
      };

      const payload = buildOnboardingPayload(normalizedDraft, {
        memberName,
        memberEmail: effectiveMemberEmail,
        memberJobRole,
        memberCountry,
      });

      const resolvedMemberId = memberId || "anonymous";
      localStorage.setItem(resumeDraftKey(resolvedMemberId), JSON.stringify(normalizedDraft));

      await memberAPI.update(payload);

      localStorage.setItem(onboardingDoneKey(resolvedMemberId), "1");

      setOpen(false);
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;
      setErrors({ form: backendMessage || error?.message || "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl rounded-2xl border p-6 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
            style={{
              touchAction: "none",
              backgroundColor: "var(--d-surface)",
              borderColor: "var(--d-border)",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "var(--d-accent-blue)" }}
              >
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "var(--d-text-primary)" }}
                >
                  Complete your profile details
                </h2>
                <p
                  className="text-[13px]"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  This appears once after signup for both OAuth and normal accounts
                </p>
              </div>
            </div>

            <div
              className="h-px my-5"
              style={{ backgroundColor: "var(--d-border)" }}
            />

            <div className="mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                {steps.map((label, index) => {
                  const stepNo = index + 1;
                  const active = stepNo === currentStep;
                  const complete = stepNo < currentStep;
                  return (
                    <div key={label} className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full border text-xs font-semibold flex items-center justify-center"
                        style={{
                          borderColor: active || complete ? "var(--d-accent-blue)" : "var(--d-border)",
                          backgroundColor: active ? "var(--d-accent-blue)" : "transparent",
                          color: active ? "#fff" : "var(--d-text-muted)",
                        }}
                      >
                        {stepNo}
                      </div>
                      <span className="text-xs" style={{ color: active ? "var(--d-text-primary)" : "var(--d-text-muted)" }}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="overflow-y-auto flex-1 min-h-0 max-h-[calc(92vh-200px)] pr-1" style={{ scrollbarGutter: "stable" }}>
            <div className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                <div
                  className="rounded-xl border p-3"
                  style={{ borderColor: "var(--d-border)", backgroundColor: "var(--d-surface-muted)" }}
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-[13px] font-medium" style={{ color: "var(--d-text-primary)" }}>
                        Upload CV to auto-fill details
                      </p>
                      <p className="text-[12px]" style={{ color: "var(--d-text-muted)" }}>
                        PDF only, up to 10MB. Existing inputs are preserved if extraction misses a field.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => cvInputRef.current?.click()}
                      disabled={uploadingCV}
                      className="px-3 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-60 inline-flex items-center gap-2"
                      style={{ backgroundColor: "var(--d-accent-blue)" }}
                    >
                      <UploadCloud size={14} />
                      {uploadingCV ? "Analyzing CV..." : "Upload CV"}
                    </button>
                    <input
                      ref={cvInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => handleCVUpload(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium" style={{ color: "var(--d-text-muted)" }}>Full Name</label>
                  <input
                    value={draft.personalInfo.fullName}
                    onChange={(e) => setDraftPersonal("fullName", e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-[14px] focus:outline-none"
                    style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }}
                  />
                  {errors.fullName && <p className="text-[12px] ml-1 text-red-400">{errors.fullName}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium" style={{ color: "var(--d-text-muted)" }}>Email</label>
                  <input
                    value={draft.personalInfo.email}
                    onChange={(e) => setDraftPersonal("email", e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-[14px] focus:outline-none"
                    style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }}
                  />
                  {errors.email && <p className="text-[12px] ml-1 text-red-400">{errors.email}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium" style={{ color: "var(--d-text-muted)" }}>Phone</label>
                  <input
                    value={draft.personalInfo.phone}
                    onChange={(e) => setDraftPersonal("phone", e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-[14px] focus:outline-none"
                    style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }}
                  />
                  {errors.phone && <p className="text-[12px] ml-1 text-red-400">{errors.phone}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium" style={{ color: "var(--d-text-muted)" }}>Location</label>
                  <input
                    value={draft.personalInfo.location}
                    onChange={(e) => setDraftPersonal("location", e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-[14px] focus:outline-none"
                    style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }}
                  />
                  {errors.location && <p className="text-[12px] ml-1 text-red-400">{errors.location}</p>}
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[13px] font-medium" style={{ color: "var(--d-text-muted)" }}>LinkedIn</label>
                  <input
                    value={draft.personalInfo.linkedin}
                    onChange={(e) => setDraftPersonal("linkedin", e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-[14px] focus:outline-none"
                    style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }}
                  />
                  {errors.linkedin && <p className="text-[12px] ml-1 text-red-400">{errors.linkedin}</p>}
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[13px] font-medium" style={{ color: "var(--d-text-muted)" }}>Specializations (comma separated)</label>
                  <input
                    value={draft.personalInfo.specializations.join(", ")}
                    onChange={(e) => setDraftPersonal("specializations", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))}
                    className="w-full rounded-xl px-4 py-3 text-[14px] focus:outline-none"
                    style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }}
                  />
                  {errors.specializations && <p className="text-[12px] ml-1 text-red-400">{errors.specializations}</p>}
                </div>
                </div>
                </div>
              )}

              {currentStep === 2 && (
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium" style={{ color: "var(--d-text-muted)" }}>Summary</label>
                <AutoResizeTextarea
                  value={draft.summary}
                  onChange={(e) => setDraft((prev) => ({ ...prev, summary: e.target.value }))}
                  className="w-full rounded-xl px-4 py-3 text-[14px] focus:outline-none"
                  style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }}
                  minRows={4}
                />
                {errors.summary && <p className="text-[12px] ml-1 text-red-400">{errors.summary}</p>}
              </div>
              )}

              {currentStep === 3 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold" style={{ color: "var(--d-text-primary)" }}>Work Experience</h3>
                  <button type="button" onClick={addExperience} className="p-1 rounded hover:bg-white/10"><Plus size={16} /></button>
                </div>
                {draft.workExperience.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-xl border space-y-2" style={{ borderColor: "var(--d-border)", backgroundColor: "var(--d-surface-muted)" }}>
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setDraft((prev) => ({ ...prev, workExperience: prev.workExperience.filter((_, i) => i !== idx) }))} className="p-1 rounded hover:bg-white/10"><Trash2 size={14} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <input value={exp.role} onChange={(e) => setDraft((prev) => { const list = [...prev.workExperience]; list[idx] = { ...list[idx], role: e.target.value }; return { ...prev, workExperience: list }; })} placeholder="Role" className="w-full rounded-lg px-3 py-2 text-sm" style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }} />
                        {errors[`workExperience.${idx}.role`] && <p className="text-[12px] mt-1 text-red-400">{errors[`workExperience.${idx}.role`]}</p>}
                      </div>
                      <div>
                        <input value={exp.company} onChange={(e) => setDraft((prev) => { const list = [...prev.workExperience]; list[idx] = { ...list[idx], company: e.target.value }; return { ...prev, workExperience: list }; })} placeholder="Company" className="w-full rounded-lg px-3 py-2 text-sm" style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }} />
                        {errors[`workExperience.${idx}.company`] && <p className="text-[12px] mt-1 text-red-400">{errors[`workExperience.${idx}.company`]}</p>}
                      </div>
                      <div>
                        <input value={exp.location} onChange={(e) => setDraft((prev) => { const list = [...prev.workExperience]; list[idx] = { ...list[idx], location: e.target.value }; return { ...prev, workExperience: list }; })} placeholder="Location" className="w-full rounded-lg px-3 py-2 text-sm" style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }} />
                        {errors[`workExperience.${idx}.location`] && <p className="text-[12px] mt-1 text-red-400">{errors[`workExperience.${idx}.location`]}</p>}
                      </div>
                      <div>
                        <input value={exp.period} onChange={(e) => setDraft((prev) => { const list = [...prev.workExperience]; list[idx] = { ...list[idx], period: e.target.value }; return { ...prev, workExperience: list }; })} placeholder="Period" className="w-full rounded-lg px-3 py-2 text-sm" style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }} />
                        {errors[`workExperience.${idx}.period`] && <p className="text-[12px] mt-1 text-red-400">{errors[`workExperience.${idx}.period`]}</p>}
                      </div>
                    </div>
                    <AutoResizeTextarea
                      value={exp.bullets.join("\n")}
                      onChange={(e) => setDraft((prev) => { const list = [...prev.workExperience]; list[idx] = { ...list[idx], bullets: e.target.value.split("\n").filter(Boolean) }; return { ...prev, workExperience: list }; })}
                      placeholder="Bullets (one per line)"
                      className="w-full rounded-lg px-3 py-2 text-sm"
                      style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }}
                      minRows={3}
                    />
                    {errors[`workExperience.${idx}.bullets`] && <p className="text-[12px] mt-1 text-red-400">{errors[`workExperience.${idx}.bullets`]}</p>}
                  </div>
                ))}
              </div>
              )}

              {currentStep === 4 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold" style={{ color: "var(--d-text-primary)" }}>Education</h3>
                  <button type="button" onClick={addEducation} className="p-1 rounded hover:bg-white/10"><Plus size={16} /></button>
                </div>
                {draft.education.map((edu, idx) => (
                  <div key={idx} className="p-4 rounded-xl border space-y-2" style={{ borderColor: "var(--d-border)", backgroundColor: "var(--d-surface-muted)" }}>
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setDraft((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }))} className="p-1 rounded hover:bg-white/10"><Trash2 size={14} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <input value={edu.degree} onChange={(e) => setDraft((prev) => { const list = [...prev.education]; list[idx] = { ...list[idx], degree: e.target.value }; return { ...prev, education: list }; })} placeholder="Degree" className="w-full rounded-lg px-3 py-2 text-sm" style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }} />
                        {errors[`education.${idx}.degree`] && <p className="text-[12px] mt-1 text-red-400">{errors[`education.${idx}.degree`]}</p>}
                      </div>
                      <div>
                        <input value={edu.institution} onChange={(e) => setDraft((prev) => { const list = [...prev.education]; list[idx] = { ...list[idx], institution: e.target.value }; return { ...prev, education: list }; })} placeholder="Institution" className="w-full rounded-lg px-3 py-2 text-sm" style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }} />
                        {errors[`education.${idx}.institution`] && <p className="text-[12px] mt-1 text-red-400">{errors[`education.${idx}.institution`]}</p>}
                      </div>
                      <div>
                        <input value={edu.location} onChange={(e) => setDraft((prev) => { const list = [...prev.education]; list[idx] = { ...list[idx], location: e.target.value }; return { ...prev, education: list }; })} placeholder="Location" className="w-full rounded-lg px-3 py-2 text-sm" style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }} />
                        {errors[`education.${idx}.location`] && <p className="text-[12px] mt-1 text-red-400">{errors[`education.${idx}.location`]}</p>}
                      </div>
                      <div>
                        <input value={edu.period} onChange={(e) => setDraft((prev) => { const list = [...prev.education]; list[idx] = { ...list[idx], period: e.target.value }; return { ...prev, education: list }; })} placeholder="Period" className="w-full rounded-lg px-3 py-2 text-sm" style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }} />
                        {errors[`education.${idx}.period`] && <p className="text-[12px] mt-1 text-red-400">{errors[`education.${idx}.period`]}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}

              {currentStep === 5 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold" style={{ color: "var(--d-text-primary)" }}>Skills</h3>
                  <button type="button" onClick={addSkill} className="p-1 rounded hover:bg-white/10"><Plus size={16} /></button>
                </div>
                {draft.skills.map((skill, idx) => (
                  <div key={idx} className="p-4 rounded-xl border space-y-2" style={{ borderColor: "var(--d-border)", backgroundColor: "var(--d-surface-muted)" }}>
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setDraft((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }))} className="p-1 rounded hover:bg-white/10"><Trash2 size={14} /></button>
                    </div>
                    <div>
                      <input value={skill.category} onChange={(e) => setDraft((prev) => { const list = [...prev.skills]; list[idx] = { ...list[idx], category: e.target.value }; return { ...prev, skills: list }; })} placeholder="Category" className="w-full rounded-lg px-3 py-2 text-sm" style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }} />
                      {errors[`skills.${idx}.category`] && <p className="text-[12px] mt-1 text-red-400">{errors[`skills.${idx}.category`]}</p>}
                    </div>
                    <div>
                      <input value={skill.items.join(", ")} onChange={(e) => setDraft((prev) => { const list = [...prev.skills]; list[idx] = { ...list[idx], items: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) }; return { ...prev, skills: list }; })} placeholder="Items (comma separated)" className="w-full rounded-lg px-3 py-2 text-sm" style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }} />
                      {errors[`skills.${idx}.items`] && <p className="text-[12px] mt-1 text-red-400">{errors[`skills.${idx}.items`]}</p>}
                    </div>
                  </div>
                ))}
              </div>
              )}

              {currentStep === 6 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold" style={{ color: "var(--d-text-primary)" }}>Projects</h3>
                  <button type="button" onClick={addProject} className="p-1 rounded hover:bg-white/10"><Plus size={16} /></button>
                </div>
                {(draft.projects || []).map((project, idx) => (
                  <div key={idx} className="p-4 rounded-xl border space-y-2" style={{ borderColor: "var(--d-border)", backgroundColor: "var(--d-surface-muted)" }}>
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setDraft((prev) => ({ ...prev, projects: (prev.projects || []).filter((_, i) => i !== idx) }))} className="p-1 rounded hover:bg-white/10"><Trash2 size={14} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <input value={project.name} onChange={(e) => setDraft((prev) => { const list = [...(prev.projects || [])]; list[idx] = { ...list[idx], name: e.target.value }; return { ...prev, projects: list }; })} placeholder="Project name" className="w-full rounded-lg px-3 py-2 text-sm" style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }} />
                        {errors[`projects.${idx}.name`] && <p className="text-[12px] mt-1 text-red-400">{errors[`projects.${idx}.name`]}</p>}
                      </div>
                      <input value={project.year || ""} onChange={(e) => setDraft((prev) => { const list = [...(prev.projects || [])]; list[idx] = { ...list[idx], year: e.target.value }; return { ...prev, projects: list }; })} placeholder="Year" className="w-full rounded-lg px-3 py-2 text-sm" style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }} />
                    </div>
                    <AutoResizeTextarea value={project.description} onChange={(e) => setDraft((prev) => { const list = [...(prev.projects || [])]; list[idx] = { ...list[idx], description: e.target.value }; return { ...prev, projects: list }; })} minRows={2} placeholder="Description" className="w-full rounded-lg px-3 py-2 text-sm" style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }} />
                    {errors[`projects.${idx}.description`] && <p className="text-[12px] mt-1 text-red-400">{errors[`projects.${idx}.description`]}</p>}
                    <AutoResizeTextarea value={project.bullets.join("\n")} onChange={(e) => setDraft((prev) => { const list = [...(prev.projects || [])]; list[idx] = { ...list[idx], bullets: e.target.value.split("\n").filter(Boolean) }; return { ...prev, projects: list }; })} minRows={3} placeholder="Bullets (one per line)" className="w-full rounded-lg px-3 py-2 text-sm" style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }} />
                    {errors[`projects.${idx}.bullets`] && <p className="text-[12px] mt-1 text-red-400">{errors[`projects.${idx}.bullets`]}</p>}
                  </div>
                ))}
              </div>
              )}

              {currentStep === 7 && (
              <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium" style={{ color: "var(--d-text-muted)" }}>Certifications (comma separated)</label>
                  <input
                    value={draft.certifications.join(", ")}
                    onChange={(e) => setDraft((prev) => ({ ...prev, certifications: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) }))}
                    className="w-full rounded-xl px-4 py-3 text-[14px] focus:outline-none"
                    style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium" style={{ color: "var(--d-text-muted)" }}>Languages (comma separated)</label>
                  <input
                    value={(draft.languages || []).join(", ")}
                    onChange={(e) => setDraft((prev) => ({ ...prev, languages: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) }))}
                    className="w-full rounded-xl px-4 py-3 text-[14px] focus:outline-none"
                    style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium" style={{ color: "var(--d-text-muted)" }}>Account Name (backend)</label>
                  <input value={memberName} onChange={(e) => setMemberName(e.target.value)} className="w-full rounded-xl px-4 py-3 text-[14px] focus:outline-none" style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }} />
                  {errors.memberName && <p className="text-[12px] ml-1 text-red-400">{errors.memberName}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium" style={{ color: "var(--d-text-muted)" }}>Account Email (backend)</label>
                  <input value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} className="w-full rounded-xl px-4 py-3 text-[14px] focus:outline-none" style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }} />
                  {errors.memberEmail && <p className="text-[12px] ml-1 text-red-400">{errors.memberEmail}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium" style={{ color: "var(--d-text-muted)" }}>Job Role (backend)</label>
                  <input value={memberJobRole} onChange={(e) => setMemberJobRole(e.target.value)} className="w-full rounded-xl px-4 py-3 text-[14px] focus:outline-none" style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }} />
                  {errors.memberJobRole && <p className="text-[12px] ml-1 text-red-400">{errors.memberJobRole}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium" style={{ color: "var(--d-text-muted)" }}>Country (backend)</label>
                  <input value={memberCountry} onChange={(e) => setMemberCountry(e.target.value)} className="w-full rounded-xl px-4 py-3 text-[14px] focus:outline-none" style={{ border: "1px solid var(--d-border)", backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))", color: "var(--d-text-primary)" }} />
                  {errors.memberCountry && <p className="text-[12px] ml-1 text-red-400">{errors.memberCountry}</p>}
                </div>
              </div>

              {errors.form && (
                <p className="text-[13px] text-red-400 text-center">
                  {errors.form}
                </p>
              )}
              </>
              )}
            </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40"
                style={{
                  color: "var(--d-text-primary)",
                  border: "1px solid var(--d-border)",
                  backgroundColor: "var(--d-surface-muted)",
                }}
              >
                Back
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ backgroundColor: "var(--d-accent-blue)" }}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
                  style={{ backgroundColor: "var(--d-accent-blue)" }}
                >
                  {submitting ? "Saving..." : "Save & Continue to Dashboard"}
                </button>
              )}
            </div>

            <p
              className="text-center text-[12px] mt-3"
              style={{ color: "var(--d-text-muted)" }}
            >
              You can update these later in Settings
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
