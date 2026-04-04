"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Download, FileText, Edit2, Plus, Trash2, Save, Sparkles } from "lucide-react";
import { ResumeDocument } from "@/components/pdf/ResumeTemplate";
import { dashboardStagger, fadeUp, scaleIn } from "@/components/animations/animations";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import TextArea from "@/components/ui/TextArea";
import { useToast } from "@/components/ui/Toast";
import { ResumeData, WorkExperience, Education, SkillCategory } from "@/@types/resume";

// Dynamically import PDF components with ssr: false
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const defaultData: ResumeData = {
  personalInfo: {
    fullName: "John Doe",
    specializations: ["Senior Software Engineer", "Full Stack Architect"],
    email: "john.doe@example.com",
    phone: "+1 (555) 000-0000",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johndoe",
  },
  summary: "Results-driven Senior Software Engineer with over 8 years of experience in building scalable web applications and distributed systems. Expert in React, TypeScript, and modern cloud infrastructure. Proven track record of leading high-performance teams and delivering high-quality software solutions that drive business growth.",
  workExperience: [
    {
      role: "Lead Software Engineer",
      company: "Tech Innovations Inc.",
      location: "New York, NY",
      period: "Jan 2021 — Present",
      bullets: [
        "Architected and deployed a microservices-based platform serving 1M+ active users using Node.js and AWS.",
        "Reduced cloud infrastructure costs by 40% through serverless migration and container orchestration."
      ],
    },
    {
      role: "Senior Full Stack Developer",
      company: "Digital Solutions Group",
      location: "Austin, TX",
      period: "June 2017 — Dec 2020",
      bullets: [
        "Developed responsive React-based dashboards improving user engagement by 25% for enterprise clients.",
        "Mentored junior developers and implemented standardized code review processes."
      ],
    }
  ],
  education: [
    {
      degree: "B.S. in Computer Science",
      institution: "University of Technology",
      location: "Austin, TX",
      period: "2017",
    }
  ],
  skills: [
    {
      category: "Languages & Frameworks",
      items: ["TypeScript", "JavaScript (ES6+)", "Node.js", "React", "Next.js", "GraphQL"]
    },
    {
      category: "Cloud & DevOps",
      items: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions"]
    }
  ],
  certifications: [
    "AWS Certified Solutions Architect – Associate",
    "Meta Front-End Developer Professional Certificate"
  ],
};

export default function CreateCVPage() {
  const [data, setData] = useState<ResumeData>(defaultData);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToast();

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
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
    const newExp: WorkExperience = {
      role: "",
      company: "",
      location: "",
      period: "",
      bullets: [""]
    };
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
    setData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
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

  const removeCertification = (index: number) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={dashboardStagger()}
      className="p-6 space-y-6 max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--d-text-primary)]">Create CV</h1>
          <p className="text-sm text-[var(--d-text-secondary)]">Design and preview your professional resume</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-[var(--d-surface)] border border-[var(--d-border)] rounded-xl">
            <button
              onClick={() => setActiveTab("edit")}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === "edit"
                  ? "bg-[var(--d-surface-muted)] text-[var(--d-text-primary)] shadow-sm"
                  : "text-[var(--d-text-tertiary)] hover:text-[var(--d-text-secondary)]"
              }`}
            >
              <Edit2 className="w-3.5 h-3.5 inline-block mr-1.5" />
              Edit
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === "preview"
                  ? "bg-[var(--d-surface-muted)] text-[var(--d-text-primary)] shadow-sm"
                  : "text-[var(--d-text-tertiary)] hover:text-[var(--d-text-secondary)]"
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline-block mr-1.5" />
              Preview
            </button>
          </div>

          <Button
            variant="secondary"
            icon={<Save className="w-4 h-4" />}
            onClick={handleSave}
            loading={isSaving}
          >
            Save Draft
          </Button>

          <PDFDownloadLink
            document={<ResumeDocument data={data} />}
            fileName={`${data.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.pdf`}
          >
            {({ loading }) => (
              <Button
                variant="primary"
                icon={<Download className="w-4 h-4" />}
                loading={loading}
              >
                Download PDF
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor Side */}
        <AnimatePresence mode="wait">
          {activeTab === "edit" ? (
            <motion.div
              key="edit"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, x: -20 }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Personal Info */}
              <div className="p-6 bg-[var(--d-surface)] border border-[var(--d-border)] rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[var(--d-text-primary)] uppercase tracking-wider">Personal Information</h2>
                  <Button size="sm" variant="ghost" icon={<Sparkles className="w-3 h-3" />}>AI Optimize</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Full Name"
                    value={data.personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                  />
                  <TextField
                    label="Email"
                    value={data.personalInfo.email}
                    onChange={(e) => updatePersonalInfo("email", e.target.value)}
                  />
                  <TextField
                    label="Phone"
                    value={data.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                  />
                  <TextField
                    label="Location"
                    value={data.personalInfo.location}
                    onChange={(e) => updatePersonalInfo("location", e.target.value)}
                  />
                  <TextField
                    label="LinkedIn"
                    className="md:col-span-1"
                    value={data.personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                  />
                  <TextField
                    label="Specializations (Comma separated)"
                    className="md:col-span-2"
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
              </div>

              {/* Summary */}
              <div className="p-6 bg-[var(--d-surface)] border border-[var(--d-border)] rounded-2xl space-y-4">
                <h2 className="text-sm font-bold text-[var(--d-text-primary)] uppercase tracking-wider">Professional Summary</h2>
                <TextArea
                  value={data.summary}
                  onChange={(e) => setData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="A brief overview of your career and skills..."
                  rows={4}
                />
              </div>

              {/* Experience */}
              <div className="p-6 bg-[var(--d-surface)] border border-[var(--d-border)] rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[var(--d-text-primary)] uppercase tracking-wider">Work Experience</h2>
                  <Button size="sm" icon={<Plus className="w-3 h-3" />} onClick={addExperience}>Add Experience</Button>
                </div>
                <div className="space-y-4">
                  {data.workExperience.map((exp, idx) => (
                    <div key={idx} className="p-4 bg-[var(--d-surface-muted)] border border-[var(--d-border)] rounded-xl space-y-3 relative group">
                      <button
                        onClick={() => removeExperience(idx)}
                        className="absolute top-2 right-2 p-1.5 text-[var(--d-text-tertiary)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <TextField
                          label="Role"
                          value={exp.role}
                          onChange={(e) => updateExperience(idx, "role", e.target.value)}
                        />
                        <TextField
                          label="Company"
                          value={exp.company}
                          onChange={(e) => updateExperience(idx, "company", e.target.value)}
                        />
                        <TextField
                          label="Period"
                          value={exp.period}
                          onChange={(e) => updateExperience(idx, "period", e.target.value)}
                        />
                        <TextField
                          label="Location"
                          value={exp.location}
                          onChange={(e) => updateExperience(idx, "location", e.target.value)}
                        />
                      </div>
                      <TextArea
                        label="Bullets (One per line)"
                        value={exp.bullets.join("\n")}
                        onChange={(e) => updateExperience(idx, "bullets", e.target.value.split("\n"))}
                        rows={3}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="p-6 bg-[var(--d-surface)] border border-[var(--d-border)] rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[var(--d-text-primary)] uppercase tracking-wider">Education</h2>
                  <Button size="sm" icon={<Plus className="w-3 h-3" />} onClick={addEducation}>Add Education</Button>
                </div>
                <div className="space-y-4">
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="p-4 bg-[var(--d-surface-muted)] border border-[var(--d-border)] rounded-xl space-y-3 relative group">
                      <button
                        onClick={() => setData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }))}
                        className="absolute top-2 right-2 p-1.5 text-[var(--d-text-tertiary)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <TextField
                          label="Degree"
                          value={edu.degree}
                          onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                        />
                        <TextField
                          label="Institution"
                          value={edu.institution}
                          onChange={(e) => updateEducation(idx, "institution", e.target.value)}
                        />
                        <TextField
                          label="Period"
                          value={edu.period}
                          onChange={(e) => updateEducation(idx, "period", e.target.value)}
                        />
                        <TextField
                          label="Location"
                          value={edu.location}
                          onChange={(e) => updateEducation(idx, "location", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="p-6 bg-[var(--d-surface)] border border-[var(--d-border)] rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[var(--d-text-primary)] uppercase tracking-wider">Technical Skills</h2>
                  <Button size="sm" icon={<Plus className="w-3 h-3" />} onClick={addSkillCategory}>Add Category</Button>
                </div>
                <div className="space-y-4">
                  {data.skills.map((cat, idx) => (
                    <div key={idx} className="p-4 bg-[var(--d-surface-muted)] border border-[var(--d-border)] rounded-xl space-y-3 relative group">
                      <button
                        onClick={() => setData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }))}
                        className="absolute top-2 right-2 p-1.5 text-[var(--d-text-tertiary)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <TextField
                        label="Category Name"
                        value={cat.category}
                        onChange={(e) => updateSkillCategory(idx, e.target.value)}
                      />
                      <TextArea
                        label="Items (Comma separated)"
                        value={cat.items.join(", ")}
                        onChange={(e) => updateSkillItems(idx, e.target.value)}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="p-6 bg-[var(--d-surface)] border border-[var(--d-border)] rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[var(--d-text-primary)] uppercase tracking-wider">Certifications</h2>
                  <Button
                    size="sm"
                    icon={<Plus className="w-3 h-3" />}
                    onClick={() => setData(prev => ({ ...prev, certifications: [...prev.certifications, ""] }))}
                  >
                    Add Certification
                  </Button>
                </div>
                <div className="space-y-3">
                  {data.certifications.map((cert, idx) => (
                    <div key={idx} className="flex gap-2 group">
                      <TextField
                        className="flex-1"
                        placeholder="e.g. AWS Certified Solutions Architect"
                        value={cert}
                        onChange={(e) => setData(prev => {
                          const newCerts = [...prev.certifications];
                          newCerts[idx] = e.target.value;
                          return { ...prev, certifications: newCerts };
                        })}
                      />
                      <button
                        onClick={() => removeCertification(idx)}
                        className="p-2 text-[var(--d-text-tertiary)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.95 }}
              className="lg:col-span-12"
            >
              <div className="rounded-2xl border border-[var(--d-border)] overflow-hidden bg-[#525659]">
                <PDFViewer className="w-full h-[80vh] border-none">
                  <ResumeDocument data={data} />
                </PDFViewer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Preview Side (Desktop only) */}
        {activeTab === "edit" && (
          <motion.div
            variants={fadeUp}
            className="hidden lg:block lg:col-span-5 sticky top-6"
          >
            <div className="rounded-2xl border border-[var(--d-border)] overflow-hidden bg-[#525659] shadow-2xl">
              <div className="bg-[var(--d-surface)] px-4 py-2 border-b border-[var(--d-border)] flex items-center justify-between">
                <span className="text-[10px] font-bold text-[var(--d-text-tertiary)] uppercase tracking-widest">Live Preview</span>
                <span className="text-[10px] text-[var(--d-text-tertiary)] bg-[var(--d-surface-muted)] px-1.5 py-0.5 rounded">PDF</span>
              </div>
              <PDFViewer className="w-full h-[calc(100vh-180px)] border-none">
                <ResumeDocument data={data} />
              </PDFViewer>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
