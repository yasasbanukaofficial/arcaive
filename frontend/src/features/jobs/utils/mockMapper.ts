import type { JobListing, ApplyOption } from "@/@types/jobs";

export function mapToJobListing(raw: any): JobListing {
  const applyOptions: ApplyOption[] = Array.isArray(raw.apply_options)
    ? raw.apply_options.map((opt: any) => ({
        publisher: opt.publisher || "",
        applyLink: opt.apply_link || "",
        isDirect: opt.is_direct ?? null,
      }))
    : [];

  return {
    id: raw.job_id || Math.random().toString(),
    title: raw.job_title || "Position Opening",
    company: raw.employer_name || "Unknown Company",
    companyLogo: raw.employer_logo || null,
    companyWebsite: raw.employer_website || null,
    publisher: raw.job_publisher || "Unknown",
    employmentType: raw.job_employment_type || "Full-time",
    employmentTypes: Array.isArray(raw.job_employment_types)
      ? raw.job_employment_types
      : [],
    applyLink: raw.job_apply_link || "",
    applyIsDirect: raw.job_apply_is_direct ?? false,
    applyOptions,
    description: raw.job_description || "",
    isRemote: raw.job_is_remote ?? false,
    postedAt: raw.job_posted_at || "Recently",
    postedAtTimestamp: raw.job_posted_at_timestamp || 0,
    postedAtDatetime: raw.job_posted_at_datetime_utc || new Date().toISOString(),
    location: raw.job_location || "Remote",
    city: raw.job_city || "",
    state: raw.job_state || null,
    country: raw.job_country || "",
    salary: raw.job_salary || null,
    minSalary: raw.job_min_salary ?? null,
    maxSalary: raw.job_max_salary ?? null,
    salaryPeriod: raw.job_salary_period || null,
    highlights: raw.job_highlights && typeof raw.job_highlights === "object"
      ? raw.job_highlights
      : {},
    benefits: Array.isArray(raw.job_benefits) ? raw.job_benefits : null,
    googleLink: raw.job_google_link || "",
  };
}
