import * as Yup from "yup";
import { z } from "zod";
import { ResumeData } from "@/@types/resume";

const isBlank = (value?: string) => !value || !value.trim();

const hasAnyValue = (values: Array<string | undefined>) =>
  values.some((v) => !isBlank(v));

const phoneRegex = /^\+?[0-9()\-\s]{7,20}$/;
const linkedinRegex = /^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/.+/i;

export const onboardingStepSchemas = {
  1: Yup.object({
    fullName: Yup.string().trim().required("Full name is required"),
    email: Yup.string().trim().email("Enter a valid email").required("Email is required"),
    phone: Yup.string()
      .trim()
      .required("Phone is required")
      .matches(phoneRegex, "Enter a valid phone number"),
    location: Yup.string().trim().required("Location is required"),
    linkedin: Yup.string()
      .trim()
      .required("LinkedIn is required")
      .matches(linkedinRegex, "Enter a valid LinkedIn URL"),
    specializations: Yup.array().of(Yup.string().trim()).min(1, "At least one specialization is required"),
  }),
  2: Yup.object({
    summary: Yup.string().trim().required("Summary is required"),
  }),
  3: Yup.object({
    workExperience: Yup.array()
      .of(
        Yup.object({
          role: Yup.string().optional(),
          company: Yup.string().optional(),
          location: Yup.string().optional(),
          period: Yup.string().optional(),
          bullets: Yup.array().of(Yup.string().optional()).optional(),
        }),
      )
      .test("complete-experience", "Complete all fields for each work experience", (arr) => {
        const list = arr || [];
        return list.every((item) => {
          const bullets = (item?.bullets || []).map((b) => (b || "").trim()).filter(Boolean);
          const hasAny = hasAnyValue([
            item?.role,
            item?.company,
            item?.location,
            item?.period,
            bullets.length ? "has-bullets" : "",
          ]);
          if (!hasAny) return true;
          return !isBlank(item?.role) && !isBlank(item?.company) && !isBlank(item?.location) && !isBlank(item?.period) && bullets.length > 0;
        });
      }),
  }),
  4: Yup.object({
    education: Yup.array()
      .of(
        Yup.object({
          degree: Yup.string().optional(),
          institution: Yup.string().optional(),
          location: Yup.string().optional(),
          period: Yup.string().optional(),
        }),
      )
      .test("complete-education", "Complete all fields for each education entry", (arr) => {
        const list = arr || [];
        return list.every((item) => {
          const hasAny = hasAnyValue([
            item?.degree,
            item?.institution,
            item?.location,
            item?.period,
          ]);
          if (!hasAny) return true;
          return !isBlank(item?.degree) && !isBlank(item?.institution) && !isBlank(item?.location) && !isBlank(item?.period);
        });
      }),
  }),
  5: Yup.object({
    skills: Yup.array()
      .of(
        Yup.object({
          category: Yup.string().optional(),
          items: Yup.array().of(Yup.string().optional()).optional(),
        }),
      )
      .test("complete-skills", "Complete all fields for each skill category", (arr) => {
        const list = arr || [];
        return list.every((item) => {
          const items = (item?.items || []).map((x) => (x || "").trim()).filter(Boolean);
          const hasAny = hasAnyValue([item?.category, items.length ? "has-items" : ""]);
          if (!hasAny) return true;
          return !isBlank(item?.category) && items.length > 0;
        });
      }),
  }),
  6: Yup.object({
    projects: Yup.array()
      .of(
        Yup.object({
          name: Yup.string().optional(),
          description: Yup.string().optional(),
          year: Yup.string().optional(),
          bullets: Yup.array().of(Yup.string().optional()).optional(),
        }),
      )
      .test("complete-projects", "Complete required fields for each project", (arr) => {
        const list = arr || [];
        return list.every((item) => {
          const bullets = (item?.bullets || []).map((x) => (x || "").trim()).filter(Boolean);
          const hasAny = hasAnyValue([
            item?.name,
            item?.description,
            item?.year,
            bullets.length ? "has-bullets" : "",
          ]);
          if (!hasAny) return true;
          return !isBlank(item?.name) && !isBlank(item?.description);
        });
      }),
  }),
  7: Yup.object({
    memberName: Yup.string().trim().required("Account name is required"),
    memberEmail: Yup.string().trim().email("Enter a valid account email").required("Account email is required"),
    memberJobRole: Yup.string().trim().required("Job role is required"),
    memberCountry: Yup.string().trim().required("Country is required"),
  }),
} as const;

const zExperience = z.object({
  role: z.string().trim().min(1),
  company: z.string().trim().min(1),
  location: z.string().trim().min(1),
  period: z.string().trim().min(1),
  bullets: z.array(z.string().trim().min(1)).default([]),
});

const zEducation = z.object({
  degree: z.string().trim().min(1),
  institution: z.string().trim().min(1),
  location: z.string().trim().min(1),
  period: z.string().trim().min(1),
});

const zSkill = z.object({
  category: z.string().trim().min(1),
  items: z.array(z.string().trim().min(1)).default([]),
});

const zProject = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  bullets: z.array(z.string().trim().min(1)).default([]),
  year: z.string().trim().optional(),
});

export const onboardingSubmitSchema = z.object({
  memberFullName: z.string().trim().min(1),
  memberEmail: z.string().trim().email(),
  jobRole: z.string().trim().optional(),
  country: z.string().trim().optional(),
  summary: z.string().trim().optional(),
  experiences: z.array(zExperience),
  educations: z.array(zEducation),
  skills: z.array(zSkill),
  projects: z.array(zProject),
  certifications: z.array(z.string().trim().min(1)),
  languages: z.array(z.string().trim().min(1)),
});

const cleanString = (value?: string) => {
  const trimmed = (value || "").trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export function buildOnboardingPayload(draft: ResumeData, account: {
  memberName: string;
  memberEmail: string;
  memberJobRole: string;
  memberCountry: string;
}) {
  const experiences = (draft.workExperience || [])
    .map((x) => ({
      role: (x.role || "").trim(),
      company: (x.company || "").trim(),
      location: (x.location || "").trim(),
      period: (x.period || "").trim(),
      bullets: (x.bullets || []).map((b) => (b || "").trim()).filter(Boolean),
    }))
    .filter((x) => x.role || x.company || x.location || x.period || x.bullets.length > 0)
    .filter((x) => x.role && x.company && x.location && x.period && x.bullets.length > 0);

  const educations = (draft.education || [])
    .map((x) => ({
      degree: (x.degree || "").trim(),
      institution: (x.institution || "").trim(),
      location: (x.location || "").trim(),
      period: (x.period || "").trim(),
    }))
    .filter((x) => x.degree || x.institution || x.location || x.period)
    .filter((x) => x.degree && x.institution && x.location && x.period);

  const skills = (draft.skills || [])
    .map((x) => ({
      category: (x.category || "").trim(),
      items: (x.items || []).map((i) => (i || "").trim()).filter(Boolean),
    }))
    .filter((x) => x.category || x.items.length > 0)
    .filter((x) => x.category && x.items.length > 0);

  const projects = (draft.projects || [])
    .map((x) => ({
      name: (x.name || "").trim(),
      description: (x.description || "").trim(),
      bullets: (x.bullets || []).map((b) => (b || "").trim()).filter(Boolean),
      year: cleanString(x.year),
    }))
    .filter((x) => x.name || x.description || x.bullets.length > 0 || x.year)
    .filter((x) => x.name && x.description);

  const base = {
    memberFullName: (account.memberName || draft.personalInfo.fullName || "").trim(),
    memberEmail: (account.memberEmail || draft.personalInfo.email || "").trim(),
    jobRole: cleanString(account.memberJobRole) ?? cleanString(draft.personalInfo.specializations?.[0]),
    country: cleanString(account.memberCountry) ?? cleanString(draft.personalInfo.location),
    summary: cleanString(draft.summary),
    experiences,
    educations,
    skills,
    projects,
    certifications: (draft.certifications || []).map((c) => (c || "").trim()).filter(Boolean),
    languages: (draft.languages || []).map((l) => (l || "").trim()).filter(Boolean),
  };

  const parsed = onboardingSubmitSchema.safeParse(base);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    throw new Error(firstIssue?.message || "Invalid profile data");
  }

  const data = parsed.data;

  return {
    memberFullName: data.memberFullName,
    memberEmail: data.memberEmail,
    ...(data.jobRole ? { jobRole: data.jobRole } : {}),
    ...(data.country ? { country: data.country } : {}),
    ...(data.summary ? { summary: data.summary } : {}),
    experiences: data.experiences,
    educations: data.educations,
    skills: data.skills,
    projects: data.projects,
    certifications: data.certifications,
    languages: data.languages,
  };
}
