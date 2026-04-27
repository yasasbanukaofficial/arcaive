"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Plus,
  Trash2,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { memberAPI } from "@/features/settings/api/memberAPI";
import { Member, MemberUpdatePayload } from "@/@types/member";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import TextArea from "@/components/ui/TextArea";
import TagInput from "@/components/ui/TagInput";

const STEPS = [
  { id: 1, title: "Personal Info" },
  { id: 2, title: "Summary" },
  { id: 3, title: "Experience" },
  { id: 4, title: "Education" },
  { id: 5, title: "Skills" },
  { id: 6, title: "Projects & Certs" },
];

export default function ManualOnboardingPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<MemberUpdatePayload>({
    memberFullName: "",
    memberEmail: "",
    jobRole: "",
    experience: "",
    location: "",
    phone: "",
    summary: "",
    experiences: [],
    educations: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const member: Member = await memberAPI.get();
        setFormData({
          memberFullName: member.memberFullName || "",
          memberEmail: member.memberEmail || "",
          jobRole: member.jobRole || "",
          experience: member.experience || "",
          location: member.location || member.country || "",
          phone: member.phone || "",
          summary: member.summary || "",
          experiences: member.experiences || [],
          educations: member.educations || [],
          skills: member.skills || [],
          projects: member.projects || [],
          certifications: member.certifications || [],
          languages: member.languages || [],
        });
      } catch (err) {
        console.error("Failed to fetch member details", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      void handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { memberEmail, ...payload } = formData;
      await memberAPI.update(payload);
      
      router.push("/overview");
      addToast({
        type: "success",
        title: "Profile Ready",
        description: "Your professional profile has been set up successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Update Failed",
        description: "Something went wrong while saving your profile.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--d-bg)]">
        <Loader2 className="w-10 h-10  animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c0d] text-gray-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="mb-12 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight text-white host-grotesk">
                Guided Setup
              </h1>
              <p className="text-base text-gray-400">
                Let&apos;s build your professional identity together.
              </p>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2  bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <span className="text-xs font-bold uppercase tracking-widest text-black">Step {currentStep} of {STEPS.length}</span>
            </div>
          </div>

          <div className="relative h-1 w-full bg-white/[0.05]  overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-black"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            />
          </div>

          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4 no-scrollbar">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex flex-col items-center gap-3 min-w-[80px]">
                <div className={`w-10 h-10  flex items-center justify-center text-sm font-bold  duration-300 border ${
                  currentStep === s.id 
                    ? "bg-black border-black text-white scale-110" 
                    : currentStep > s.id 
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" 
                      : "bg-white/[0.03] text-white/20 border-white/5"
                }`}>
                  {currentStep > s.id ? <Check className="w-5 h-5" /> : s.id}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                  currentStep === s.id ? "text-black" : "text-white/20"
                }`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white/[0.03] backdrop-blur-xl  border border-white/10 p-8 sm:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]"
        >
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <TextField 
                  label="Full Name" 
                  value={formData.memberFullName ?? ""} 
                  onChange={(e) => setFormData({...formData, memberFullName: e.target.value})} 
                />
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-gray-400 ml-1">Email Address</label>
                  <div className="w-full  px-4 py-3 text-white placeholder:text-gray-600 bg-white/[0.03] border border-white/10 text-sm font-semibold flex items-center">
                    {formData.memberEmail}
                  </div>
                  <p className="text-[10px] text-emerald-400/90 uppercase font-bold tracking-widest ml-1">Verified Account</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <TextField 
                  label="Target Job Role" 
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.jobRole ?? ""} 
                  onChange={(e) => setFormData({...formData, jobRole: e.target.value})} 
                />
                <TextField 
                  label="Experience Level" 
                  placeholder="e.g. 5+ Years"
                  value={formData.experience ?? ""} 
                  onChange={(e) => setFormData({...formData, experience: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <TextField 
                  label="Location" 
                  placeholder="e.g. San Francisco, CA"
                  value={formData.location ?? ""} 
                  onChange={(e) => setFormData({...formData, location: e.target.value})} 
                />
                <TextField 
                  label="Phone Number" 
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone ?? ""} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <TextArea 
                label="Professional Summary" 
                placeholder="Write a brief overview of your professional background and key strengths..."
                value={formData.summary || ""} 
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                rows={10}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Work Experience</h3>
                <Button variant="secondary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setFormData({
                  ...formData,
                  experiences: [...(formData.experiences || []), { role: "", company: "", location: "", period: "", bullets: [""] }]
                })}>Add Role</Button>
              </div>
              <div className="space-y-6">
                {formData.experiences?.map((exp, idx) => (
                  <div key={idx} className="relative p-8  bg-white/[0.03] border border-white/10 space-y-6 group hover:border-white/20 ">
                    <button 
                      onClick={() => setFormData({...formData, experiences: formData.experiences?.filter((_, i) => i !== idx)})}
                      className="absolute top-6 right-6 p-2 text-white/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <TextField label="Role" value={exp.role} onChange={(e) => {
                        const newExp = [...(formData.experiences || [])];
                        newExp[idx].role = e.target.value;
                        setFormData({...formData, experiences: newExp});
                      }} />
                      <TextField label="Company" value={exp.company} onChange={(e) => {
                        const newExp = [...(formData.experiences || [])];
                        newExp[idx].company = e.target.value;
                        setFormData({...formData, experiences: newExp});
                      }} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <TextField label="Period" placeholder="e.g. 2020 - Present" value={exp.period} onChange={(e) => {
                        const newExp = [...(formData.experiences || [])];
                        newExp[idx].period = e.target.value;
                        setFormData({...formData, experiences: newExp});
                      }} />
                      <TextField label="Location" value={exp.location} onChange={(e) => {
                        const newExp = [...(formData.experiences || [])];
                        newExp[idx].location = e.target.value;
                        setFormData({...formData, experiences: newExp});
                      }} />
                    </div>
                    <TextArea label="Responsibilities (One per line)" value={exp.bullets.join("\n")} onChange={(e) => {
                      const newExp = [...(formData.experiences || [])];
                      newExp[idx].bullets = e.target.value.split("\n");
                      setFormData({...formData, experiences: newExp});
                    }} rows={4} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Education</h3>
                <Button variant="secondary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setFormData({
                  ...formData,
                  educations: [...(formData.educations || []), { degree: "", institution: "", location: "", period: "" }]
                })}>Add Study</Button>
              </div>
              <div className="space-y-6">
                {formData.educations?.map((edu, idx) => (
                  <div key={idx} className="relative p-8  bg-white/[0.03] border border-white/10 space-y-6 group hover:border-white/20 ">
                    <button 
                      onClick={() => setFormData({...formData, educations: formData.educations?.filter((_, i) => i !== idx)})}
                      className="absolute top-6 right-6 p-2 text-white/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <TextField label="Degree" value={edu.degree} onChange={(e) => {
                        const newEdu = [...(formData.educations || [])];
                        newEdu[idx].degree = e.target.value;
                        setFormData({...formData, educations: newEdu});
                      }} />
                      <TextField label="Institution" value={edu.institution} onChange={(e) => {
                        const newEdu = [...(formData.educations || [])];
                        newEdu[idx].institution = e.target.value;
                        setFormData({...formData, educations: newEdu});
                      }} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <TextField label="Period" value={edu.period} onChange={(e) => {
                        const newEdu = [...(formData.educations || [])];
                        newEdu[idx].period = e.target.value;
                        setFormData({...formData, educations: newEdu});
                      }} />
                      <TextField label="Location" value={edu.location} onChange={(e) => {
                        const newEdu = [...(formData.educations || [])];
                        newEdu[idx].location = e.target.value;
                        setFormData({...formData, educations: newEdu});
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-10">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Expertise</h3>
                  <Button variant="secondary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setFormData({
                    ...formData,
                    skills: [...(formData.skills || []), { category: "", items: [] }]
                  })}>Add Category</Button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {formData.skills?.map((skill, idx) => (
                    <div key={idx} className="relative p-8  bg-white/[0.03] border border-white/10 space-y-6 group hover:border-white/20 ">
                      <button 
                        onClick={() => setFormData({...formData, skills: formData.skills?.filter((_, i) => i !== idx)})}
                        className="absolute top-6 right-6 p-2 text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <TextField label="Category" placeholder="e.g. Technologies" value={skill.category} onChange={(e) => {
                        const newSkills = [...(formData.skills || [])];
                        newSkills[idx].category = e.target.value;
                        setFormData({...formData, skills: newSkills});
                      }} />
                      <TagInput 
                        label="Skills" 
                        placeholder="Type and press enter..."
                        tags={skill.items} 
                        onChange={(tags) => {
                          const newSkills = [...(formData.skills || [])];
                          newSkills[idx].items = tags;
                          setFormData({...formData, skills: newSkills});
                        }} 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 p-8  bg-white/[0.03] border border-white/10 hover:border-white/20 ">
                <h3 className="text-xl font-bold text-white">Languages</h3>
                <TagInput 
                  placeholder="e.g. English, German"
                  tags={formData.languages || []} 
                  onChange={(langs) => setFormData({...formData, languages: langs})} 
                />
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-10">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Featured Projects</h3>
                  <Button variant="secondary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setFormData({
                    ...formData,
                    projects: [...(formData.projects || []), { name: "", description: "", bullets: [], year: "" }]
                  })}>Add Project</Button>
                </div>
                <div className="space-y-6">
                  {formData.projects?.map((proj, idx) => (
                    <div key={idx} className="relative p-8  bg-white/[0.03] border border-white/10 space-y-6 group hover:border-white/20 ">
                      <button 
                        onClick={() => setFormData({...formData, projects: formData.projects?.filter((_, i) => i !== idx)})}
                        className="absolute top-6 right-6 p-2 text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <TextField label="Project Name" value={proj.name} onChange={(e) => {
                          const newProjs = [...(formData.projects || [])];
                          newProjs[idx].name = e.target.value;
                          setFormData({...formData, projects: newProjs});
                        }} />
                        <TextField label="Year" value={proj.year || ""} onChange={(e) => {
                          const newProjs = [...(formData.projects || [])];
                          newProjs[idx].year = e.target.value;
                          setFormData({...formData, projects: newProjs});
                        }} />
                      </div>
                      <TextArea label="Description" value={proj.description} onChange={(e) => {
                        const newProjs = [...(formData.projects || [])];
                        newProjs[idx].description = e.target.value;
                        setFormData({...formData, projects: newProjs});
                      }} rows={3} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 p-8  bg-white/[0.03] border border-white/10 hover:border-white/20 ">
                <h3 className="text-xl font-bold text-white">Certifications</h3>
                <TagInput 
                  placeholder="e.g. AWS Certified Developer"
                  tags={formData.certifications || []} 
                  onChange={(certs) => setFormData({...formData, certifications: certs})} 
                />
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
            <Button 
              variant="secondary" 
              onClick={handleBack} 
              disabled={currentStep === 1 || submitting}
              icon={<ArrowLeft className="w-4 h-4" />}
              className="bg-white/[0.03] border-white/10 hover:bg-white/[0.08]"
            >
              Back
            </Button>
            <Button 
              variant="primary" 
              onClick={handleNext} 
              loading={submitting}
              icon={currentStep === STEPS.length ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="min-w-[160px] bg-black hover:bg-[#222] border border-black"
            >
              {currentStep === STEPS.length ? "Finish Setup" : "Continue"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
