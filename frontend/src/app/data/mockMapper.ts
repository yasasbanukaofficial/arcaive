import { Chrome } from "lucide-react";
import { MemberIdentityData } from "./settings";

export function mapToJobListing(mock: any) {
  let safeTags: string[] = [];
  try {
    if (mock.qualifications) {
      const parsed =
        typeof mock.qualifications === "string"
          ? JSON.parse(mock.qualifications)
          : mock.qualifications;

      safeTags = Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    console.error("Tag parsing failed for job:", mock.id);
    safeTags = [];
  }

  return {
    id: mock.id || Math.random().toString(),
    title: mock.title || "Position Opening",
    company: mock.company || "Stealth Startup",
    companyLogo: `https://api.dicebear.com/7.x/initials/svg?seed=${mock.company || "Company"}`,
    location: mock.location || "Remote",
    salary: `$${(mock.salary_from || 0) / 1000}k - $${(mock.salary_to || 0) / 1000}k`,
    postedDate: mock.created_at || new Date().toISOString(),
    tags: safeTags,
    experienceLevel: "2 - 4 years",
    workSchedule: "Full time",
    employmentType: mock.is_remote_work ? "Distant" : "Full Day",
    matchScore: Math.floor(Math.random() * 20) + 80,
    whyYouMatch: "Matches your core technical stack.",
    source: "LinkedIn",
    bookmarked: false,
    description: mock.description || "",
  };
}

export function mapToMember(mock: any): MemberIdentityData {
  return {
    profile: {
      fullName: mock.name,
      email: mock.email,
    },
    mfa: {
      enabled: true,
      method: (mock.mfa_method === "sms" ? "sms" : "app") as "sms" | "app",
    },
    linkedAccounts: [
      {
        provider: "google",
        label: "Google",
        icon: Chrome,
        connected: true,
        email: mock.email,
      },
    ],
  };
}
