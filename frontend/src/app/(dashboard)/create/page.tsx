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
  Layout,
  Briefcase
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
    color: "#ffffff",
    mockup: (
      <div className="flex w-full h-full gap-2">
        <div className="w-1/3 bg-black  p-2 flex flex-col gap-2">
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

import { 
  DashboardPageWrapper,
  DashboardHeader,
  DashboardGrid,
  DashboardCard,
} from "@/features/dashboard/components/DashboardLayoutComponents";

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
    <motion.div variants={dashboardStagger()} initial="hidden" animate="show" className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#2a2a2a] pb-8">
        <div className="space-y-2">
          <h2 className="font-sans text-[24px] font-medium text-white tracking-tight">
            Design selection
          </h2>
          <p className="font-sans text-[14px] text-white/50">
            Pick a structural framework for your professional profile.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-white/30">Templates:</span>
          <span className="px-3 py-1 bg-[#2a2a2a] text-[#e6efdf] text-[10px] font-bold rounded-full border border-[#3a3a3a]">
            4 Available
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((tpl) => {
          const isSelected = selectedTemplate === tpl.id;
          return (
            <motion.div
              key={tpl.id}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className={`group cursor-pointer flex flex-col h-full bg-[#161616] border border-[#2a2a2a] rounded-[24px] p-6 transition-all duration-300 ${isSelected ? "ring-2 ring-[#e6efdf] border-transparent" : "hover:border-[#444444]"}`}
              onClick={() => {
                setSelectedTemplate(tpl.id);
                setStage(2);
                setStep(1);
              }}
            >
              <div 
                className={`
                  relative aspect-[3/4] p-6 flex items-center justify-center overflow-hidden transition-all bg-[#0d0d0d] rounded-[16px] border border-[#2a2a2a] group-hover:border-[#3a3a3a]
                `}
              >
                <div className="w-full scale-100 opacity-60 group-hover:opacity-100 transition-opacity">
                  {tpl.mockup}
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-sans text-[16px] font-medium text-white tracking-tight">
                    {tpl.name}
                  </h3>
                  <Check className={`w-4 h-4 text-[#e6efdf] transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-0"}`} />
                </div>
                <p className="font-sans text-[12px] text-white/40">
                  {tpl.tag}
                </p>
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
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <TextField label="Full Name" value={data.personalInfo.fullName} onChange={(e) => updatePersonalInfo("fullName", e.target.value)} placeholder="e.g. Marlene Novak" />
              <TextField label="Professional Email" value={data.personalInfo.email} onChange={(e) => updatePersonalInfo("email", e.target.value)} placeholder="e.g. marlene.novak@arcaive.ai" />
              <TextField label="Phone Number" value={data.personalInfo.phone} onChange={(e) => updatePersonalInfo("phone", e.target.value)} placeholder="e.g. +1 (555) 000-0000" />
              <TextField label="Current Location" value={data.personalInfo.location} onChange={(e) => updatePersonalInfo("location", e.target.value)} placeholder="e.g. Berlin, Germany" />
              <TextField label="LinkedIn URL" value={data.personalInfo.linkedin} onChange={(e) => updatePersonalInfo("linkedin", e.target.value)} placeholder="linkedin.com/in/username" />
              <TextField 
                label="Primary Specializations" 
                hint="Separated by commas"
                value={data.personalInfo.specializations.join(", ")} 
                onChange={(e) => setData(prev => ({
                  ...prev,
                  personalInfo: {
                    ...prev.personalInfo,
                    specializations: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                  }
                }))} 
                placeholder="e.g. Senior Product Designer, UX Architect"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <TextArea 
              label="Professional Summary" 
              value={data.summary} 
              onChange={(e) => setData(prev => ({ ...prev, summary: e.target.value }))} 
              placeholder="Synthesize your career trajectory, core strengths, and the value you bring to potential organizations..." 
              rows={8} 
            />
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-[16px] bg-[#0d0d0d] border border-[#2a2a2a]">
              <div className="w-5 h-5 rounded-full bg-[#e6efdf] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-[#111]" />
              </div>
              <p className="font-sans text-[12px] text-white/50">AI-optimized for semantic parsing and ATS compatibility</p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-10">
            <div className="flex justify-between items-end border-b border-[#2a2a2a] pb-6">
              <div>
                <h3 className="font-sans text-[18px] font-medium text-white tracking-tight">Work Experience</h3>
                <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mt-1">Up to 3 high-impact entries</p>
              </div>
              <button 
                className="transition-all px-4 py-2 text-[11px] font-semibold tracking-wider uppercase bg-[#e6efdf] text-[#111] rounded-full hover:opacity-90 active:scale-[0.98]"
                onClick={addExperience}
                disabled={data.workExperience.length >= 3}
              >
                + Add
              </button>
            </div>
            <div className="space-y-6">
              {data.workExperience.map((exp, idx) => (
                <div key={idx} className="p-8 bg-[#0d0d0d] border border-[#2a2a2a] rounded-[20px] space-y-8 relative group">
                  <button 
                    onClick={() => removeExperience(idx)} 
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-[#161616] border border-[#2a2a2a] text-white/20 hover:text-red-400 hover:border-red-400/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <TextField label="Role" value={exp.role} onChange={(e) => updateExperience(idx, "role", e.target.value)} placeholder="e.g. Senior Software Architect" />
                    <TextField label="Company" value={exp.company} onChange={(e) => updateExperience(idx, "company", e.target.value)} placeholder="e.g. Google Cloud" />
                    <TextField label="Period" value={exp.period} onChange={(e) => updateExperience(idx, "period", e.target.value)} placeholder="e.g. 2021 — Present" />
                    <TextField label="Location" value={exp.location} onChange={(e) => updateExperience(idx, "location", e.target.value)} placeholder="e.g. Remote / Mountain View" />
                  </div>
                  <TextArea label="Key Contributions & Impact" value={exp.bullets.join("\n")} onChange={(e) => updateExperience(idx, "bullets", e.target.value.split("\n"))} rows={5} placeholder="Describe your achievements, starting each with an action verb..." />
                </div>
              ))}
              {data.workExperience.length === 0 && (
                <div className="text-center py-16 border border-dashed border-[#2a2a2a] rounded-[20px] bg-[#0d0d0d]/30">
                  <div className="w-10 h-10 rounded-full bg-[#161616] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-5 h-5 text-white/30" />
                  </div>
                  <p className="font-sans text-[13px] text-white/40">Your professional journey is waiting to be told.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-10">
            <div className="flex justify-between items-end border-b border-[#2a2a2a] pb-6">
              <div>
                <h3 className="font-sans text-[18px] font-medium text-white tracking-tight">Education</h3>
                <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mt-1">Academic credentials & foundations</p>
              </div>
              <button 
                className="transition-all px-4 py-2 text-[11px] font-semibold tracking-wider uppercase bg-[#e6efdf] text-[#111] rounded-full hover:opacity-90 active:scale-[0.98]" 
                onClick={addEducation}
              >
                + Add
              </button>
            </div>
            <div className="space-y-6">
              {data.education.map((edu, idx) => (
                <div key={idx} className="p-8 bg-[#0d0d0d] border border-[#2a2a2a] rounded-[20px] space-y-8 relative">
                  <button 
                    onClick={() => setData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }))} 
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-[#161616] border border-[#2a2a2a] text-white/20 hover:text-red-400 hover:border-red-400/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <TextField label="Degree / Program" value={edu.degree} onChange={(e) => updateEducation(idx, "degree", e.target.value)} placeholder="e.g. B.S. in Computer Science" />
                    <TextField label="Institution" value={edu.institution} onChange={(e) => updateEducation(idx, "institution", e.target.value)} placeholder="e.g. Stanford University" />
                    <TextField label="Period" value={edu.period} onChange={(e) => updateEducation(idx, "period", e.target.value)} placeholder="e.g. 2015 — 2019" />
                    <TextField label="Location" value={edu.location} onChange={(e) => updateEducation(idx, "location", e.target.value)} placeholder="e.g. California, USA" />
                  </div>
                </div>
              ))}
              {data.education.length === 0 && (
                <div className="text-center py-16 border border-dashed border-[#2a2a2a] rounded-[20px] bg-[#0d0d0d]/30">
                  <div className="w-10 h-10 rounded-full bg-[#161616] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-5 h-5 text-white/30" />
                  </div>
                  <p className="font-sans text-[13px] text-white/40">Add your academic background.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-12">
            <div className="space-y-8">
              <div className="flex items-end justify-between border-b border-[#2a2a2a] pb-6">
                <div>
                  <h3 className="font-sans text-[18px] font-medium text-white tracking-tight">Skill categories</h3>
                  <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mt-1">Group your expertise by domain</p>
                </div>
                <button 
                  className="transition-all px-4 py-2 text-[11px] font-semibold tracking-wider uppercase bg-[#e6efdf] text-[#111] rounded-full hover:opacity-90 active:scale-[0.98]" 
                  onClick={addSkillCategory}
                >
                  + Add
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {data.skills.map((cat, idx) => (
                  <div key={idx} className="p-8 bg-[#0d0d0d] border border-[#2a2a2a] rounded-[20px] space-y-6 relative group">
                    <button 
                      onClick={() => setData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }))} 
                      className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-[#161616] border border-[#2a2a2a] text-white/20 hover:text-red-400 hover:border-red-400/30 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <TextField label="Category name" value={cat.category} onChange={(e) => updateSkillCategory(idx, e.target.value)} placeholder="e.g. Programming Languages" />
                    <TextArea label="Expertise items" value={cat.items.join(", ")} onChange={(e) => updateSkillItems(idx, e.target.value)} rows={2} placeholder="e.g. TypeScript, Rust, Python, Go..." />
                  </div>
                ))}
                {data.skills.length === 0 && (
                  <div className="text-center py-12 border border-dashed border-[#2a2a2a] rounded-[20px] bg-[#0d0d0d]/30">
                    <p className="font-sans text-[13px] text-white/40">Add skill categories to showcase your expertise.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-sans text-[18px] font-medium text-white tracking-tight border-b border-[#2a2a2a] pb-4">Languages</h3>
              <TextField 
                placeholder="e.g. English (Native), French (B2), Japanese (N3)..." 
                value={data.languages?.join(", ") || ""} 
                onChange={(e) => setData(prev => ({ ...prev, languages: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))} 
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-end justify-between border-b border-[#2a2a2a] pb-6">
                <div>
                  <h3 className="font-sans text-[18px] font-medium text-white tracking-tight">Certifications</h3>
                  <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mt-1">Validated credentials & licenses</p>
                </div>
                <button 
                  className="transition-all px-4 py-2 text-[11px] font-semibold tracking-wider uppercase bg-[#e6efdf] text-[#111] rounded-full hover:opacity-90 active:scale-[0.98]" 
                  onClick={addCertification}
                >
                  + Add
                </button>
              </div>
              <div className="space-y-4">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <TextField className="flex-1" placeholder="e.g. AWS Certified Solutions Architect Professional" value={cert} onChange={(e) => updateCertification(idx, e.target.value)} />
                    <button 
                      onClick={() => removeCertification(idx)} 
                      className="mt-[34px] w-8 h-8 flex items-center justify-center rounded-full bg-[#161616] border border-[#2a2a2a] text-white/20 hover:text-red-400 hover:border-red-400/30 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {data.certifications.length === 0 && (
                  <div className="text-center py-8 border border-dashed border-[#2a2a2a] rounded-[16px] bg-[#0d0d0d]/30">
                    <p className="font-sans text-[13px] text-white/40">Add your professional certifications.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-10">
            <div className="flex justify-between items-end border-b border-[#2a2a2a] pb-6">
              <div>
                <h3 className="font-sans text-[18px] font-medium text-white tracking-tight">Featured projects</h3>
                <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mt-1">Showcase your technical depth</p>
              </div>
              <button 
                className="transition-all px-4 py-2 text-[11px] font-semibold tracking-wider uppercase bg-[#e6efdf] text-[#111] rounded-full hover:opacity-90 active:scale-[0.98]" 
                onClick={addProject}
              >
                + Add
              </button>
            </div>
            <div className="space-y-6">
              {(data.projects || []).map((proj, idx) => (
                <div key={idx} className="p-8 bg-[#0d0d0d] border border-[#2a2a2a] rounded-[20px] space-y-8 relative group">
                  <button 
                    onClick={() => removeProject(idx)} 
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-[#161616] border border-[#2a2a2a] text-white/20 hover:text-red-400 hover:border-red-400/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <TextField label="Project title" value={proj.name} onChange={(e) => updateProject(idx, "name", e.target.value)} placeholder="e.g. Arcaive AI Platform" />
                    <TextField label="Year" value={proj.year || ""} onChange={(e) => updateProject(idx, "year", e.target.value)} placeholder="e.g. 2024" />
                  </div>
                  <TextField label="Brief overview" value={proj.description} onChange={(e) => updateProject(idx, "description", e.target.value)} placeholder="Describe the core objective of the project..." />
                  <TextArea label="Technical implementation" value={proj.bullets.join("\n")} onChange={(e) => updateProject(idx, "bullets", e.target.value.split("\n"))} rows={3} placeholder="Detail the stack and your specific contributions..." />
                </div>
              ))}
              {(!data.projects || data.projects.length === 0) && (
                <div className="text-center py-16 border border-dashed border-[#2a2a2a] rounded-[20px] bg-[#0d0d0d]/30">
                   <div className="w-10 h-10 rounded-full bg-[#161616] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-5 h-5 text-white/30" />
                  </div>
                  <p className="font-sans text-[13px] text-white/40">Demonstrate your skills through real-world applications.</p>
                </div>
              )}
            </div>
          </div>
        );
      default: return null;
    }
  };

  const renderWizard = () => (
    <div className="flex flex-col min-h-[calc(100vh-280px)] overflow-hidden relative">
      {/* Decorative Grid Background for Focus */}
      <div className="absolute inset-0 opacity-[0.01] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
             backgroundSize: '30px 30px' 
           }} 
      />

      <div className="relative z-10 flex-1 flex flex-col min-w-0 max-w-5xl mx-auto w-full">
        {/* Step Indicator - Modern Minimalist */}
        <div className="px-6 py-6 border-b border-[#2a2a2a] flex items-center justify-between bg-[#161616]/40 backdrop-blur-xl sticky top-0 z-20 rounded-t-[24px]">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
            {steps.map((s, i) => {
              const isCurrent = step === s.id;
              const isCompleted = step > s.id;
              return (
                <div key={s.id} className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={() => setStep(s.id)}
                    className="group flex items-center gap-2 transition-all duration-300"
                  >
                    <div className={`
                      w-7 h-7 flex items-center justify-center rounded-full font-mono text-[10px] font-bold transition-all duration-300
                      ${isCurrent 
                        ? "bg-[#e6efdf] text-[#111] scale-110 shadow-[0_0_15px_rgba(230,239,223,0.3)]" 
                        : isCompleted 
                          ? "bg-[#2a2a2a] text-[#e6efdf]" 
                          : "bg-transparent border border-[#2a2a2a] text-white/30 group-hover:border-[#3a3a3a]"
                      }
                    `}>
                      {isCompleted ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : s.id}
                    </div>
                    <span className={`font-sans text-[12px] font-medium transition-colors duration-300 ${isCurrent ? "text-white" : "text-white/30 group-hover:text-white/50"}`}>
                      {s.title}
                    </span>
                  </button>
                  {i < steps.length - 1 && <div className="w-6 h-[1px] bg-[#2a2a2a]" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area - Refined Spacing */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-12 py-10 md:py-16 bg-[#0e0e0e]/50">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2a2a2a] bg-[#161616] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e6efdf] animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">Section {step} of 6</span>
              </div>
              <h2 className="font-sans text-[36px] font-medium tracking-tight text-white leading-tight">
                {steps.find(s => s.id === step)?.title}
              </h2>
              <p className="font-sans text-[16px] text-white/40 mt-3 max-w-xl leading-relaxed">
                {steps.find(s => s.id === step)?.subtitle}
              </p>
            </div>

            <div className="bg-[#161616] border border-[#2a2a2a] rounded-[24px] p-8 md:p-10 shadow-sm">
              {renderStepContent()}
            </div>
          </motion.div>
        </div>

        {/* Wizard Navigation - Sage Green Minimalist */}
        <div className="px-8 py-6 border-t border-[#2a2a2a] flex justify-between items-center bg-[#161616]/60 backdrop-blur-xl rounded-b-[24px]">
           <button 
             onClick={handlePrevStep}
             className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-[#1f1f1f] border border-[#2a2a2a] text-white/60 hover:text-white rounded-full"
           >
             <ArrowLeft className="w-4 h-4" />
             Back
           </button>
           <div className="flex gap-4">
             {step === 6 && (
               <button 
                 onClick={() => setStage(3)} 
                 className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all text-white/40 hover:text-white"
               >
                 Skip to Preview
               </button>
             )}
             <button 
               onClick={handleNextStep}
               className="flex items-center gap-2 px-8 py-3 text-[12px] font-bold uppercase tracking-widest transition-all bg-[#e6efdf] text-[#111] hover:opacity-90 active:scale-[0.98] rounded-full shadow-[0_4px_20px_rgba(230,239,223,0.15)]"
             >
               {step === 6 ? "Generate CV" : "Continue"}
               {step !== 6 && <span className="text-lg">→</span>}
             </button>
           </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[#2a2a2a] pb-12">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => { setStage(2); setStep(6); }} 
            className="flex items-center gap-2 p-3 text-[12px] font-bold uppercase tracking-widest transition-all hover:bg-[#1f1f1f] border border-[#2a2a2a] text-white/60 hover:text-white rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <h2 className="font-sans text-[24px] font-medium text-white tracking-tight">Final preview</h2>
            <p className="font-sans text-[14px] text-white/40 mt-1">
              Your professional profile is ready for export.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className="flex items-center gap-2 px-6 py-3 text-[12px] font-bold uppercase tracking-widest transition-all hover:bg-[#1f1f1f] border border-[#2a2a2a] text-white/60 hover:text-white rounded-full"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Synchronizing..." : "Save draft"}
          </button>
          <PDFDownloadLink document={<ActiveResume />} fileName={`${data.personalInfo.fullName.replace(/\s+/g, " ")} Resume.pdf`}>
            {({ loading }) => (
              <button 
                className="flex items-center gap-2 px-8 py-3 text-[12px] font-bold uppercase tracking-widest transition-all bg-[#e6efdf] text-[#111] hover:opacity-90 rounded-full shadow-[0_4px_20px_rgba(230,239,223,0.15)]"
                disabled={loading}
              >
                {loading ? "Optimizing..." : "Export PDF"}
                <Download className="w-4 h-4" />
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <div className="bg-[#161616] border border-[#2a2a2a] overflow-hidden rounded-[32px] shadow-2xl">
        <div className="bg-[#0e0e0e]/80 backdrop-blur-md px-8 py-5 border-b border-[#2a2a2a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#4ade80]" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-white/80">
              Document Engine v4.0
            </span>
          </div>
          <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
            High Precision Output
          </span>
        </div>
        <div className="block bg-white p-1">
          <PDFViewer className="w-full h-[90vh] border-none"><ActiveResume /></PDFViewer>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardPageWrapper>
      <DashboardHeader title="Create CV" />
      <DashboardGrid>
        <DashboardCard className="lg:col-span-12 p-0 overflow-hidden" title={null}>
          <AnimatePresence mode="wait">
            {stage === 1 && (
              <motion.div key="stage1" initial="hidden" animate="show" exit={{ opacity: 0, y: -20 }} variants={fadeUp} className="p-6 md:p-12">
                {renderTemplateGallery()}
              </motion.div>
            )}
            {stage === 2 && (
              <motion.div key="stage2" initial="hidden" animate="show" exit={{ opacity: 0, scale: 0.98 }} variants={fadeUp}>
                {renderWizard()}
              </motion.div>
            )}
            {stage === 3 && (
              <motion.div key="stage3" initial="hidden" animate="show" variants={scaleIn}>
                {renderPreview()}
              </motion.div>
            )}
          </AnimatePresence>
        </DashboardCard>
      </DashboardGrid>
    </DashboardPageWrapper>
  );
}
