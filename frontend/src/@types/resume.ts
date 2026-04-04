export interface WorkExperience {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    specializations: string[];
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: SkillCategory[];
  certifications: string[];
}
