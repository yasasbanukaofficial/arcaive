export interface ApplyOption {
  publisher: string;
  applyLink: string;
  isDirect: boolean | null;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  companyLogo: string | null;
  companyWebsite: string | null;
  publisher: string;
  employmentType: string;
  employmentTypes: string[];
  applyLink: string;
  applyIsDirect: boolean;
  applyOptions: ApplyOption[];
  description: string;
  isRemote: boolean;
  postedAt: string;
  postedAtTimestamp: number;
  postedAtDatetime: string;
  location: string;
  city: string;
  state: string | null;
  country: string;
  salary: string | null;
  minSalary: number | null;
  maxSalary: number | null;
  salaryPeriod: string | null;
  highlights: Record<string, string[]>;
  benefits: string[] | null;
  googleLink: string;
}

export type SortOption =
  | "last_updated"
  | "salary_high"
  | "salary_low"
  | "date_newest";
