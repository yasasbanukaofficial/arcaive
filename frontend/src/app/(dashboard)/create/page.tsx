"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
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
  FileText,
  User,
  History,
  GraduationCap,
  Hammer,
  Kanban,
  ChevronRight,
  Cpu,
  Globe,
  Award
} from "lucide-react";
import { 
  ResumeClassic, 
  ResumeModern, 
  ResumeMinimal, 
  ResumeBold 
} from "@/components/pdf/ResumeTemplate";
import { dashboardStagger, fadeUp, scaleIn } from "@/components/animations/animations";
import Button from "@/components/ui/Button";
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

// --- Premium UI Components (Local) ---

const PremiumInput = ({ label, value, onChange, placeholder, type = "text", hint }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="flex flex-col gap-2.5 w-full group">
      {label && (
        <div className="flex justify-between items-center px-1">
          <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors">
            {label}
          </label>
          {hint && <span className="text-[10px] text-[var(--text-tertiary)] italic">{hint}</span>}
        </div>
      )}
      <div className={`relative flex items-center transition-all duration-300 rounded-[18px] bg-[#0a0a0a] border ${isFocused ? "border-[var(--accent-brand)] shadow-[0_0_20px_rgba(223,231,216,0.05)] scale-[1.01]" : "border-[var(--glass-border)] hover:border-[var(--text-primary)]/20"}`}>
        <input
          type={type}
          value={value ?? ""}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent px-6 py-4 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50 outline-none font-medium"
        />
      </div>
    </div>
  );
};

const PremiumTextArea = ({ label, value, onChange, placeholder, rows = 4 }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="flex flex-col gap-2.5 w-full group">
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors px-1">
          {label}
        </label>
      )}
      <div className={`relative transition-all duration-300 rounded-[24px] bg-[#0a0a0a] border ${isFocused ? "border-[var(--accent-brand)] shadow-[0_0_20px_rgba(223,231,216,0.05)] scale-[1.005]" : "border-[var(--glass-border)] hover:border-[var(--text-primary)]/20"}`}>
        <textarea
          value={value ?? ""}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={rows}
          className="w-full bg-transparent px-6 py-5 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50 outline-none font-medium resize-none leading-relaxed"
        />
      </div>
    </div>
  );
};

// --- Logic Helpers ---

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

  // --- Render Sections ---

  const renderTemplateGallery = () => (
    <div className="max-w-6xl mx-auto w-full flex flex-col gap-16 py-12">
      <div className="flex flex-col items-center text-center space-y-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="px-4 py-1.5 rounded-full bg-[var(--accent-brand)]/10 border border-[var(--accent-brand)]/20 flex items-center gap-2">
           <Cpu size={14} className="text-[var(--accent-brand)]" />
           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-brand)]">Structural Intelligence Engine</span>
        </motion.div>
        <h1 className="text-[48px] md:text-[72px] font-semibold text-[var(--text-primary)] tracking-[-0.04em] leading-[1.1] font-display">
          Choose Your <span className="text-[var(--text-tertiary)]">Architecture</span>
        </h1>
        <p className="max-w-xl text-[var(--text-secondary)] text-[16px] md:text-[18px] font-medium leading-relaxed">
          Select a high-performance framework to blueprint your professional trajectory. Each model is engineered for semantic parsing and visual impact.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((tpl, idx) => (
          <motion.div
            key={tpl.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: smoothEase }}
            whileHover={{ y: -10 }}
            className={`group cursor-pointer flex flex-col h-full bg-[#0d0d0d] border rounded-[28px] p-8 transition-all duration-500 relative overflow-hidden ${selectedTemplate === tpl.id ? "border-[var(--accent-brand)] shadow-[0_0_40px_rgba(223,231,216,0.1)]" : "border-[var(--glass-border)] hover:border-[var(--text-primary)]/20 hover:shadow-2xl hover:shadow-black/40"}`}
            onClick={() => { setSelectedTemplate(tpl.id); setStage(2); setStep(1); }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-brand)]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative aspect-[3/4] p-8 flex items-center justify-center overflow-hidden bg-[#050505] rounded-[20px] border border-[var(--glass-border)] group-hover:bg-[#080808] transition-all duration-500">
              <div className="w-full scale-100 opacity-30 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-700">{tpl.mockup}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                 <div className="px-6 py-2.5 bg-[var(--text-primary)] text-black rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl">Activate Blueprint</div>
              </div>
            </div>
            <div className="mt-8 space-y-2 relative z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight capitalize">{tpl.name}</h3>
                <ChevronRight size={16} className="text-[var(--text-tertiary)] group-hover:text-[var(--accent-brand)] group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">{tpl.tag}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderWizard = () => (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-12 py-8">
      {/* Premium Horizontal Stepper */}
      <div className="w-full flex flex-col gap-8 sticky top-[72px] z-30 bg-[var(--bg-color)]/80 backdrop-blur-xl py-6 -mx-2 px-2 border-b border-[var(--glass-border)] md:border-none">
        <div className="flex justify-between items-center px-2">
          <div className="flex flex-col">
            <h2 className="text-[24px] font-semibold text-[var(--text-primary)] tracking-tight font-display">{steps.find(s => s.id === step)?.title}</h2>
            <p className="text-[12px] text-[var(--text-tertiary)] font-medium uppercase tracking-[0.1em]">{steps.find(s => s.id === step)?.subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-4 py-2 bg-[#0d0d0d] border border-[var(--glass-border)] rounded-full flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-brand)] animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-primary)] uppercase">Module {step} / 6</span>
             </div>
             <button onClick={() => setStage(3)} className="hidden md:flex items-center gap-2 px-5 py-2 hover:bg-[#111111] border border-[var(--glass-border)] rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
                PREVIEW
             </button>
          </div>
        </div>

        <div className="relative w-full px-2">
          {/* Connecting Lines */}
          <div className="absolute top-[18px] left-[40px] right-[40px] h-[1px] bg-[var(--glass-border)] z-0" />
          <div 
            className="absolute top-[18px] left-[40px] h-[1px] bg-[var(--accent-brand)] z-0 transition-all duration-700 ease-in-out" 
            style={{ width: `calc(${(step - 1) / 5 * 100}% - 40px)` }}
          />
          
          <div className="relative z-10 flex justify-between">
            {steps.map((s) => {
              const isCurrent = step === s.id;
              const isCompleted = step > s.id;
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className="flex flex-col items-center gap-3 group outline-none"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${isCurrent ? "bg-[var(--accent-brand)] text-black shadow-[0_0_20px_rgba(223,231,216,0.3)] scale-110" : isCompleted ? "bg-[#111111] text-[var(--accent-brand)] border border-[var(--accent-brand)]/30" : "bg-[#0a0a0a] text-[var(--text-tertiary)] border border-[var(--glass-border)] group-hover:border-[var(--text-primary)]/30"}`}>
                    {isCompleted ? <Check size={16} strokeWidth={3} /> : <Icon size={16} />}
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${isCurrent ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"}`}>
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="relative w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.4, ease: smoothEase }}
            className="bg-[#0d0d0d] border border-[var(--glass-border)] rounded-[32px] p-8 md:p-14 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden min-h-[500px]"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[var(--accent-brand)]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-10">
              {renderStepContent()}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Actions */}
        <div className="mt-12 flex items-center justify-between gap-6">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : setStage(1)}
            className="group flex items-center gap-3 px-8 py-4 bg-[#0d0d0d] border border-[var(--glass-border)] rounded-full font-bold text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]/20 transition-all"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            {step === 1 ? "Blueprint Selection" : "Previous Phase"}
          </button>
          
          <div className="flex items-center gap-4">
            {step < 6 ? (
              <button 
                onClick={() => setStep(step + 1)}
                className="group flex items-center gap-3 px-10 py-4 bg-[var(--accent-brand)] text-black rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(223,231,216,0.15)]"
              >
                Next Phase <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button 
                onClick={() => setStage(3)}
                className="group flex items-center gap-3 px-10 py-4 bg-[var(--text-primary)] text-black rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(255,255,255,0.1)]"
              >
                Compile Architecture <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col gap-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <PremiumInput label="Personal Name" value={data.personalInfo.fullName} onChange={(e: any) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, fullName: e.target.value } }))} placeholder="Marlene Novak" />
              <PremiumInput label="Digital Node (Email)" value={data.personalInfo.email} onChange={(e: any) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, email: e.target.value } }))} placeholder="marlene@arcaive.ai" />
              <PremiumInput label="Communication Link" value={data.personalInfo.phone} onChange={(e: any) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, phone: e.target.value } }))} placeholder="+1 (555) 000-0000" />
              <PremiumInput label="Geographic Base" value={data.personalInfo.location} onChange={(e: any) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, location: e.target.value } }))} placeholder="Berlin, Germany" />
              <PremiumInput label="System Profile (LinkedIn)" value={data.personalInfo.linkedin} onChange={(e: any) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, linkedin: e.target.value } }))} placeholder="linkedin.com/in/username" />
              <PremiumInput label="Primary Specializations" hint="CSV format" value={data.personalInfo.specializations.join(", ")} onChange={(e: any) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, specializations: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) } }))} placeholder="UX Architect, Senior Product Designer" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-10">
            <PremiumTextArea 
              label="Professional Synthesis" 
              value={data.summary} 
              onChange={(e: any) => setData(prev => ({ ...prev, summary: e.target.value }))} 
              placeholder="Synthesize your career trajectory, core strengths, and systemic value..." 
              rows={12} 
            />
            <div className="flex items-center gap-5 p-8 bg-[#111111] border border-[var(--glass-border)] rounded-[28px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-brand)]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-brand)]/10 flex items-center justify-center shrink-0 border border-[var(--accent-brand)]/20 shadow-inner">
                <Sparkles size={20} className="text-[var(--accent-brand)]" />
              </div>
              <div className="space-y-1 relative z-10">
                <h4 className="text-[13px] font-bold text-[var(--text-primary)] uppercase tracking-tight">AI Semantic Optimization</h4>
                <p className="text-[13px] font-medium text-[var(--text-tertiary)] leading-relaxed max-w-lg">Content is automatically formatted for maximum high-precision ATS compatibility and semantic parsing.</p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-10">
            <div className="flex justify-between items-end border-b border-[var(--glass-border)] pb-8">
              <div className="space-y-1">
                <h3 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">Experience Log</h3>
                <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Operational capacity: 3 entries</p>
              </div>
              <button 
                onClick={() => { if (data.workExperience.length < 3) setData(prev => ({ ...prev, workExperience: [...prev.workExperience, { role: "", company: "", location: "", period: "", bullets: [""] }] })); else addToast({ type: "error", title: "Capacity Reached", description: "Operational log limited to 3 high-impact records." }); }} 
                className="group flex items-center gap-2 px-6 py-2.5 bg-[var(--accent-brand)] text-black rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                <Plus size={14} className="group-hover:rotate-90 transition-transform" /> New Record
              </button>
            </div>
            
            <div className="flex flex-col gap-10">
              {data.workExperience.map((exp, idx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className="p-10 bg-[#080808] border border-[var(--glass-border)] rounded-[32px] flex flex-col gap-10 relative group"
                >
                  <button onClick={() => setData(prev => ({ ...prev, workExperience: prev.workExperience.filter((_, i) => i !== idx) }))} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-red-500/5 text-red-500/40 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-xl border border-red-500/10">
                    <Trash2 size={16} />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <PremiumInput label="Operational Role" value={exp.role} onChange={(e: any) => { const n = [...data.workExperience]; n[idx].role = e.target.value; setData(p => ({...p, workExperience: n})); }} placeholder="Software Architect" />
                    <PremiumInput label="Organization" value={exp.company} onChange={(e: any) => { const n = [...data.workExperience]; n[idx].company = e.target.value; setData(p => ({...p, workExperience: n})); }} placeholder="Google / Anthropic" />
                    <PremiumInput label="Temporal Window" value={exp.period} onChange={(e: any) => { const n = [...data.workExperience]; n[idx].period = e.target.value; setData(p => ({...p, workExperience: n})); }} placeholder="2022 — Present" />
                    <PremiumInput label="Operational Hub" value={exp.location} onChange={(e: any) => { const n = [...data.workExperience]; n[idx].location = e.target.value; setData(p => ({...p, workExperience: n})); }} placeholder="Remote / SF" />
                  </div>
                  <PremiumTextArea label="Mission Directives & Outcomes" value={exp.bullets.join("\n")} onChange={(e: any) => { const n = [...data.workExperience]; n[idx].bullets = e.target.value.split("\n"); setData(p => ({...p, workExperience: n})); }} rows={6} placeholder="Detailed impact record using data-driven metrics..." />
                </motion.div>
              ))}
              
              {data.workExperience.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 bg-[#080808] border border-dashed border-[var(--glass-border)] rounded-[32px] group hover:border-[var(--text-primary)]/20 transition-all">
                   <div className="w-16 h-16 rounded-3xl bg-[#0a0a0a] border border-[var(--glass-border)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Briefcase size={28} className="text-[var(--text-tertiary)]" /></div>
                   <p className="text-[14px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Operational record is currently offline</p>
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col gap-10">
            <div className="flex justify-between items-end border-b border-[var(--glass-border)] pb-8">
              <div className="space-y-1">
                <h3 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">Academic Base</h3>
                <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Validated institutional credentials</p>
              </div>
              <button onClick={() => setData(prev => ({ ...prev, education: [...prev.education, { degree: "", institution: "", location: "", period: "" }] }))} className="group flex items-center gap-2 px-6 py-2.5 bg-[var(--accent-brand)] text-black rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl">
                <Plus size={14} className="group-hover:rotate-90 transition-transform" /> New Entry
              </button>
            </div>
            
            <div className="flex flex-col gap-8">
              {data.education.map((edu, idx) => (
                <motion.div layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} key={idx} className="p-10 bg-[#080808] border border-[var(--glass-border)] rounded-[32px] relative group">
                   <button onClick={() => setData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }))} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-red-500/5 text-red-500/40 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-xl">
                    <Trash2 size={16} />
                   </button>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                     <PremiumInput label="Credential Degree" value={edu.degree} onChange={(e: any) => { const n = [...data.education]; n[idx].degree = e.target.value; setData(p => ({...p, education: n})); }} placeholder="M.S. Artificial Intelligence" />
                     <PremiumInput label="Institutional Node" value={edu.institution} onChange={(e: any) => { const n = [...data.education]; n[idx].institution = e.target.value; setData(p => ({...p, education: n})); }} placeholder="Stanford University" />
                     <PremiumInput label="Temporal Marker" value={edu.period} onChange={(e: any) => { const n = [...data.education]; n[idx].period = e.target.value; setData(p => ({...p, education: n})); }} placeholder="2018 — 2020" />
                     <PremiumInput label="Geographic Location" value={edu.location} onChange={(e: any) => { const n = [...data.education]; n[idx].location = e.target.value; setData(p => ({...p, education: n})); }} placeholder="Palo Alto, CA" />
                   </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col gap-16">
            <div className="space-y-10">
              <div className="flex justify-between items-end border-b border-[var(--glass-border)] pb-8">
                <div className="space-y-1">
                  <h3 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">System Expertise</h3>
                  <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Capability clusters by domain</p>
                </div>
                <button onClick={() => setData(prev => ({ ...prev, skills: [...prev.skills, { category: "", items: [] }] }))} className="group flex items-center gap-2 px-6 py-2.5 bg-[var(--accent-brand)] text-black rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl">
                  <Plus size={14} className="group-hover:rotate-90 transition-transform" /> New Cluster
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                {data.skills.map((cat, idx) => (
                  <motion.div layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={idx} className="p-10 bg-[#080808] border border-[var(--glass-border)] rounded-[32px] flex flex-col gap-8 relative group">
                    <button onClick={() => setData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }))} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-red-500/5 text-red-500/40 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-xl">
                      <Trash2 size={16} />
                    </button>
                    <PremiumInput label="Domain Architecture" value={cat.category} onChange={(e: any) => { const n = [...data.skills]; n[idx].category = e.target.value; setData(p => ({...p, skills: n})); }} placeholder="e.g. LLM Engineering" />
                    <PremiumTextArea label="Operational Capabilities" value={cat.items.join(", ")} onChange={(e: any) => { const n = [...data.skills]; n[idx].items = e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean); setData(p => ({...p, skills: n})); }} rows={2} placeholder="Python, PyTorch, LangChain, VectorDBs..." />
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-8 border-t border-[var(--glass-border)]">
               <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-[var(--accent-brand)]" />
                    <h3 className="text-[14px] font-bold text-[var(--text-primary)] uppercase tracking-[0.2em]">Linguistic Protocols</h3>
                  </div>
                  <PremiumInput placeholder="English (L1), German (C1), Japanese (N2)..." value={data.languages?.join(", ") || ""} onChange={(e: any) => setData(prev => ({ ...prev, languages: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) }))} />
               </div>
               
               <div className="space-y-8">
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-3">
                       <Award size={18} className="text-[var(--accent-brand)]" />
                       <h3 className="text-[14px] font-bold text-[var(--text-primary)] uppercase tracking-[0.2em]">System Validations</h3>
                     </div>
                     <button onClick={() => setData(p => ({...p, certifications: [...p.certifications, ""]}))} className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-brand)] hover:opacity-70 transition-opacity">+ New Cert</button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {data.certifications.map((cert, idx) => (
                      <div key={idx} className="flex gap-4 group items-end animate-in fade-in slide-in-from-left-2 duration-300">
                        <PremiumInput className="flex-1" placeholder="AWS Certified Architect" value={cert} onChange={(e: any) => { const n = [...data.certifications]; n[idx] = e.target.value; setData(p => ({...p, certifications: n})); }} />
                        <button onClick={() => setData(prev => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== idx) }))} className="mb-1 w-12 h-12 flex items-center justify-center rounded-2xl bg-[#0a0a0a] border border-[var(--glass-border)] text-red-500/40 hover:bg-red-500 hover:text-white transition-all shadow-lg group-hover:opacity-100 md:opacity-0">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="flex flex-col gap-10">
            <div className="flex justify-between items-end border-b border-[var(--glass-border)] pb-8">
              <div className="space-y-1">
                <h3 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">Functional Implementations</h3>
                <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Technical deployment records</p>
              </div>
              <button onClick={() => setData(prev => ({ ...prev, projects: [...(prev.projects || []), { name: "", description: "", bullets: [""], year: "" }] }))} className="group flex items-center gap-2 px-6 py-2.5 bg-[var(--accent-brand)] text-black rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl">
                <Plus size={14} className="group-hover:rotate-90 transition-transform" /> New Deployment
              </button>
            </div>
            
            <div className="flex flex-col gap-10">
              {(data.projects || []).map((proj, idx) => (
                <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={idx} className="p-10 bg-[#080808] border border-[var(--glass-border)] rounded-[32px] flex flex-col gap-10 relative group">
                  <button onClick={() => setData(prev => ({ ...prev, projects: (prev.projects || []).filter((_, i) => i !== idx) }))} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-red-500/5 text-red-500/40 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-xl border border-red-500/10">
                    <Trash2 size={16} />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <PremiumInput label="Deployment Identity" value={proj.name} onChange={(e: any) => { const n = [...(data.projects || [])]; n[idx].name = e.target.value; setData(p => ({...p, projects: n})); }} placeholder="Arcaive OS v2.0" />
                    <PremiumInput label="Temporal Marker" value={proj.year || ""} onChange={(e: any) => { const n = [...(data.projects || [])]; n[idx].year = e.target.value; setData(p => ({...p, projects: n})); }} placeholder="2024" />
                  </div>
                  <PremiumInput label="Mission Architecture" value={proj.description} onChange={(e: any) => { const n = [...(data.projects || [])]; n[idx].description = e.target.value; setData(p => ({...p, projects: n})); }} placeholder="High-performance neural interface..." />
                  <PremiumTextArea label="Technical Execution Log" value={proj.bullets.join("\n")} onChange={(e: any) => { const n = [...(data.projects || [])]; n[idx].bullets = e.target.value.split("\n"); setData(p => ({...p, projects: n})); }} rows={4} placeholder="Detailed technical stack and functional outcomes..." />
                </motion.div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  const renderPreview = () => (
    <div className="max-w-6xl mx-auto w-full flex flex-col gap-12 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-[var(--accent-brand)]">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-brand)] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Operational Readiness Achieved</span>
          </motion.div>
          <h1 className="text-[48px] md:text-[64px] font-semibold text-[var(--text-primary)] tracking-[-0.04em] leading-none font-display">Final <span className="text-[var(--text-tertiary)]">Synthesis</span></h1>
          <p className="text-[var(--text-secondary)] text-[16px] font-medium leading-relaxed max-w-lg">Your structural profile has been compiled and is ready for export and system integration.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { setStage(2); setStep(6); }} className="h-[56px] px-8 bg-[#0d0d0d] border border-[var(--glass-border)] text-[var(--text-secondary)] rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]/20 transition-all flex items-center gap-3 shadow-xl"><ArrowLeft size={16} /> Re-Enter Wizard</button>
          
          <PDFDownloadLink document={<ActiveResume />} fileName={`${data.personalInfo.fullName} Resume.pdf`}>
            {({ loading }) => (
              <button disabled={loading} className="h-[56px] px-10 bg-[var(--accent-brand)] text-black rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(223,231,216,0.15)] flex items-center gap-3">
                {loading ? "Compiling PDF..." : "Export Profile"} <Download size={18} />
              </button>
            )}
          </PDFDownloadLink>
          
          <button onClick={handleSave} disabled={isSaving} className="h-[56px] w-[56px] flex items-center justify-center bg-[#0d0d0d] border border-[var(--glass-border)] text-[var(--accent-brand)] rounded-full hover:scale-110 transition-all shadow-xl group">
             {isSaving ? <div className="w-5 h-5 border-2 border-[var(--accent-brand)] border-t-transparent rounded-full animate-spin" /> : <Save size={20} className="group-hover:rotate-12 transition-transform" />}
          </button>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-[var(--glass-border)] rounded-[48px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-brand)]/[0.02] to-transparent pointer-events-none" />
        <div className="bg-[#0d0d0d]/80 backdrop-blur-2xl px-12 py-8 border-b border-[var(--glass-border)] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--text-tertiary)] mb-1">Engine Module</span>
              <span className="text-[12px] font-bold tracking-[0.1em] text-[var(--text-primary)] uppercase font-display">Document-v4.2.0-Alpha</span>
            </div>
            <div className="h-8 w-[1px] bg-[var(--glass-border)]" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--text-tertiary)] mb-1">Status</span>
              <span className="text-[12px] font-bold tracking-[0.1em] text-[var(--accent-brand)] uppercase font-display flex items-center gap-2">Operational <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-brand)] shadow-[0_0_8px_var(--accent-brand)]" /></span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end mr-4">
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--text-tertiary)] mb-1">Architecture</span>
                <span className="text-[12px] font-bold text-[var(--text-primary)] uppercase tracking-widest">{selectedTemplate}</span>
             </div>
             <div className="px-4 py-2 bg-[var(--accent-brand)]/5 border border-[var(--accent-brand)]/10 rounded-xl text-[10px] font-bold text-[var(--accent-brand)] uppercase tracking-[0.2em]">Validated</div>
          </div>
        </div>
        <div className="p-2 bg-[#f0f0f0]"><PDFViewer className="w-full h-[120vh] border-none rounded-b-[40px]"><ActiveResume /></PDFViewer></div>
      </div>
    </div>
  );

  return (
    <div className="w-full px-4 md:px-8 pb-32 min-h-screen">
      {/* Background Decor */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-[var(--accent-brand)]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[var(--accent-brand)]/3 rounded-full blur-[140px] pointer-events-none -z-10" />
      
      <AnimatePresence mode="wait">
        {stage === 1 && (
          <motion.div key="stage1" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6, ease: smoothEase }}>
            {renderTemplateGallery()}
          </motion.div>
        )}
        {stage === 2 && (
          <motion.div key="stage2" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.6, ease: smoothEase }}>
            {renderWizard()}
          </motion.div>
        )}
        {stage === 3 && (
          <motion.div key="stage3" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: smoothEase }}>
            {renderPreview()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
