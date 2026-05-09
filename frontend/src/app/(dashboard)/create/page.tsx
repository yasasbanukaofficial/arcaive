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
  Briefcase,
  Sparkles,
  ArrowRight,
  Eye,
  FileText,
  User,
  History,
  GraduationCap,
  Hammer,
  Kanban
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
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;
  const directProfile = root.profile;
  const nestedData = root.data;
  const candidate = (directProfile && typeof directProfile === "object" ? directProfile : null) || (nestedData && typeof nestedData === "object" ? nestedData : null) || root;
  if (!candidate || typeof candidate !== "object") return null;
  const hasProfileSignal = ["jobRole", "summary", "experiences", "skills", "projects"].some((key) => key in (candidate as Record<string, unknown>));
  return hasProfileSignal ? (candidate as MemberProfileDTO) : null;
};

type TemplateType = "classic" | "modern" | "minimal" | "bold" | null;

const templates = [
  { id: "classic" as const, name: "Classic", tag: "ATS Optimized", mockup: ( <div className="flex flex-col gap-2 w-full"><div className="w-1/3 h-1 bg-[var(--text-primary)]/20 mb-1" /><div className="w-full h-[1px] bg-[var(--glass-border)]" /><div className="w-full flex flex-col gap-1.5 mt-2"><div className="w-full h-0.5 bg-[var(--text-primary)]/10" /><div className="w-3/4 h-0.5 bg-[var(--text-primary)]/10" /><div className="w-full h-0.5 bg-[var(--text-primary)]/10 mt-2" /><div className="w-1/2 h-1 bg-[var(--text-primary)]/20" /></div></div> ) },
  { id: "modern" as const, name: "Modern", tag: "Modern Clean", mockup: ( <div className="flex w-full h-full gap-2"><div className="w-1/3 bg-[var(--text-primary)]/5 p-2 flex flex-col gap-2"><div className="w-full h-1 bg-[var(--text-primary)]/20" /><div className="w-3/4 h-0.5 bg-[var(--text-primary)]/10" /></div><div className="flex-1 flex flex-col gap-2 pt-2"><div className="w-1/2 h-1 bg-[var(--text-primary)]/20" /><div className="w-full h-0.5 bg-[var(--text-primary)]/10" /><div className="w-full h-0.5 bg-[var(--text-primary)]/10" /></div></div> ) },
  { id: "minimal" as const, name: "Minimal", tag: "Clean & Simple", mockup: ( <div className="flex flex-col gap-3 w-full px-4"><div className="w-1/2 h-2 bg-[var(--text-primary)]/20" /><div className="w-full h-[1px] bg-[var(--glass-border)]" /><div className="w-full flex flex-col gap-2"><div className="w-1/4 h-0.5 bg-[var(--text-primary)]/20 mt-4" /><div className="w-full h-0.5 bg-[var(--text-primary)]/10" /><div className="w-full h-0.5 bg-[var(--text-primary)]/10" /></div></div> ) },
  { id: "bold" as const, name: "Bold", tag: "Strong Impact", mockup: ( <div className="flex flex-col w-full h-full"><div className="w-full h-[30%] bg-[var(--text-primary)]/5 p-3 flex flex-col gap-2"><div className="w-3/4 h-2 bg-[var(--text-primary)]/30" /><div className="w-1/2 h-1 bg-[var(--text-primary)]/10" /></div><div className="flex-1 p-3 flex flex-col gap-3"><div className="w-1/4 h-1 bg-[var(--text-primary)]/20" /><div className="w-full h-0.5 bg-[var(--text-primary)]/10" /><div className="w-full h-0.5 bg-[var(--text-primary)]/10" /></div></div> ) }
];

const steps = [
  { id: 1, title: "Identity", icon: User, subtitle: "Personal parameters" },
  { id: 2, title: "Summary", icon: Sparkles, subtitle: "Career synthesis" },
  { id: 3, title: "Experience", icon: History, subtitle: "Professional record" },
  { id: 4, title: "Education", icon: GraduationCap, subtitle: "Academic foundation" },
  { id: 5, title: "Expertise", icon: Hammer, subtitle: "System capabilities" },
  { id: 6, title: "Projects", icon: Kanban, subtitle: "Functional implementations" }
];

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function CreateCVPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ResumeData>(emptyResumeData);
  const [stage, setStage] = useState(1);
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToast();
  
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const source = searchParams.get("source");
        const jobIdFromUrl = searchParams.get("jobId");
        const isTailoredFlow = source === "tailored";
        const tailoredDraftRaw = isTailoredFlow ? sessionStorage.getItem(TAILORED_CV_DRAFT_KEY) : null;

        if (tailoredDraftRaw) {
          try {
            const parsed = JSON.parse(tailoredDraftRaw);
            const draftJobId = typeof parsed?.jobId === "string" ? parsed.jobId : "";
            const jobMatches = !jobIdFromUrl || !draftJobId || draftJobId === jobIdFromUrl;
            const tailoredProfile = resolveTailoredProfile(parsed);
            if (tailoredProfile && jobMatches) {
              const tailoredSections = mapProfileToResumeSections(tailoredProfile);
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
                  specializations: [tailoredProfile.jobRole, tailoredProfile.experience].map(v => trimOrEmpty(v)).filter(Boolean),
                },
              });
              sessionStorage.removeItem(TAILORED_CV_DRAFT_KEY);
              return;
            }
          } catch (e) { console.error(e); }
        }

        const memberData: MemberIdentityData = await memberAPI.get();
        if (memberData) {
          const profileSeed: ResumeData = {
            ...emptyResumeData,
            personalInfo: {
              fullName: trimOrEmpty(memberData.memberFullName),
              email: trimOrEmpty(memberData.memberEmail),
              phone: trimOrEmpty(memberData.phone),
              location: trimOrEmpty(memberData.location) || trimOrEmpty(memberData.country),
              linkedin: trimOrEmpty(memberData.linkedAccounts?.find(a => a.provider?.toLowerCase() === "linkedin")?.url),
              specializations: [memberData.jobRole, memberData.experience].map(v => trimOrEmpty(v)).filter(Boolean),
            },
            summary: trimOrEmpty(memberData.summary),
            workExperience: (memberData.experiences || []).map(x => ({ role: x.role || "", company: x.company || "", location: x.location || "", period: x.period || "", bullets: Array.isArray(x.bullets) && x.bullets.length > 0 ? x.bullets : [""] })),
            education: (memberData.educations || []).map(x => ({ degree: x.degree || "", institution: x.institution || "", location: x.location || "", period: x.period || "" })),
            skills: (memberData.skills || []).map(x => ({ category: x.category || "", items: Array.isArray(x.items) ? x.items : [] })),
            certifications: Array.isArray(memberData.certifications) ? memberData.certifications : [],
            projects: (memberData.projects || []).map(x => ({ name: x.name || "", description: x.description || "", bullets: Array.isArray(x.bullets) && x.bullets.length > 0 ? x.bullets : [""], year: x.year || "" })),
            languages: Array.isArray(memberData.languages) ? memberData.languages : [],
          };
          setData(profileSeed);
        }
      } catch (error) { console.error(error); }
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
      addToast({ type: "success", title: "Sync Successful", description: "Your professional profile has been archived." });
    }, 1000);
  };

  const renderTemplateGallery = () => (
    <div className="w-full flex flex-col gap-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-[44px] md:text-[56px] font-semibold text-[var(--text-primary)] tracking-[-0.04em] leading-none">Architecture</h1>
          <p className="text-[var(--text-secondary)] text-[14px] font-medium tracking-tight">Select a structural framework for your profile</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full">
           <Layout size={14} className="text-[var(--accent-brand)]" />
           <span className="text-[13px] font-bold tracking-tight text-[var(--text-primary)] uppercase">4 Blueprints Ready</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((tpl) => (
          <motion.div
            key={tpl.id}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.4, ease: smoothEase }}
            className={`group cursor-pointer flex flex-col h-full bg-[var(--glass-bg)] border rounded-[32px] p-8 transition-all duration-500 ${selectedTemplate === tpl.id ? "border-[var(--accent-brand)] shadow-2xl shadow-[var(--accent-brand)]/10" : "border-[var(--glass-border)] hover:border-[var(--text-primary)]/20 shadow-lg"}`}
            onClick={() => { setSelectedTemplate(tpl.id); setStage(2); setStep(1); }}
          >
            <div className="relative aspect-[3/4] p-8 flex items-center justify-center overflow-hidden bg-[var(--bg-color)] rounded-[20px] border border-[var(--glass-border)] group-hover:bg-[var(--text-primary)]/[0.02] transition-colors">
              <div className="w-full scale-100 opacity-40 group-hover:opacity-100 transition-opacity duration-700">{tpl.mockup}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                 <div className="px-6 py-2 bg-[var(--text-primary)] text-[var(--bg-color)] rounded-full text-[11px] font-bold uppercase tracking-widest">Select Model</div>
              </div>
            </div>
            <div className="mt-8 space-y-1">
              <h3 className="text-[18px] font-bold text-[var(--text-primary)] tracking-tight capitalize">{tpl.name}</h3>
              <p className="text-[12px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">{tpl.tag}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderWizard = () => (
    <div className="w-full flex flex-col gap-12">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-[44px] md:text-[56px] font-semibold text-[var(--text-primary)] tracking-[-0.04em] leading-none capitalize">{steps.find(s => s.id === step)?.title}</h1>
          <p className="text-[var(--text-secondary)] text-[14px] font-medium tracking-tight">{steps.find(s => s.id === step)?.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-6 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full">
              <span className="text-[13px] font-bold tracking-tight text-[var(--text-primary)] uppercase">Step {step} / 6</span>
           </div>
           <button onClick={() => setStage(3)} className="flex items-center gap-2 px-6 py-3 bg-[var(--text-primary)]/[0.03] border border-[var(--glass-border)] rounded-full text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <Eye size={14} /> Preview
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Stepper Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="sticky top-28 space-y-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[32px] p-4">
            {steps.map((s, i) => {
              const isCurrent = step === s.id;
              const isCompleted = step > s.id;
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className={`relative flex items-center gap-4 w-full px-4 py-4 rounded-[20px] text-left transition-all duration-300 group ${isCurrent ? "bg-[var(--accent-brand)] shadow-lg shadow-[var(--accent-brand)]/10" : "hover:bg-[var(--text-primary)]/[0.03]"}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${isCurrent ? "bg-[var(--bg-color)]/20" : "bg-[var(--text-primary)]/[0.03] border border-[var(--glass-border)]"}`}>
                    {isCompleted ? <Check size={18} className={isCurrent ? "text-[var(--accent-brand-contrast)]" : "text-[var(--accent-brand)]"} /> : <Icon size={18} className={isCurrent ? "text-[var(--accent-brand-contrast)]" : "text-[var(--text-tertiary)]"} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`block text-[14px] font-bold tracking-tight ${isCurrent ? "text-[var(--accent-brand-contrast)]" : "text-[var(--text-secondary)]"}`}>{s.title}</span>
                    <span className={`block text-[11px] font-medium mt-0.5 ${isCurrent ? "text-[var(--accent-brand-contrast)]/60" : "text-[var(--text-tertiary)]"}`}>{s.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: smoothEase }}
              className="bg-[var(--d-surface)] border border-[var(--glass-border)] rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-brand)]/[0.01] to-transparent pointer-events-none" />
              <div className="relative z-10">{renderStepContent()}</div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : setStage(1)}
              className="flex items-center gap-2 px-8 py-4 bg-[var(--text-primary)]/[0.03] border border-[var(--glass-border)] rounded-full font-bold text-[12px] uppercase tracking-widest text-[var(--text-primary)] hover:bg-[var(--text-primary)]/[0.08] transition-all"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button 
              onClick={() => step < 6 ? setStep(step + 1) : setStage(3)}
              className="flex items-center gap-2 px-10 py-4 bg-[var(--text-primary)] text-[var(--bg-color)] rounded-full font-bold text-[13px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl group"
            >
              {step === 6 ? "Finalize Profile" : "Continue"} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TextField label="Full Designation" value={data.personalInfo.fullName} onChange={(e) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, fullName: e.target.value } }))} placeholder="e.g. Marlene Novak" />
            <TextField label="Interface Email" value={data.personalInfo.email} onChange={(e) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, email: e.target.value } }))} placeholder="e.g. marlene.novak@arcaive.ai" />
            <TextField label="Contact Node" value={data.personalInfo.phone} onChange={(e) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, phone: e.target.value } }))} placeholder="e.g. +1 (555) 000-0000" />
            <TextField label="Geographic Location" value={data.personalInfo.location} onChange={(e) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, location: e.target.value } }))} placeholder="e.g. Berlin, Germany" />
            <TextField label="Digital Profile (LinkedIn)" value={data.personalInfo.linkedin} onChange={(e) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, linkedin: e.target.value } }))} placeholder="linkedin.com/in/username" />
            <TextField label="Operational Core" hint="Separated by commas" value={data.personalInfo.specializations.join(", ")} onChange={(e) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, specializations: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } }))} placeholder="e.g. Senior Product Designer, UX Architect" />
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <TextArea label="Operational Summary" value={data.summary} onChange={(e) => setData(prev => ({ ...prev, summary: e.target.value }))} placeholder="Synthesize your career trajectory, core strengths, and the value you bring to potential organizations..." rows={10} />
            <div className="flex items-center gap-4 p-6 bg-[var(--accent-brand)]/5 border border-[var(--accent-brand)]/10 rounded-[24px]">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-brand)]/10 flex items-center justify-center shrink-0"><Sparkles className="w-5 h-5 text-[var(--accent-brand)]" /></div>
              <p className="text-[14px] font-medium text-[var(--text-secondary)] leading-relaxed">System-optimized for semantic parsing and high-precision ATS compatibility.</p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-10">
            <div className="flex justify-between items-center mb-8 border-b border-[var(--glass-border)] pb-8">
              <div className="space-y-1">
                <h3 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">Professional History</h3>
                <p className="text-[12px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Maximum of 3 operational entries</p>
              </div>
              <button onClick={() => { if (data.workExperience.length < 3) setData(prev => ({ ...prev, workExperience: [...prev.workExperience, { role: "", company: "", location: "", period: "", bullets: [""] }] })); else addToast({ type: "error", title: "Buffer Limit", description: "Operational history capped at 3 high-impact entries." }); }} className="h-10 px-6 bg-[var(--accent-brand)] text-[var(--accent-brand-contrast)] rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg">+ New Entry</button>
            </div>
            <div className="space-y-8">
              {data.workExperience.map((exp, idx) => (
                <div key={idx} className="p-8 bg-[var(--bg-color)]/40 border border-[var(--glass-border)] rounded-[24px] space-y-8 relative group">
                  <button onClick={() => setData(prev => ({ ...prev, workExperience: prev.workExperience.filter((_, i) => i !== idx) }))} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-red-500/5 text-red-500/40 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <TextField label="Operational Role" value={exp.role} onChange={(e) => { const n = [...data.workExperience]; n[idx].role = e.target.value; setData(p => ({...p, workExperience: n})); }} placeholder="e.g. Senior Software Architect" />
                    <TextField label="Organization" value={exp.company} onChange={(e) => { const n = [...data.workExperience]; n[idx].company = e.target.value; setData(p => ({...p, workExperience: n})); }} placeholder="e.g. Google Cloud" />
                    <TextField label="Temporal Range" value={exp.period} onChange={(e) => { const n = [...data.workExperience]; n[idx].period = e.target.value; setData(p => ({...p, workExperience: n})); }} placeholder="e.g. 2021 — Present" />
                    <TextField label="Operational Hub" value={exp.location} onChange={(e) => { const n = [...data.workExperience]; n[idx].location = e.target.value; setData(p => ({...p, workExperience: n})); }} placeholder="e.g. Remote / Mountain View" />
                  </div>
                  <TextArea label="Mission Impact" value={exp.bullets.join("\n")} onChange={(e) => { const n = [...data.workExperience]; n[idx].bullets = e.target.value.split("\n"); setData(p => ({...p, workExperience: n})); }} rows={6} placeholder="Detail your impact using data-driven metrics and action-oriented syntax..." />
                </div>
              ))}
              {data.workExperience.length === 0 && (
                <div className="text-center py-20 border border-dashed border-[var(--glass-border)] rounded-[32px] bg-[var(--text-primary)]/[0.01]">
                   <div className="w-16 h-16 rounded-full bg-[var(--text-primary)]/[0.03] border border-[var(--glass-border)] flex items-center justify-center mx-auto mb-6"><Briefcase size={28} className="text-[var(--text-tertiary)]" /></div>
                   <p className="text-[15px] font-medium text-[var(--text-tertiary)]">Professional history log is currently empty.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-10">
            <div className="flex justify-between items-center mb-8 border-b border-[var(--glass-border)] pb-8">
              <div className="space-y-1">
                <h3 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">Academic Foundations</h3>
                <p className="text-[12px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Validated credentials & training</p>
              </div>
              <button onClick={() => setData(prev => ({ ...prev, education: [...prev.education, { degree: "", institution: "", location: "", period: "" }] }))} className="h-10 px-6 bg-[var(--accent-brand)] text-[var(--accent-brand-contrast)] rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg">+ New Entry</button>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {data.education.map((edu, idx) => (
                <div key={idx} className="p-8 bg-[var(--bg-color)]/40 border border-[var(--glass-border)] rounded-[24px] space-y-8 relative group">
                   <button onClick={() => setData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }))} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-red-500/5 text-red-500/40 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <TextField label="Credential / Degree" value={edu.degree} onChange={(e) => { const n = [...data.education]; n[idx].degree = e.target.value; setData(p => ({...p, education: n})); }} placeholder="e.g. B.S. in Computer Science" />
                     <TextField label="Institution" value={edu.institution} onChange={(e) => { const n = [...data.education]; n[idx].institution = e.target.value; setData(p => ({...p, education: n})); }} placeholder="e.g. Stanford University" />
                     <TextField label="Temporal Range" value={edu.period} onChange={(e) => { const n = [...data.education]; n[idx].period = e.target.value; setData(p => ({...p, education: n})); }} placeholder="e.g. 2015 — 2019" />
                     <TextField label="Location" value={edu.location} onChange={(e) => { const n = [...data.education]; n[idx].location = e.target.value; setData(p => ({...p, education: n})); }} placeholder="e.g. California, USA" />
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
              <div className="flex justify-between items-center mb-8 border-b border-[var(--glass-border)] pb-8">
                <div className="space-y-1">
                  <h3 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">System Expertise</h3>
                  <p className="text-[12px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Capabilities categorized by domain</p>
                </div>
                <button onClick={() => setData(prev => ({ ...prev, skills: [...prev.skills, { category: "", items: [] }] }))} className="h-10 px-6 bg-[var(--accent-brand)] text-[var(--accent-brand-contrast)] rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg">+ New Group</button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {data.skills.map((cat, idx) => (
                  <div key={idx} className="p-8 bg-[var(--bg-color)]/40 border border-[var(--glass-border)] rounded-[24px] space-y-6 relative group">
                    <button onClick={() => setData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }))} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-red-500/5 text-red-500/40 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                    <TextField label="Domain Cluster" value={cat.category} onChange={(e) => { const n = [...data.skills]; n[idx].category = e.target.value; setData(p => ({...p, skills: n})); }} placeholder="e.g. Programming Languages" />
                    <TextArea label="Operational Capability" value={cat.items.join(", ")} onChange={(e) => { const n = [...data.skills]; n[idx].items = e.target.value.split(",").map(s => s.trim()).filter(Boolean); setData(p => ({...p, skills: n})); }} rows={2} placeholder="e.g. TypeScript, Rust, Python, Go..." />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-12">
               <div className="space-y-6">
                  <h3 className="text-[18px] font-bold text-[var(--text-primary)] tracking-tight border-b border-[var(--glass-border)] pb-4">Language Protocols</h3>
                  <TextField placeholder="e.g. English (Native), French (B2), Japanese (N3)..." value={data.languages?.join(", ") || ""} onChange={(e) => setData(prev => ({ ...prev, languages: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))} />
               </div>
               <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-4">
                     <h3 className="text-[18px] font-bold text-[var(--text-primary)] tracking-tight">System Certifications</h3>
                     <button onClick={() => setData(p => ({...p, certifications: [...p.certifications, ""]}))} className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-brand)] hover:opacity-70">+ Add Cert</button>
                  </div>
                  <div className="space-y-4">
                    {data.certifications.map((cert, idx) => (
                      <div key={idx} className="flex gap-4 group">
                        <TextField className="flex-1" placeholder="e.g. AWS Certified Solutions Architect Professional" value={cert} onChange={(e) => { const n = [...data.certifications]; n[idx] = e.target.value; setData(p => ({...p, certifications: n})); }} />
                        <button onClick={() => setData(prev => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== idx) }))} className="mt-[42px] w-12 h-12 flex items-center justify-center rounded-full bg-[var(--text-primary)]/[0.03] border border-[var(--glass-border)] text-red-500/40 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-10">
            <div className="flex justify-between items-center mb-8 border-b border-[var(--glass-border)] pb-8">
              <div className="space-y-1">
                <h3 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">Functional Implementations</h3>
                <p className="text-[12px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Real-world technical deployment</p>
              </div>
              <button onClick={() => setData(prev => ({ ...prev, projects: [...(prev.projects || []), { name: "", description: "", bullets: [""], year: "" }] }))} className="h-10 px-6 bg-[var(--accent-brand)] text-[var(--accent-brand-contrast)] rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg">+ New Project</button>
            </div>
            <div className="space-y-8">
              {(data.projects || []).map((proj, idx) => (
                <div key={idx} className="p-8 bg-[var(--bg-color)]/40 border border-[var(--glass-border)] rounded-[24px] space-y-8 relative group">
                  <button onClick={() => setData(prev => ({ ...prev, projects: (prev.projects || []).filter((_, i) => i !== idx) }))} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-red-500/5 text-red-500/40 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <TextField label="Deployment Name" value={proj.name} onChange={(e) => { const n = [...(data.projects || [])]; n[idx].name = e.target.value; setData(p => ({...p, projects: n})); }} placeholder="e.g. Arcaive AI Platform" />
                    <TextField label="Temporal Marker" value={proj.year || ""} onChange={(e) => { const n = [...(data.projects || [])]; n[idx].year = e.target.value; setData(p => ({...p, projects: n})); }} placeholder="e.g. 2024" />
                  </div>
                  <TextField label="Mission Architecture" value={proj.description} onChange={(e) => { const n = [...(data.projects || [])]; n[idx].description = e.target.value; setData(p => ({...p, projects: n})); }} placeholder="Describe the core objective of the project..." />
                  <TextArea label="Technical Execution" value={proj.bullets.join("\n")} onChange={(e) => { const n = [...(data.projects || [])]; n[idx].bullets = e.target.value.split("\n"); setData(p => ({...p, projects: n})); }} rows={4} placeholder="Detail the stack and your specific contributions..." />
                </div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  const renderPreview = () => (
    <div className="w-full flex flex-col gap-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-[44px] md:text-[56px] font-semibold text-[var(--text-primary)] tracking-[-0.04em] leading-none">Output</h1>
          <p className="text-[var(--text-secondary)] text-[14px] font-medium tracking-tight">Operational profile ready for export</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { setStage(2); setStep(6); }} className="h-[52px] px-8 bg-[var(--text-primary)]/[0.03] border border-[var(--glass-border)] text-[var(--text-primary)] rounded-full font-bold text-[12px] uppercase tracking-widest hover:bg-[var(--text-primary)]/[0.08] transition-all flex items-center gap-2"><ArrowLeft size={16} /> Modifications</button>
          <button onClick={handleSave} disabled={isSaving} className="h-[52px] px-8 bg-[var(--text-primary)]/[0.03] border border-[var(--glass-border)] text-[var(--text-primary)] rounded-full font-bold text-[12px] uppercase tracking-widest hover:bg-[var(--text-primary)]/[0.08] transition-all">{isSaving ? "Syncing..." : "Archive Draft"}</button>
          <PDFDownloadLink document={<ActiveResume />} fileName={`${data.personalInfo.fullName} Resume.pdf`}>
            {({ loading }) => (
              <button disabled={loading} className="h-[52px] px-10 bg-[var(--accent-brand)] text-[var(--accent-brand-contrast)] rounded-full font-bold text-[13px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl flex items-center gap-3">
                {loading ? "Compiling..." : "Export PDF"} <Download size={18} />
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <div className="bg-[var(--d-surface)] border border-[var(--glass-border)] rounded-[40px] overflow-hidden shadow-2xl relative">
        <div className="bg-[var(--bg-color)]/60 backdrop-blur-xl px-10 py-6 border-b border-[var(--glass-border)] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-brand)] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">Document Engine v4.2 // High Precision</span>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Active Template:</span>
             <span className="text-[10px] font-bold text-[var(--accent-brand)] uppercase tracking-widest px-2 py-0.5 bg-[var(--accent-brand)]/10 rounded-md border border-[var(--accent-brand)]/20">{selectedTemplate}</span>
          </div>
        </div>
        <div className="p-1 bg-white"><PDFViewer className="w-full h-[100vh] border-none"><ActiveResume /></PDFViewer></div>
      </div>
    </div>
  );

  return (
    <div className="w-full px-4 md:px-8 pb-24">
      <AnimatePresence mode="wait">
        {stage === 1 && (
          <motion.div key="stage1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: smoothEase }}>
            {renderTemplateGallery()}
          </motion.div>
        )}
        {stage === 2 && (
          <motion.div key="stage2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5, ease: smoothEase }}>
            {renderWizard()}
          </motion.div>
        )}
        {stage === 3 && (
          <motion.div key="stage3" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: smoothEase }}>
            {renderPreview()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
