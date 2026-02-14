export type WorkSchedule =
  | "Full time"
  | "Part time"
  | "Internship"
  | "Project work"
  | "Volunteering";

export type EmploymentType =
  | "Full Day"
  | "Flexible Schedule"
  | "Shift work"
  | "Distant"
  | "Shift method";

export type ExperienceLevel =
  | "No experience"
  | "6 months - 1 year"
  | "1 - 2 years"
  | "2 - 4 years"
  | "4 - 6 years"
  | "6+ years";

export type JobSource = "LinkedIn" | "Serper" | "Indeed" | "Glassdoor";

export interface JobListing {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: string;
  postedDate: string;
  tags: string[];
  experienceLevel: ExperienceLevel;
  workSchedule: WorkSchedule;
  employmentType: EmploymentType;
  matchScore: number;
  whyYouMatch: string;
  source: JobSource;
  bookmarked: boolean;
  description: string;
}

export interface JobFilters {
  workSchedule: WorkSchedule[];
  employmentType: EmploymentType[];
  experienceLevel: ExperienceLevel[];
  salaryRange: [number, number];
  sources: JobSource[];
}

export type SortOption =
  | "last_updated"
  | "match_score"
  | "salary_high"
  | "salary_low"
  | "date_newest";
