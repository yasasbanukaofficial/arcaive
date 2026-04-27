"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Check, 
  Layout
} from "lucide-react";
import { 
  ResumeClassic, 
  ResumeModern, 
  ResumeMinimal, 
  ResumeBold 
} from "@/components/pdf/ResumeTemplate";
import { dashboardStagger, fadeUp, scaleIn } from "@/components/animations/animations";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import TextArea from "@/components/ui/TextArea";
import { useToast } from "@/components/ui/Toast";
import { ResumeData, WorkExperience, Education, SkillCategory, Project } from "@/@types/resume";
import { memberAPI } from "@/features/settings/api/memberAPI";
import { MemberIdentityData, MemberProfileDTO } from "@/@types/member";
import { TAILORED_CV_DRAFT_KEY } from "@/features/cv-analysis/constants/tailoredDraft";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const emptyResumeData: ResumeData = {
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

const trimOrEmpty = (value?: string | null) => (value || "").trim();

const hasText = (value?: string | null) => trimOrEmpty(value).length > 0;

const pickText = (draftValue: string | undefined, seedValue: string) =>
  hasText(draftValue) ? (draftValue as string).trim() : seedValue;

const pickArray = <T,>(draftValue: T[] | undefined, seedValue: T[]) =>
  Array.isArray(draftValue) && draftValue.length > 0 ? draftValue : seedValue;

const mapProfileToResumeSections = (profile: MemberProfileDTO) => ({
  summary: trimOrEmpty(profile.summary),
  workExperience: (profile.experiences || []).map((x) => ({
    role: x.role || "",
    company: x.company || "",
    location: x.location || "",
    period: x.period || "",
    bullets: Array.isArray(x.bullets) && x.bullets.length > 0 ? x.bullets : [""],
  })),
  education: (profile.educations || []).map((x) => ({
    degree: x.degree || "",
    institution: x.institution || "",
    location: x.location || "",
    period: x.period || "",
  })),
  skills: (profile.skills || []).map((x) => ({
    category: x.category || "",
    items: Array.isArray(x.items) ? x.items : [],
  })),
  certifications: Array.isArray(profile.certifications) ? profile.certifications : [],
  projects: (profile.projects || []).map((x) => ({
    name: x.name || "",
    description: x.description || "",
    bullets: Array.isArray(x.bullets) && x.bullets.length > 0 ? x.bullets : [""],
    year: x.year || "",
  })),
  languages: Array.isArray(profile.languages) ? profile.languages : [],
});

const resolveTailoredProfile = (payload: unknown): MemberProfileDTO | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const root = payload as Record<string, unknown>;
  const directProfile = root.profile;
  const nestedData = root.data;

  const candidate =
    (directProfile && typeof directProfile === "object" ? directProfile : null) ||
    (nestedData && typeof nestedData === "object" ? nestedData : null) ||
    root;

  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const hasProfileSignal = ["jobRole", "summary", "experiences", "skills", "projects"].some(
    (key) => key in (candidate as Record<string, unknown>),
  );

  return hasProfileSignal ? (candidate as MemberProfileDTO) : null;
};

type TemplateType = "classic" | "modern" | "minimal" | "bold" | null;

const templates = [
  { 
    id: "classic" as const, 
    name: "Classic", 
    tag: "ATS Optimized", 
    color: "#0a0a0a",
    mockup: (
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="w-1/3 h-2 bg-slate-800  mb-1" />
        <div className="w-full h-0.5 bg-slate-200" />
        <div className="w-full flex flex-col gap-1.5 mt-2">
          <div className="w-full h-1 bg-slate-200 " />
          <div className="w-3/4 h-1 bg-slate-200 " />
          <div className="w-full h-1 bg-slate-200  mt-2" />
          <div className="w-1/2 h-1.5 bg-slate-300 " />
          <div className="w-full h-1 bg-slate-100 " />
        </div>
      </div>
    )
  },
  { 
    id: "modern" as const, 
    name: "Modern", 
    tag: "Modern Clean", 
    color: "#2563eb",
    mockup: (
      <div className="flex w-full h-full gap-2">
        <div className="w-1/3 bg-[#0f172a]  p-2 flex flex-col gap-2">
          <div className="w-full h-1.5 bg-[var(--glass-bg)] opacity-20 " />
          <div className="w-3/4 h-1 bg-[var(--glass-bg)] opacity-10 " />
          <div className="w-full h-1 bg-[var(--glass-bg)] opacity-10  mt-4" />
          <div className="w-full h-1 bg-[var(--glass-bg)] opacity-10 " />
        </div>
        <div className="flex-1 flex flex-col gap-2 pt-2">
          <div className="w-1/2 h-1.5 bg-slate-300 " />
          <div className="w-full h-0.5 bg-slate-100" />
          <div className="w-full h-1 bg-slate-200 " />
          <div className="w-full h-1 bg-slate-200 " />
        </div>
      </div>
    )
  },
  { 
    id: "minimal" as const, 
    name: "Minimal", 
    tag: "Clean & Simple", 
    color: "#555555",
    mockup: (
      <div className="flex flex-col gap-4 w-full px-4">
        <div className="w-1/2 h-2.5 bg-slate-800 " />
        <div className="w-full h-[0.5px] bg-slate-300" />
        <div className="w-full flex flex-col gap-3">
          <div className="w-1/4 h-1.5 bg-slate-400  mt-4" />
          <div className="w-full h-1 bg-slate-100 " />
          <div className="w-full h-1 bg-slate-100 " />
          <div className="w-1/4 h-1.5 bg-slate-400  mt-2" />
          <div className="w-full h-1 bg-slate-100 " />
        </div>
      </div>
    )
  },
  { 
    id: "bold" as const, 
    name: "Bold", 
    tag: "Strong Impact", 
    color: "#111111",
    mockup: (
      <div className="flex flex-col w-full h-full">
        <div className="w-full h-[30%] bg-[#111111] -sm p-3 flex flex-col gap-2">
          <div className="w-3/4 h-2.5 bg-[var(--glass-bg)] opacity-90 " />
          <div className="w-1/2 h-1.5 bg-[var(--glass-bg)] opacity-40 " />
        </div>
        <div className="flex-1 p-3 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 bg-[#111111]" />
            <div className="w-1/4 h-2 bg-slate-800 " />
          </div>
          <div className="w-full h-1 bg-slate-200 " />
          <div className="w-full h-1 bg-slate-200 " />
        </div>
      </div>
    )
  }
];

const steps = [
  { id: 1, title: "Personal Info", subtitle: "How can employers reach you?" },
  { id: 2, title: "Summary", subtitle: "Briefly describe your career path" },
  { id: 3, title: "Experience", subtitle: "Tell us about your work history (Max 3)" },
  { id: 4, title: "Education", subtitle: "Where did you study?" },
  { id: 5, title: "Skills & Certs", subtitle: "What are you best at?" },
  { id: 6, title: "Projects", subtitle: "Showcase your best work (Optional)" }
];

export default function CreateCVPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ResumeData>(emptyResumeData);
  const [stage, setStage] = useState(1);
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToast();
  
  const hasPreviewedRef = useRef(false);
  if (stage === 3 && !hasPreviewedRef.current) {
    hasPreviewedRef.current = true;
  }

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        // 1. Use tailored draft only when this page is opened from jobs flow.
        const source = searchParams.get("source");
        const jobIdFromUrl = searchParams.get("jobId");
        const isTailoredFlow = source === "tailored";

        const tailoredDraftRaw = isTailoredFlow
          ? sessionStorage.getItem(TAILORED_CV_DRAFT_KEY)
          : null;

        if (tailoredDraftRaw) {
          try {
            const parsed = JSON.parse(tailoredDraftRaw);
            const draftJobId = typeof parsed?.jobId === "string" ? parsed.jobId : "";
            const jobMatches = !jobIdFromUrl || !draftJobId || draftJobId === jobIdFromUrl;
            const tailoredProfile = resolveTailoredProfile(parsed);

            if (tailoredProfile && jobMatches) {
              const tailoredSections = mapProfileToResumeSections(tailoredProfile);

              // We still need member identity for basic info like name/email 
              // but we prefer tailored data for content
              const memberData: MemberIdentityData = await memberAPI.get();

              setData({
                ...emptyResumeData,
                ...tailoredSections,
                personalInfo: {
                  fullName: trimOrEmpty(memberData.memberFullName),
                  email: trimOrEmpty(memberData.memberEmail),
                  phone: trimOrEmpty(tailoredProfile.phone) || trimOrEmpty(memberData.phone),
                  location: trimOrEmpty(tailoredProfile.location) || trimOrEmpty(tailoredProfile.country) || trimOrEmpty(memberData.location) || trimOrEmpty(memberData.country),
                  linkedin: trimOrEmpty(tailoredProfile.linkedin) || trimOrEmpty(memberData.linkedAccounts?.find(a => a.provider?.toLowerCase() === "linkedin")?.url),
                  specializations: [tailoredProfile.jobRole, tailoredProfile.experience]
                    .map(v => trimOrEmpty(v))
                    .filter(Boolean),
                },
              });
              
              // Clear session to avoid using it again on refresh
              sessionStorage.removeItem(TAILORED_CV_DRAFT_KEY);
              return;
            }

            if (!jobMatches) {
              console.warn("Ignoring tailored draft due to jobId mismatch");
            }
          } catch (e) {
            console.error("Failed to parse tailored draft", e);
          }
        }

        // 2. Normal flow: Fetch member data and check for manual drafts
        const memberData: MemberIdentityData = await memberAPI.get();
        if (memberData) {
          const memberId = memberData.memberId || "anonymous";
          const storedDraftRaw = localStorage.getItem(`resume_draft_${memberId}`);
          const storedDraft = storedDraftRaw ? (JSON.parse(storedDraftRaw) as ResumeData) : null;
          
          const linkedInUrl = memberData.linkedAccounts?.find(
            (account) => account.provider?.toLowerCase() === "linkedin",
          )?.url;

          const profileSeed: ResumeData = {
            ...emptyResumeData,
            personalInfo: {
              ...emptyResumeData.personalInfo,
              fullName: trimOrEmpty(memberData.memberFullName),
              email: trimOrEmpty(memberData.memberEmail),
              phone: trimOrEmpty(memberData.phone),
              location: trimOrEmpty(memberData.location) || trimOrEmpty(memberData.country),
              linkedin: trimOrEmpty(linkedInUrl),
              specializations: [memberData.jobRole, memberData.experience]
                .map((value) => trimOrEmpty(value))
                .filter(Boolean),
            },
            summary: trimOrEmpty(memberData.summary),
            workExperience: (memberData.experiences || []).map((x) => ({
              role: x.role || "",
              company: x.company || "",
              location: x.location || "",
              period: x.period || "",
              bullets: Array.isArray(x.bullets) && x.bullets.length > 0 ? x.bullets : [""],
            })),
            education: (memberData.educations || []).map((x) => ({
              degree: x.degree || "",
              institution: x.institution || "",
              location: x.location || "",
              period: x.period || "",
            })),
            skills: (memberData.skills || []).map((x) => ({
              category: x.category || "",
              items: Array.isArray(x.items) ? x.items : [],
            })),
            certifications: Array.isArray(memberData.certifications)
              ? memberData.certifications
              : [],
            projects: (memberData.projects || []).map((x) => ({
              name: x.name || "",
              description: x.description || "",
              bullets: Array.isArray(x.bullets) && x.bullets.length > 0 ? x.bullets : [""],
              year: x.year || "",
            })),
            languages: Array.isArray(memberData.languages) ? memberData.languages : [],
          };

          if (storedDraft) {
            setData({
              ...profileSeed,
              ...storedDraft,
              personalInfo: {
                ...profileSeed.personalInfo,
                ...(storedDraft.personalInfo || {}),
                fullName: pickText(storedDraft.personalInfo?.fullName, profileSeed.personalInfo.fullName),
                email: pickText(storedDraft.personalInfo?.email, profileSeed.personalInfo.email),
                phone: pickText(storedDraft.personalInfo?.phone, profileSeed.personalInfo.phone),
                location: pickText(storedDraft.personalInfo?.location, profileSeed.personalInfo.location),
                linkedin: pickText(storedDraft.personalInfo?.linkedin, profileSeed.personalInfo.linkedin),
                specializations:
                  storedDraft.personalInfo?.specializations?.some((value) => value.trim())
                    ? storedDraft.personalInfo.specializations.filter((value) => value.trim())
                    : profileSeed.personalInfo.specializations,
              },
              summary: pickText(storedDraft.summary, profileSeed.summary),
              workExperience:
                pickArray(storedDraft.workExperience, profileSeed.workExperience),
              education:
                pickArray(storedDraft.education, profileSeed.education),
              skills:
                pickArray(storedDraft.skills, profileSeed.skills),
              projects:
                pickArray(storedDraft.projects, profileSeed.projects || []),
              certifications:
                pickArray(storedDraft.certifications, profileSeed.certifications),
              languages:
                pickArray(storedDraft.languages, profileSeed.languages || []),
            });
          } else {
            setData(profileSeed);
          }
        }
      } catch (error) {
        console.error("Failed to fetch member data", error);
        setData(emptyResumeData);
      }
    };
    fetchMemberData();
  }, [searchParams]);

  const ActiveResume = () => {
    switch (selectedTemplate) {
      case "classic": return <ResumeClassic data={data} />;
      case "modern": return <ResumeModern data={data} />;
      case "minimal": return <ResumeMinimal data={data} />;
      case "bold": return <ResumeBold data={data} />;
      default: return <ResumeClassic data={data} />;
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast({
        type: "success",
        title: "Resume Saved",
        description: "Your professional CV has been saved to your profile.",
      });
    }, 1000);
  };

  const updatePersonalInfo = (field: keyof ResumeData["personalInfo"], value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addExperience = () => {
    if (data.workExperience.length >= 3) {
      addToast({
        type: "error",
        title: "Limit Reached",
        description: "You can only add up to 3 work experiences.",
      });
      return;
    }
    const newExp: WorkExperience = { role: "", company: "", location: "", period: "", bullets: [""] };
    setData(prev => ({ ...prev, workExperience: [...prev.workExperience, newExp] }));
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: any) => {
    setData(prev => {
      const newExp = [...prev.workExperience];
      newExp[index] = { ...newExp[index], [field]: value };
      return { ...prev, workExperience: newExp };
    });
  };

  const removeExperience = (index: number) => {
    setData(prev => ({ ...prev, workExperience: prev.workExperience.filter((_, i) => i !== index) }));
  };

  const addEducation = () => {
    const newEdu: Education = { degree: "", institution: "", location: "", period: "" };
    setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setData(prev => {
      const newEdu = [...prev.education];
      newEdu[index] = { ...newEdu[index], [field]: value };
      return { ...prev, education: newEdu };
    });
  };

  const addSkillCategory = () => {
    const newCat: SkillCategory = { category: "", items: [] };
    setData(prev => ({ ...prev, skills: [...prev.skills, newCat] }));
  };

  const updateSkillCategory = (index: number, category: string) => {
    setData(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = { ...newSkills[index], category };
      return { ...prev, skills: newSkills };
    });
  };

  const updateSkillItems = (index: number, itemsString: string) => {
    setData(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = { ...newSkills[index], items: itemsString.split(",").map(s => s.trim()).filter(Boolean) };
      return { ...prev, skills: newSkills };
    });
  };

  const addProject = () => {
    const newProj: Project = { name: "", description: "", bullets: [""], year: "" };
    setData(prev => ({ ...prev, projects: [...(prev.projects || []), newProj] }));
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    setData(prev => {
      const newProjs = [...(prev.projects || [])];
      newProjs[index] = { ...newProjs[index], [field]: value };
      return { ...prev, projects: newProjs };
    });
  };

  const removeProject = (index: number) => {
    setData(prev => ({ ...prev, projects: (prev.projects || []).filter((_, i) => i !== index) }));
  };

  const addCertification = () => {
    setData(prev => ({ ...prev, certifications: [...prev.certifications, ""] }));
  };

  const updateCertification = (index: number, value: string) => {
    setData(prev => {
      const newCerts = [...prev.certifications];
      newCerts[index] = value;
      return { ...prev, certifications: newCerts };
    });
  };

  const removeCertification = (index: number) => {
    setData(prev => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== index) }));
  };

  const handleNextStep = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      setStage(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setStage(1);
    }
  };

  const renderTemplateGallery = () => (
    <motion.div variants={dashboardStagger()} initial="hidden" animate="show" className="space-y-12">
      <motion.div variants={fadeUp} className="border-b border-[var(--glass-border)] pb-8">
        <h1 className="font-sans text-[20px] font-bold text-[var(--text-primary)] uppercase tracking-tight">
          Choose a Template
        </h1>
        <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mt-2">
          Pick a style to get started
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {templates.map((tpl) => {
          const isSelected = selectedTemplate === tpl.id;
          return (
            <motion.div
              key={tpl.id}
              variants={fadeUp}
              className="group cursor-pointer flex flex-col"
              onClick={() => {
                setSelectedTemplate(tpl.id);
                setStage(2);
                setStep(1);
              }}
            >
              <div 
                className={`
                  relative aspect-[3/4] p-8 bg-[var(--glass-border)] border  flex items-center justify-center overflow-hidden
                  ${isSelected ? "border-[var(--text-primary)] border-2" : "border-[var(--glass-border)] group-hover:border-[var(--text-primary)]"}
                `}
                style={{ borderRadius: 0 }}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-black px-2 py-1">
                    <span className="font-mono text-[10px] text-white font-bold uppercase tracking-widest">
                      SELECTED
                    </span>
                  </div>
                )}
                <div className="w-full scale-110 opacity-80 group-hover:opacity-100 transition-opacity">
                  {tpl.mockup}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h3 className="font-mono text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-widest">
                  {tpl.name}
                </h3>
                <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">
                  {tpl.tag}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TextField label="Full Name" value={data.personalInfo.fullName} onChange={(e) => updatePersonalInfo("fullName", e.target.value)} />
            <TextField label="Email" value={data.personalInfo.email} onChange={(e) => updatePersonalInfo("email", e.target.value)} />
            <TextField label="Phone" value={data.personalInfo.phone} onChange={(e) => updatePersonalInfo("phone", e.target.value)} />
            <TextField label="Location" value={data.personalInfo.location} onChange={(e) => updatePersonalInfo("location", e.target.value)} />
            <TextField label="LinkedIn" value={data.personalInfo.linkedin} onChange={(e) => updatePersonalInfo("linkedin", e.target.value)} />
            <TextField 
              label="Specializations (Comma separated)" 
              value={data.personalInfo.specializations.join(", ")} 
              onChange={(e) => setData(prev => ({
                ...prev,
                personalInfo: {
                  ...prev.personalInfo,
                  specializations: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                }
              }))} 
            />
          </div>
        );
      case 2:
        return <TextArea label="Professional Summary" value={data.summary} onChange={(e) => setData(prev => ({ ...prev, summary: e.target.value }))} placeholder="A brief overview of your career and skills..." rows={8} />;
      case 3:
        return (
          <div className="space-y-10">
            <div className="flex justify-between items-end border-b border-[var(--glass-border)] pb-4">
              <div>
                <h3 className="font-sans text-[16px] font-bold text-[var(--text-primary)] uppercase">Work Experience</h3>
                <p className="font-mono text-[10px] text-[var(--text-secondary)] mt-1">MAX 3 ENTRIES ALLOWED</p>
              </div>
              <button 
                className="btn-ghost px-4 py-2 text-[11px]"
                onClick={addExperience}
                disabled={data.workExperience.length >= 3}
              >
                + ADD EXPERIENCE
              </button>
            </div>
            <div className="space-y-6">
              {data.workExperience.map((exp, idx) => (
                <div key={idx} className="p-8 bg-[var(--glass-border)] border border-[var(--glass-border)] space-y-6 relative">
                  <button 
                    onClick={() => removeExperience(idx)} 
                    className="absolute top-6 right-8 font-mono text-[11px] text-[var(--text-secondary)] hover:text-[#D83B2A] transition-colors"
                  >
                    [ REMOVE ]
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField label="Role" value={exp.role} onChange={(e) => updateExperience(idx, "role", e.target.value)} />
                    <TextField label="Company" value={exp.company} onChange={(e) => updateExperience(idx, "company", e.target.value)} />
                    <TextField label="Period" value={exp.period} onChange={(e) => updateExperience(idx, "period", e.target.value)} />
                    <TextField label="Location" value={exp.location} onChange={(e) => updateExperience(idx, "location", e.target.value)} />
                  </div>
                  <TextArea label="Bullets (One per line)" value={exp.bullets.join("\n")} onChange={(e) => updateExperience(idx, "bullets", e.target.value.split("\n"))} rows={4} />
                </div>
              ))}
              {data.workExperience.length === 0 && (
                <div className="text-center py-16 border border-dashed border-[var(--glass-border)]">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">NO_EXPERIENCE_ADDED</p>
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-10">
            <div className="flex justify-between items-end border-b border-[var(--glass-border)] pb-4">
              <h3 className="font-sans text-[16px] font-bold text-[var(--text-primary)] uppercase">Education</h3>
              <button 
                className="btn-ghost px-4 py-2 text-[11px]" 
                onClick={addEducation}
              >
                + ADD EDUCATION
              </button>
            </div>
            <div className="space-y-6">
              {data.education.map((edu, idx) => (
                <div key={idx} className="p-8 bg-[var(--glass-border)] border border-[var(--glass-border)] space-y-6 relative">
                  <button 
                    onClick={() => setData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }))} 
                    className="absolute top-6 right-8 font-mono text-[11px] text-[var(--text-secondary)] hover:text-[#D83B2A] transition-colors"
                  >
                    [ REMOVE ]
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField label="Degree" value={edu.degree} onChange={(e) => updateEducation(idx, "degree", e.target.value)} />
                    <TextField label="Institution" value={edu.institution} onChange={(e) => updateEducation(idx, "institution", e.target.value)} />
                    <TextField label="Period" value={edu.period} onChange={(e) => updateEducation(idx, "period", e.target.value)} />
                    <TextField label="Location" value={edu.location} onChange={(e) => updateEducation(idx, "location", e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-12">
            <div className="space-y-8">
              <div className="flex items-end justify-between border-b border-[var(--glass-border)] pb-4">
                <h3 className="font-sans text-[16px] font-bold text-[var(--text-primary)] uppercase">Skill Categories</h3>
                <button 
                  className="btn-ghost px-4 py-2 text-[11px]" 
                  onClick={addSkillCategory}
                >
                  + ADD CATEGORY
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {data.skills.map((cat, idx) => (
                  <div key={idx} className="p-8 bg-[var(--glass-border)] border border-[var(--glass-border)] space-y-6 relative">
                    <button 
                      onClick={() => setData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }))} 
                      className="absolute top-6 right-8 font-mono text-[11px] text-[var(--text-secondary)] hover:text-[#D83B2A] transition-colors"
                    >
                      [ REMOVE ]
                    </button>
                    <TextField label="Category Name" value={cat.category} onChange={(e) => updateSkillCategory(idx, e.target.value)} />
                    <TextArea label="Items (Comma separated)" value={cat.items.join(", ")} onChange={(e) => updateSkillItems(idx, e.target.value)} rows={2} />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-sans text-[16px] font-bold text-[var(--text-primary)] uppercase border-b border-[var(--glass-border)] pb-4">Languages</h3>
              <TextField 
                placeholder="English, French, etc." 
                value={data.languages?.join(", ") || ""} 
                onChange={(e) => setData(prev => ({ ...prev, languages: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))} 
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-end justify-between border-b border-[var(--glass-border)] pb-4">
                <h3 className="font-sans text-[16px] font-bold text-[var(--text-primary)] uppercase">Certifications</h3>
                <button 
                  className="btn-ghost px-4 py-2 text-[11px]" 
                  onClick={addCertification}
                >
                  + ADD CERTIFICATION
                </button>
              </div>
              <div className="space-y-4">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <TextField className="flex-1" placeholder="e.g. AWS Certified Solutions Architect" value={cert} onChange={(e) => updateCertification(idx, e.target.value)} />
                    <button 
                      onClick={() => removeCertification(idx)} 
                      className="mt-10 font-mono text-[11px] text-[var(--text-secondary)] hover:text-[#D83B2A] transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-10">
            <div className="flex justify-between items-end border-b border-[var(--glass-border)] pb-4">
              <h3 className="font-sans text-[16px] font-bold text-[var(--text-primary)] uppercase">Projects</h3>
              <button 
                className="btn-ghost px-4 py-2 text-[11px]" 
                onClick={addProject}
              >
                + ADD PROJECT
              </button>
            </div>
            <div className="space-y-6">
              {(data.projects || []).map((proj, idx) => (
                <div key={idx} className="p-8 bg-[var(--glass-border)] border border-[var(--glass-border)] space-y-6 relative">
                  <button 
                    onClick={() => removeProject(idx)} 
                    className="absolute top-6 right-8 font-mono text-[11px] text-[var(--text-secondary)] hover:text-[#D83B2A] transition-colors"
                  >
                    [ REMOVE ]
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField label="Project Name" value={proj.name} onChange={(e) => updateProject(idx, "name", e.target.value)} />
                    <TextField label="Year" value={proj.year || ""} onChange={(e) => updateProject(idx, "year", e.target.value)} />
                  </div>
                  <TextField label="Description" value={proj.description} onChange={(e) => updateProject(idx, "description", e.target.value)} />
                  <TextArea label="Bullets (One per line)" value={proj.bullets.join("\n")} onChange={(e) => updateProject(idx, "bullets", e.target.value.split("\n"))} rows={3} />
                </div>
              ))}
              {(!data.projects || data.projects.length === 0) && (
                <div className="text-center py-16 border border-dashed border-[var(--glass-border)]">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">NO_PROJECTS_ADDED</p>
                </div>
              )}
            </div>
          </div>
        );
      default: return null;
    }
  };

  const renderWizard = () => (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] border border-[var(--glass-border)] bg-[var(--glass-bg)] overflow-hidden">
      {/* Left: Form Side */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Step Indicator */}
        <div className="px-12 py-8 border-b border-[var(--glass-border)] flex items-center gap-6 overflow-x-auto no-scrollbar bg-[var(--glass-bg)]">
          <button 
            onClick={() => setStage(1)} 
            className="p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-6">
            {steps.map((s, i) => {
              const isCurrent = step === s.id;
              const isCompleted = step > s.id;
              return (
                <React.Fragment key={s.id}>
                  <div 
                    className={`
                      flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest whitespace-nowrap pb-1 
                      ${isCurrent ? "text-[var(--text-primary)] border-b border-[var(--glass-border)]" : "text-[var(--text-secondary)]"}
                    `}
                  >
                    {isCompleted && <span>✓</span>}
                    <span>{String(s.id).padStart(2, '0')} {s.title}</span>
                  </div>
                  {i < steps.length - 1 && <span className="text-[#E8E6DE]">—</span>}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-12 no-scrollbar bg-[var(--glass-bg)]">
          <motion.div key={step} initial="hidden" animate="show" variants={fadeUp}>
             <div className="mb-12">
               <h2 className="font-sans text-[20px] font-bold text-[var(--text-primary)] uppercase tracking-tight">{steps[step - 1].title}</h2>
               <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mt-2">{steps[step - 1].subtitle}</p>
             </div>
             {renderStepContent()}
          </motion.div>
        </div>

        {/* Wizard Nav */}
        <div className="px-12 py-8 border-t border-[var(--glass-border)] flex justify-between items-center bg-[var(--glass-bg)] mt-auto">
           <button 
             onClick={handlePrevStep}
             className="btn-ghost px-6 py-3 text-[12px] font-mono uppercase tracking-widest"
           >
             ← PREVIOUS
           </button>
           <div className="flex gap-4">
             {step === 6 && (
               <button 
                 onClick={() => setStage(3)} 
                 className="btn-ghost px-6 py-3 text-[12px] font-mono uppercase tracking-widest"
               >
                 SKIP_TO_FINAL
               </button>
             )}
             <button 
               onClick={handleNextStep}
               className="btn-primary px-8 py-3 text-[12px] font-mono uppercase tracking-widest"
             >
               {step === 6 ? "PREVIEW FINAL CV →" : "NEXT_STEP →"}
             </button>
           </div>
        </div>
      </div>

      {/* Right: Live Preview Sidebar */}
      <div className="hidden lg:flex w-[480px] border-l border-[var(--glass-border)] bg-[var(--glass-bg)] flex-col">
        <div className="px-8 py-4 border-b border-[var(--glass-border)] flex items-center justify-between bg-[var(--glass-bg)]">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--text-primary)]">
            LIVE_PREVIEW
          </span>
          <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
            {selectedTemplate}_TEMPLATE
          </span>
        </div>
        <div className="flex-1 bg-[var(--glass-border)] p-8 flex items-start justify-center overflow-hidden">
           <div className="w-full h-full shadow-[0_0_40px_rgba(0,0,0,0.05)] origin-top scale-[0.65] lg:scale-[0.55] xl:scale-[0.65]">
             <PDFViewer className="w-full h-full border-none">
               <ActiveResume />
             </PDFViewer>
           </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-12 bg-[var(--glass-bg)] p-12 border border-[var(--glass-border)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[var(--glass-border)] pb-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => { setStage(2); setStep(6); }} 
            className="p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-sans text-[20px] font-bold text-[var(--text-primary)] uppercase tracking-tight">Final Preview</h2>
            <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mt-2">
              {selectedTemplate}_TEMPLATE_SELECTED
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className="btn-ghost px-6 py-3 text-[12px] font-mono uppercase tracking-widest"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "SAVING..." : "SAVE_DRAFT"}
          </button>
          <PDFDownloadLink document={<ActiveResume />} fileName={`${data.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.pdf`}>
            {({ loading }) => (
              <button 
                className="btn-primary px-8 py-3 text-[12px] font-mono uppercase tracking-widest"
                disabled={loading}
              >
                {loading ? "PREPARING..." : "DOWNLOAD_PDF ↓"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <div className="bg-[var(--glass-border)] border border-[var(--glass-border)] overflow-hidden">
        <div className="bg-[var(--glass-bg)] px-8 py-4 border-b border-[var(--glass-border)] flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--text-primary)]">
            DOCUMENT_OUTPUT
          </span>
          <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">
            ENGINE_STABLE
          </span>
        </div>
        <div className={hasPreviewedRef.current ? "block" : "hidden"}>
          <PDFViewer className="w-full h-[90vh] border-none"><ActiveResume /></PDFViewer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-[calc(100vh-100px)]">
      <AnimatePresence mode="wait">
        {stage === 1 && <motion.div key="stage1" initial="hidden" animate="show" exit={{ opacity: 0, y: -20 }} variants={fadeUp}>{renderTemplateGallery()}</motion.div>}
        {stage === 2 && <motion.div key="stage2" initial="hidden" animate="show" exit={{ opacity: 0, scale: 0.98 }} variants={fadeUp}>{renderWizard()}</motion.div>}
        {stage === 3 && <motion.div key="stage3" initial="hidden" animate="show" variants={scaleIn}>{renderPreview()}</motion.div>}
      </AnimatePresence>
    </div>
  );
}
