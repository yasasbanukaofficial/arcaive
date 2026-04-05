"use client";

import React, { useRef, useState } from "react";
import { Plus, Trash2, Sparkles, UploadCloud, Check } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { memberAPI } from "@/features/settings/api/memberAPI";
import { ResumeData } from "@/@types/resume";
import {
  buildOnboardingPayload,
  onboardingStepSchemas,
} from "@/features/dashboard/utils/onboardingValidation";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

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

  React.useEffect(() => {
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

export default function OnboardingForm() {
  const router = useRouter();
  const { addToast } = useToast();
  const [memberId, setMemberId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ResumeData>(emptyResumeDraft);
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberJobRole, setMemberJobRole] = useState("");
  const [memberCountry, setMemberCountry] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cvInputRef = useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const member = await memberAPI.get();
        const id = member.memberId || "anonymous";
        setMemberId(id);
        setMemberName(member.memberFullName || "");
        setMemberEmail(member.memberEmail || "");
        setMemberJobRole(member.jobRole || "");
        setMemberCountry(member.country || "");
        setIsLoggedIn(true);

        const storedDraft = localStorage.getItem(resumeDraftKey(id));
        if (storedDraft) {
          try {
            const parsed = JSON.parse(storedDraft) as ResumeData;
            setDraft(parsed);
          } catch {
            setDraft({
              ...emptyResumeDraft,
              personalInfo: {
                ...emptyResumeDraft.personalInfo,
                fullName: member.memberFullName || "",
                email: member.memberEmail || "",
                location: member.country || "",
                specializations: member.jobRole ? [member.jobRole] : [],
              },
            });
          }
        } else {
          setDraft({
            ...emptyResumeDraft,
            personalInfo: {
              ...emptyResumeDraft.personalInfo,
              fullName: member.memberFullName || "",
              email: member.memberEmail || "",
              location: member.country || "",
              specializations: member.jobRole ? [member.jobRole] : [],
            },
          });
        }
      } catch {
        setIsLoggedIn(false);
        setDraft({
          ...emptyResumeDraft,
          personalInfo: {
            ...emptyResumeDraft.personalInfo,
          },
        });
      }
    })();
  }, []);

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
      2: { summary: draft.summary },
      3: { workExperience: draft.workExperience },
      4: { education: draft.education },
      5: { skills: draft.skills },
      6: { projects: draft.projects || [] },
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
    } catch (error: unknown) {
      const validationError = error as { inner?: { path: string; message: string }[]; path?: string; message?: string };
      const newErrors: Record<string, string> = {};
      if (Array.isArray(validationError?.inner)) {
        for (const item of validationError.inner) {
          if (item?.path && !newErrors[item.path]) {
            newErrors[item.path] = item.message;
          }
        }
      } else if (validationError?.path) {
        newErrors[validationError.path] = validationError.message || "";
      } else {
        newErrors.form = "Please fix validation errors before continuing.";
      }
      setErrors(newErrors);
      return false;
    }
  };

  const handleNext = async () => {
    if (!(await validateCurrentStep())) return;
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            ? extracted.experiences.map((x: unknown) => ({
                role: (x as { role?: string })?.role || "",
                company: (x as { company?: string })?.company || "",
                location: (x as { location?: string })?.location || "",
                period: (x as { period?: string })?.period || "",
                bullets: Array.isArray((x as { bullets?: string[] })?.bullets) 
                  ? (x as { bullets: string[] }).bullets.filter(Boolean) 
                  : [],
              }))
            : prev.workExperience,
        education:
          Array.isArray(extracted?.educations) && extracted.educations.length > 0
            ? extracted.educations.map((x: unknown) => ({
                degree: (x as { degree?: string })?.degree || "",
                institution: (x as { institution?: string })?.institution || "",
                location: (x as { location?: string })?.location || "",
                period: (x as { period?: string })?.period || "",
              }))
            : prev.education,
        skills:
          Array.isArray(extracted?.skills) && extracted.skills.length > 0
            ? extracted.skills.map((x: unknown) => ({
                category: (x as { category?: string })?.category || "",
                items: Array.isArray((x as { items?: string[] })?.items) 
                  ? (x as { items: string[] }).items.filter(Boolean) 
                  : [],
              }))
            : prev.skills,
        projects:
          Array.isArray(extracted?.projects) && extracted.projects.length > 0
            ? extracted.projects.map((x: unknown) => ({
                name: (x as { name?: string })?.name || "",
                description: (x as { description?: string })?.description || "",
                bullets: Array.isArray((x as { bullets?: string[] })?.bullets) 
                  ? (x as { bullets: string[] }).bullets.filter(Boolean) 
                  : [],
                year: (x as { year?: string })?.year || "",
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
      addToast({ type: "success", title: "CV Parsed", description: "Your details have been auto-filled" });
    } catch {
      setErrors({ form: "Failed to parse CV. Please try another file." });
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

      if (isLoggedIn) {
        await memberAPI.update(payload);
        localStorage.setItem(onboardingDoneKey(resolvedMemberId), "1");
        addToast({ type: "success", title: "Profile Complete", description: "Redirecting to dashboard..." });
        setTimeout(() => router.push("/overview"), 1500);
      } else {
        localStorage.setItem("onboarding_complete", "1");
        addToast({ type: "success", title: "Profile Complete", description: "Redirecting to login..." });
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const backendMessage = err?.response?.data?.message;
      setErrors({ form: backendMessage || err?.message || "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 bg-white/[0.03] border border-white/10 transition-all";

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {steps.map((label, index) => {
            const stepNo = index + 1;
            const active = stepNo === currentStep;
            const complete = stepNo < currentStep;
            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full border text-xs font-semibold flex items-center justify-center transition-all"
                  style={{
                    borderColor: active || complete ? "#10b981" : "rgba(255,255,255,0.1)",
                    backgroundColor: active ? "#10b981" : complete ? "#10b981" : "transparent",
                    color: active || complete ? "#fff" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {complete ? <Check size={14} /> : stepNo}
                </div>
                <span className="text-xs" style={{ color: active ? "#fff" : "rgba(255,255,255,0.4)" }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div
              className="rounded-xl border p-4 bg-white/[0.02] border-white/10"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-[13px] font-medium text-gray-300">
                    Upload CV to auto-fill details
                  </p>
                  <p className="text-[12px] text-gray-500">
                    PDF only, up to 10MB. Existing inputs are preserved if extraction misses a field.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => cvInputRef.current?.click()}
                  disabled={uploadingCV}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-400 transition-colors disabled:opacity-60 inline-flex items-center gap-2"
                >
                  <UploadCloud size={14} />
                  {uploadingCV ? "Analyzing..." : "Upload CV"}
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
                <label className="text-[13px] font-medium text-gray-400 ml-1">Full Name</label>
                <input
                  value={draft.personalInfo.fullName}
                  onChange={(e) => setDraftPersonal("fullName", e.target.value)}
                  className={inputClass}
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="text-[12px] ml-1 text-red-400">{errors.fullName}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-gray-400 ml-1">Email</label>
                <input
                  value={draft.personalInfo.email}
                  onChange={(e) => setDraftPersonal("email", e.target.value)}
                  className={inputClass}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-[12px] ml-1 text-red-400">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-gray-400 ml-1">Phone</label>
                <input
                  value={draft.personalInfo.phone}
                  onChange={(e) => setDraftPersonal("phone", e.target.value)}
                  className={inputClass}
                  placeholder="+1 234 567 890"
                />
                {errors.phone && <p className="text-[12px] ml-1 text-red-400">{errors.phone}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-gray-400 ml-1">Location</label>
                <input
                  value={draft.personalInfo.location}
                  onChange={(e) => setDraftPersonal("location", e.target.value)}
                  className={inputClass}
                  placeholder="New York, USA"
                />
                {errors.location && <p className="text-[12px] ml-1 text-red-400">{errors.location}</p>}
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[13px] font-medium text-gray-400 ml-1">LinkedIn</label>
                <input
                  value={draft.personalInfo.linkedin}
                  onChange={(e) => setDraftPersonal("linkedin", e.target.value)}
                  className={inputClass}
                  placeholder="linkedin.com/in/username"
                />
                {errors.linkedin && <p className="text-[12px] ml-1 text-red-400">{errors.linkedin}</p>}
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[13px] font-medium text-gray-400 ml-1">Specializations (comma separated)</label>
                <input
                  value={draft.personalInfo.specializations.join(", ")}
                  onChange={(e) => setDraftPersonal("specializations", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))}
                  className={inputClass}
                  placeholder="Frontend, React, TypeScript"
                />
                {errors.specializations && <p className="text-[12px] ml-1 text-red-400">{errors.specializations}</p>}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-400 ml-1">Professional Summary</label>
            <AutoResizeTextarea
              value={draft.summary}
              onChange={(e) => setDraft((prev) => ({ ...prev, summary: e.target.value }))}
              className={inputClass}
              minRows={4}
              placeholder="Brief overview of your experience and goals..."
            />
            {errors.summary && <p className="text-[12px] ml-1 text-red-400">{errors.summary}</p>}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-300">Work Experience</h3>
              <button type="button" onClick={addExperience} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <Plus size={18} />
              </button>
            </div>
            {draft.workExperience.map((exp, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
                <div className="flex justify-end">
                  <button type="button" onClick={() => setDraft((prev) => ({ ...prev, workExperience: prev.workExperience.filter((_, i) => i !== idx) }))} className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input value={exp.role} onChange={(e) => setDraft((prev) => { const list = [...prev.workExperience]; list[idx] = { ...list[idx], role: e.target.value }; return { ...prev, workExperience: list }; })} placeholder="Role" className={inputClass} />
                    {errors[`workExperience.${idx}.role`] && <p className="text-[12px] mt-1 text-red-400">{errors[`workExperience.${idx}.role`]}</p>}
                  </div>
                  <div>
                    <input value={exp.company} onChange={(e) => setDraft((prev) => { const list = [...prev.workExperience]; list[idx] = { ...list[idx], company: e.target.value }; return { ...prev, workExperience: list }; })} placeholder="Company" className={inputClass} />
                    {errors[`workExperience.${idx}.company`] && <p className="text-[12px] mt-1 text-red-400">{errors[`workExperience.${idx}.company`]}</p>}
                  </div>
                  <div>
                    <input value={exp.location} onChange={(e) => setDraft((prev) => { const list = [...prev.workExperience]; list[idx] = { ...list[idx], location: e.target.value }; return { ...prev, workExperience: list }; })} placeholder="Location" className={inputClass} />
                    {errors[`workExperience.${idx}.location`] && <p className="text-[12px] mt-1 text-red-400">{errors[`workExperience.${idx}.location`]}</p>}
                  </div>
                  <div>
                    <input value={exp.period} onChange={(e) => setDraft((prev) => { const list = [...prev.workExperience]; list[idx] = { ...list[idx], period: e.target.value }; return { ...prev, workExperience: list }; })} placeholder="Period (e.g. 2020-2023)" className={inputClass} />
                    {errors[`workExperience.${idx}.period`] && <p className="text-[12px] mt-1 text-red-400">{errors[`workExperience.${idx}.period`]}</p>}
                  </div>
                </div>
                <AutoResizeTextarea
                  value={exp.bullets.join("\n")}
                  onChange={(e) => setDraft((prev) => { const list = [...prev.workExperience]; list[idx] = { ...list[idx], bullets: e.target.value.split("\n").filter(Boolean) }; return { ...prev, workExperience: list }; })}
                  placeholder="Bullets (one per line)"
                  className={inputClass}
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
              <h3 className="text-sm font-semibold text-gray-300">Education</h3>
              <button type="button" onClick={addEducation} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <Plus size={18} />
              </button>
            </div>
            {draft.education.map((edu, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
                <div className="flex justify-end">
                  <button type="button" onClick={() => setDraft((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }))} className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input value={edu.degree} onChange={(e) => setDraft((prev) => { const list = [...prev.education]; list[idx] = { ...list[idx], degree: e.target.value }; return { ...prev, education: list }; })} placeholder="Degree" className={inputClass} />
                    {errors[`education.${idx}.degree`] && <p className="text-[12px] mt-1 text-red-400">{errors[`education.${idx}.degree`]}</p>}
                  </div>
                  <div>
                    <input value={edu.institution} onChange={(e) => setDraft((prev) => { const list = [...prev.education]; list[idx] = { ...list[idx], institution: e.target.value }; return { ...prev, education: list }; })} placeholder="Institution" className={inputClass} />
                    {errors[`education.${idx}.institution`] && <p className="text-[12px] mt-1 text-red-400">{errors[`education.${idx}.institution`]}</p>}
                  </div>
                  <div>
                    <input value={edu.location} onChange={(e) => setDraft((prev) => { const list = [...prev.education]; list[idx] = { ...list[idx], location: e.target.value }; return { ...prev, education: list }; })} placeholder="Location" className={inputClass} />
                    {errors[`education.${idx}.location`] && <p className="text-[12px] mt-1 text-red-400">{errors[`education.${idx}.location`]}</p>}
                  </div>
                  <div>
                    <input value={edu.period} onChange={(e) => setDraft((prev) => { const list = [...prev.education]; list[idx] = { ...list[idx], period: e.target.value }; return { ...prev, education: list }; })} placeholder="Period" className={inputClass} />
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
              <h3 className="text-sm font-semibold text-gray-300">Skills</h3>
              <button type="button" onClick={addSkill} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <Plus size={18} />
              </button>
            </div>
            {draft.skills.map((skill, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
                <div className="flex justify-end">
                  <button type="button" onClick={() => setDraft((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }))} className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div>
                  <input value={skill.category} onChange={(e) => setDraft((prev) => { const list = [...prev.skills]; list[idx] = { ...list[idx], category: e.target.value }; return { ...prev, skills: list }; })} placeholder="Category (e.g. Programming Languages)" className={inputClass} />
                  {errors[`skills.${idx}.category`] && <p className="text-[12px] mt-1 text-red-400">{errors[`skills.${idx}.category`]}</p>}
                </div>
                <div>
                  <input value={skill.items.join(", ")} onChange={(e) => setDraft((prev) => { const list = [...prev.skills]; list[idx] = { ...list[idx], items: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) }; return { ...prev, skills: list }; })} placeholder="Items (comma separated, e.g. JavaScript, TypeScript, Python)" className={inputClass} />
                  {errors[`skills.${idx}.items`] && <p className="text-[12px] mt-1 text-red-400">{errors[`skills.${idx}.items`]}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-300">Projects</h3>
              <button type="button" onClick={addProject} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <Plus size={18} />
              </button>
            </div>
            {(draft.projects || []).map((project, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
                <div className="flex justify-end">
                  <button type="button" onClick={() => setDraft((prev) => ({ ...prev, projects: (prev.projects || []).filter((_, i) => i !== idx) }))} className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input value={project.name} onChange={(e) => setDraft((prev) => { const list = [...(prev.projects || [])]; list[idx] = { ...list[idx], name: e.target.value }; return { ...prev, projects: list }; })} placeholder="Project name" className={inputClass} />
                    {errors[`projects.${idx}.name`] && <p className="text-[12px] mt-1 text-red-400">{errors[`projects.${idx}.name`]}</p>}
                  </div>
                  <input value={project.year || ""} onChange={(e) => setDraft((prev) => { const list = [...(prev.projects || [])]; list[idx] = { ...list[idx], year: e.target.value }; return { ...prev, projects: list }; })} placeholder="Year" className={inputClass} />
                </div>
                <AutoResizeTextarea value={project.description} onChange={(e) => setDraft((prev) => { const list = [...(prev.projects || [])]; list[idx] = { ...list[idx], description: e.target.value }; return { ...prev, projects: list }; })} minRows={2} placeholder="Description" className={inputClass} />
                {errors[`projects.${idx}.description`] && <p className="text-[12px] mt-1 text-red-400">{errors[`projects.${idx}.description`]}</p>}
                <AutoResizeTextarea value={project.bullets.join("\n")} onChange={(e) => setDraft((prev) => { const list = [...(prev.projects || [])]; list[idx] = { ...list[idx], bullets: e.target.value.split("\n").filter(Boolean) }; return { ...prev, projects: list }; })} minRows={3} placeholder="Bullets (one per line)" className={inputClass} />
                {errors[`projects.${idx}.bullets`] && <p className="text-[12px] mt-1 text-red-400">{errors[`projects.${idx}.bullets`]}</p>}
              </div>
            ))}
          </div>
        )}

        {currentStep === 7 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-gray-400 ml-1">Certifications (comma separated)</label>
                <input
                  value={draft.certifications.join(", ")}
                  onChange={(e) => setDraft((prev) => ({ ...prev, certifications: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) }))}
                  className={inputClass}
                  placeholder="AWS Solutions Architect, PMP"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-gray-400 ml-1">Languages (comma separated)</label>
                <input
                  value={(draft.languages || []).join(", ")}
                  onChange={(e) => setDraft((prev) => ({ ...prev, languages: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) }))}
                  className={inputClass}
                  placeholder="English, Spanish, French"
                />
              </div>
            </div>

            <div className="h-px bg-white/5 my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-gray-400 ml-1">Account Name</label>
                <input value={memberName} onChange={(e) => setMemberName(e.target.value)} className={inputClass} placeholder="Your name" />
                {errors.memberName && <p className="text-[12px] ml-1 text-red-400">{errors.memberName}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-gray-400 ml-1">Account Email</label>
                <input value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} className={inputClass} placeholder="account@example.com" />
                {errors.memberEmail && <p className="text-[12px] ml-1 text-red-400">{errors.memberEmail}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-gray-400 ml-1">Job Role</label>
                <input value={memberJobRole} onChange={(e) => setMemberJobRole(e.target.value)} className={inputClass} placeholder="Software Engineer" />
                {errors.memberJobRole && <p className="text-[12px] ml-1 text-red-400">{errors.memberJobRole}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-gray-400 ml-1">Country</label>
                <input value={memberCountry} onChange={(e) => setMemberCountry(e.target.value)} className={inputClass} placeholder="United States" />
                {errors.memberCountry && <p className="text-[12px] ml-1 text-red-400">{errors.memberCountry}</p>}
              </div>
            </div>

            {errors.form && (
              <p className="text-[13px] text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-xl py-3">
                {errors.form}
              </p>
            )}
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="px-6 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-white/5 hover:bg-white/10"
        >
          Back
        </button>

        {currentStep < totalSteps ? (
          <Button
            type="button"
            onClick={handleNext}
            variant="white"
            size="lg"
            className="font-semibold"
          >
            Continue
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            variant="white"
            size="lg"
            className="font-semibold"
          >
            {submitting ? "Saving..." : "Complete Profile"}
          </Button>
        )}
      </div>

      <p className="text-center text-[12px] text-gray-500">
        Step {currentStep} of {totalSteps} - You can update these later in Settings
      </p>
    </div>
  );
}
