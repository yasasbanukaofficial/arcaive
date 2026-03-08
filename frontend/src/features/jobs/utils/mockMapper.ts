import type { JobListing, ApplyOption } from "@/@types/jobs";

export function mapToJobListing(raw: any): JobListing {
  const applyOptions: ApplyOption[] = Array.isArray(raw.applyOptions)
    ? raw.applyOptions.map((opt: any) => ({
        publisher: opt.publisher || "",
        applyLink: opt.applyLink || "",
        isDirect: opt.isDirect ?? null,
      }))
    : [];

  return {
    id: raw.jobId || Math.random().toString(),
    title: raw.jobTitle || "Position Opening",
    company: raw.employerName || "Unknown Company",
    companyLogo: raw.employerLogo || null,
    companyWebsite: raw.employerWebsite || null,
    publisher: raw.jobPublisher || "Unknown",
    employmentType: raw.jobEmploymentType || "Full-time",
    employmentTypes: Array.isArray(raw.jobEmploymentTypes)
      ? raw.jobEmploymentTypes
      : [],
    applyLink: raw.jobApplyLink || "",
    applyIsDirect: raw.jobApplyIsDirect ?? false,
    applyOptions,
    description: raw.jobDescription || "",
    isRemote: raw.jobIsRemote ?? false,
    postedAt: raw.jobPostedAt || "Recently",
    postedAtTimestamp: raw.jobPostedAtTimestamp || 0,
    postedAtDatetime: raw.jobPostedAtDatetimeUtc || new Date().toISOString(),
    location: raw.jobLocation || "Remote",
    city: raw.jobCity || "",
    state: raw.jobState || null,
    country: raw.jobCountry || "",
    salary: raw.jobSalary || null,
    minSalary: raw.jobMinSalary ?? null,
    maxSalary: raw.jobMaxSalary ?? null,
    salaryPeriod: raw.jobSalaryPeriod || null,
    highlights: raw.jobHighlights && typeof raw.jobHighlights === "object"
      ? raw.jobHighlights
      : {},
    benefits: Array.isArray(raw.jobBenefits) ? raw.jobBenefits : null,
    googleLink: raw.jobGoogleLink || "",
  };
}
