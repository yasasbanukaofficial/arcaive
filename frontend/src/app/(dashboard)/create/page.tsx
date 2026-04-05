"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
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
import { MemberIdentityData } from "@/@types/member";

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

type TemplateType = "classic" | "modern" | "minimal" | "bold" | null;

const templates = [
  { 
    id: "classic" as const, 
    name: "Classic", 
    tag: "ATS Optimized", 
    color: "#0a0a0a",
    mockup: (
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="w-1/3 h-2 bg-slate-800 rounded-sm mb-1" />
        <div className="w-full h-0.5 bg-slate-200" />
        <div className="w-full flex flex-col gap-1.5 mt-2">
          <div className="w-full h-1 bg-slate-200 rounded-sm" />
          <div className="w-3/4 h-1 bg-slate-200 rounded-sm" />
          <div className="w-full h-1 bg-slate-200 rounded-sm mt-2" />
          <div className="w-1/2 h-1.5 bg-slate-300 rounded-sm" />
          <div className="w-full h-1 bg-slate-100 rounded-sm" />
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
        <div className="w-1/3 bg-[#0f172a] rounded-sm p-2 flex flex-col gap-2">
          <div className="w-full h-1.5 bg-white opacity-20 rounded-sm" />
          <div className="w-3/4 h-1 bg-white opacity-10 rounded-sm" />
          <div className="w-full h-1 bg-white opacity-10 rounded-sm mt-4" />
          <div className="w-full h-1 bg-white opacity-10 rounded-sm" />
        </div>
        <div className="flex-1 flex flex-col gap-2 pt-2">
          <div className="w-1/2 h-1.5 bg-slate-300 rounded-sm" />
          <div className="w-full h-0.5 bg-slate-100" />
          <div className="w-full h-1 bg-slate-200 rounded-sm" />
          <div className="w-full h-1 bg-slate-200 rounded-sm" />
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
        <div className="w-1/2 h-2.5 bg-slate-800 rounded-sm" />
        <div className="w-full h-[0.5px] bg-slate-300" />
        <div className="w-full flex flex-col gap-3">
          <div className="w-1/4 h-1.5 bg-slate-400 rounded-sm mt-4" />
          <div className="w-full h-1 bg-slate-100 rounded-sm" />
          <div className="w-full h-1 bg-slate-100 rounded-sm" />
          <div className="w-1/4 h-1.5 bg-slate-400 rounded-sm mt-2" />
          <div className="w-full h-1 bg-slate-100 rounded-sm" />
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
        <div className="w-full h-[30%] bg-[#111111] rounded-t-sm p-3 flex flex-col gap-2">
          <div className="w-3/4 h-2.5 bg-white opacity-90 rounded-sm" />
          <div className="w-1/2 h-1.5 bg-white opacity-40 rounded-sm" />
        </div>
        <div className="flex-1 p-3 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 bg-[#111111]" />
            <div className="w-1/4 h-2 bg-slate-800 rounded-sm" />
          </div>
          <div className="w-full h-1 bg-slate-200 rounded-sm" />
          <div className="w-full h-1 bg-slate-200 rounded-sm" />
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
        const memberData: MemberIdentityData = await memberAPI.get();
        if (memberData) {
          const memberId = memberData.memberId || "anonymous";
          const storedDraftRaw = localStorage.getItem(`resume_draft_${memberId}`);
          const storedDraft = storedDraftRaw ? (JSON.parse(storedDraftRaw) as ResumeData) : null;

          const linkedinAccount = memberData.linkedAccounts?.find(
            (a) => a.provider?.toLowerCase() === "linkedin",
          );

          if (storedDraft) {
            setData({
              ...emptyResumeData,
              ...storedDraft,
              personalInfo: {
                ...emptyResumeData.personalInfo,
                ...(storedDraft.personalInfo || {}),
                fullName: storedDraft.personalInfo?.fullName || memberData.memberFullName || "",
                email: storedDraft.personalInfo?.email || memberData.memberEmail || "",
                location: storedDraft.personalInfo?.location || memberData.country || "",
                specializations:
                  storedDraft.personalInfo?.specializations?.length
                    ? storedDraft.personalInfo.specializations
                    : memberData.jobRole
                    ? [memberData.jobRole]
                    : [],
                linkedin: storedDraft.personalInfo?.linkedin || linkedinAccount?.url || "",
              },
            });
          } else {
            setData({
              ...emptyResumeData,
              personalInfo: {
                ...emptyResumeData.personalInfo,
                fullName: memberData.memberFullName || "",
                email: memberData.memberEmail || "",
                location: memberData.country || "",
                specializations: memberData.jobRole ? [memberData.jobRole] : [],
                linkedin: linkedinAccount?.url || "",
              },
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch member data", error);
        setData(emptyResumeData);
      }
    };
    fetchMemberData();
  }, []);

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
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-[var(--d-text-primary)]">Choose a Template</h1>
        <p className="text-[var(--d-text-secondary)]">Pick a style to get started</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((tpl) => (
          <motion.div
            key={tpl.id}
            variants={fadeUp}
            whileHover={{ scale: 1.02 }}
            className="group cursor-pointer"
            onClick={() => {
              setSelectedTemplate(tpl.id);
              setStage(2);
              setStep(1);
            }}
          >
            <div className="bg-[var(--d-surface)] border border-[var(--d-border)] rounded-2xl overflow-hidden group-hover:border-[var(--d-text-primary)] transition-all">
              <div className="aspect-[3/4] p-4 bg-[var(--d-surface-muted)] relative flex items-start justify-center overflow-hidden">
                {tpl.mockup}
              </div>
              <div className="p-4 border-t border-[var(--d-border)] bg-[var(--d-surface)] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[var(--d-text-primary)]">{tpl.name}</h3>
                  <span className="text-[10px] text-[var(--d-text-tertiary)] uppercase font-bold tracking-wider">{tpl.tag}</span>
                </div>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tpl.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-[var(--d-text-secondary)]">Max 3 work experiences allowed.</p>
              <Button 
                size="sm" 
                icon={<Plus className="w-3 h-3" />} 
                onClick={addExperience}
                disabled={data.workExperience.length >= 3}
              >
                Add Experience
              </Button>
            </div>
            {data.workExperience.map((exp, idx) => (
              <div key={idx} className="p-6 bg-[var(--d-surface-muted)] border border-[var(--d-border)] rounded-2xl space-y-4 relative group">
                <button onClick={() => removeExperience(idx)} className="absolute top-4 right-4 p-1.5 text-[var(--d-text-tertiary)] hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField label="Role" value={exp.role} onChange={(e) => updateExperience(idx, "role", e.target.value)} />
                  <TextField label="Company" value={exp.company} onChange={(e) => updateExperience(idx, "company", e.target.value)} />
                  <TextField label="Period" value={exp.period} onChange={(e) => updateExperience(idx, "period", e.target.value)} />
                  <TextField label="Location" value={exp.location} onChange={(e) => updateExperience(idx, "location", e.target.value)} />
                </div>
                <TextArea label="Bullets (One per line)" value={exp.bullets.join("\n")} onChange={(e) => updateExperience(idx, "bullets", e.target.value.split("\n"))} rows={4} />
              </div>
            ))}
            {data.workExperience.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-[var(--d-border)] rounded-2xl">
                <p className="text-[var(--d-text-secondary)]">No work experience added yet.</p>
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="flex justify-end"><Button size="sm" icon={<Plus className="w-3 h-3" />} onClick={addEducation}>Add Education</Button></div>
            {data.education.map((edu, idx) => (
              <div key={idx} className="p-6 bg-[var(--d-surface-muted)] border border-[var(--d-border)] rounded-2xl space-y-4 relative group">
                <button onClick={() => setData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }))} className="absolute top-4 right-4 p-1.5 text-[var(--d-text-tertiary)] hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField label="Degree" value={edu.degree} onChange={(e) => updateEducation(idx, "degree", e.target.value)} />
                  <TextField label="Institution" value={edu.institution} onChange={(e) => updateEducation(idx, "institution", e.target.value)} />
                  <TextField label="Period" value={edu.period} onChange={(e) => updateEducation(idx, "period", e.target.value)} />
                  <TextField label="Location" value={edu.location} onChange={(e) => updateEducation(idx, "location", e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        );
      case 5:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--d-text-primary)] uppercase tracking-wider">Skill Categories</h3>
                <Button size="sm" icon={<Plus className="w-3 h-3" />} onClick={addSkillCategory}>Add Category</Button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {data.skills.map((cat, idx) => (
                  <div key={idx} className="p-6 bg-[var(--d-surface-muted)] border border-[var(--d-border)] rounded-2xl space-y-4 relative group">
                    <button onClick={() => setData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }))} className="absolute top-4 right-4 p-1.5 text-[var(--d-text-tertiary)] hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <TextField label="Category Name" value={cat.category} onChange={(e) => updateSkillCategory(idx, e.target.value)} />
                    <TextArea label="Items (Comma separated)" value={cat.items.join(", ")} onChange={(e) => updateSkillItems(idx, e.target.value)} rows={2} />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--d-text-primary)] uppercase tracking-wider">Languages</h3>
              <TextField 
                placeholder="English, French, etc." 
                value={data.languages?.join(", ") || ""} 
                onChange={(e) => setData(prev => ({ ...prev, languages: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))} 
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--d-text-primary)] uppercase tracking-wider">Certifications</h3>
                <Button size="sm" icon={<Plus className="w-3 h-3" />} onClick={addCertification}>Add Certification</Button>
              </div>
              <div className="space-y-3">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="flex gap-2 group">
                    <TextField className="flex-1" placeholder="e.g. AWS Certified Solutions Architect" value={cert} onChange={(e) => updateCertification(idx, e.target.value)} />
                    <button onClick={() => removeCertification(idx)} className="p-2 text-[var(--d-text-tertiary)] hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <div className="flex justify-end"><Button size="sm" icon={<Plus className="w-3 h-3" />} onClick={addProject}>Add Project</Button></div>
            {(data.projects || []).map((proj, idx) => (
              <div key={idx} className="p-6 bg-[var(--d-surface-muted)] border border-[var(--d-border)] rounded-2xl space-y-4 relative group">
                <button onClick={() => removeProject(idx)} className="absolute top-4 right-4 p-1.5 text-[var(--d-text-tertiary)] hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField label="Project Name" value={proj.name} onChange={(e) => updateProject(idx, "name", e.target.value)} />
                  <TextField label="Year" value={proj.year || ""} onChange={(e) => updateProject(idx, "year", e.target.value)} />
                </div>
                <TextField label="Description" value={proj.description} onChange={(e) => updateProject(idx, "description", e.target.value)} />
                <TextArea label="Bullets (One per line)" value={proj.bullets.join("\n")} onChange={(e) => updateProject(idx, "bullets", e.target.value.split("\n"))} rows={3} />
              </div>
            ))}
            {(!data.projects || data.projects.length === 0) && (
              <div className="text-center py-12 border-2 border-dashed border-[var(--d-border)] rounded-2xl">
                <Layout className="w-8 h-8 mx-auto mb-3 text-[var(--d-text-tertiary)]" />
                <p className="text-[var(--d-text-secondary)]">No projects added yet.</p>
              </div>
            )}
          </div>
        );
      default: return null;
    }
  };

  const renderWizard = () => (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => setStage(1)} className="p-2 text-[var(--d-text-tertiary)] hover:text-[var(--d-text-primary)] transition-colors"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            {steps.map((s, i) => (
              <React.Fragment key={s.id}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s.id
                      ? "bg-[var(--d-text-primary)] text-[var(--d-surface)]"
                      : step > s.id
                      ? "bg-emerald-500 text-white"
                      : "border-2 border-[var(--d-border)] text-[var(--d-text-tertiary)]"
                  }`}
                >
                  {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ${step > s.id ? "bg-emerald-500" : "bg-[var(--d-border)]"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <span className="px-2 py-0.5 bg-[var(--d-surface-muted)] text-[10px] font-bold text-[var(--d-text-tertiary)] rounded border border-[var(--d-border)] uppercase tracking-widest">{selectedTemplate} Template</span>
        </div>
        <div className="w-9" />
      </div>
      <div className="text-center"><h2 className="text-2xl font-bold text-[var(--d-text-primary)]">{steps[step - 1].title}</h2><p className="text-[var(--d-text-secondary)]">{steps[step - 1].subtitle}</p></div>
      <motion.div key={step} initial="hidden" animate="show" variants={fadeUp} className="bg-[var(--d-surface)] border border-[var(--d-border)] p-8 rounded-3xl">{renderStepContent()}</motion.div>
      <div className="flex justify-end gap-3"><Button variant="secondary" onClick={handlePrevStep}>Back</Button>{step === 6 && <Button variant="ghost" onClick={() => setStage(3)}>Skip</Button>}<Button variant="primary" onClick={handleNextStep}>{step === 6 ? "Preview My CV" : "Continue"}</Button></div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => { setStage(2); setStep(6); }} className="p-2 text-[var(--d-text-tertiary)] hover:text-[var(--d-text-primary)] transition-colors"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h2 className="text-xl font-bold text-[var(--d-text-primary)]">Final Preview</h2>
            <span className="px-2 py-0.5 bg-[var(--d-surface-muted)] text-[10px] font-bold text-[var(--d-text-tertiary)] rounded border border-[var(--d-border)] uppercase tracking-widest">{selectedTemplate} Template</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={<Save className="w-4 h-4" />} onClick={handleSave} loading={isSaving}>Save Draft</Button>
          <PDFDownloadLink document={<ActiveResume />} fileName={`${data.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.pdf`}>
            {({ loading }) => <Button variant="primary" icon={<Download className="w-4 h-4" />} loading={loading}>Download PDF</Button>}
          </PDFDownloadLink>
        </div>
      </div>
      <div className="rounded-2xl border border-[var(--d-border)] overflow-hidden bg-[#525659] shadow-2xl">
        <div className="bg-[var(--d-surface)] px-4 py-2 border-b border-[var(--d-border)] flex items-center justify-between">
          <span className="text-[10px] font-bold text-[var(--d-text-tertiary)] uppercase tracking-widest">Document Preview</span>
          <span className="text-[10px] text-[var(--d-text-tertiary)] bg-[var(--d-surface-muted)] px-1.5 py-0.5 rounded">PDF</span>
        </div>
        <div className={hasPreviewedRef.current ? "block" : "hidden"}>
          <PDFViewer className="w-full h-[85vh] border-none"><ActiveResume /></PDFViewer>
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
