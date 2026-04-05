export type MultifactorMethod = {
  enabled: boolean;
  method: "sms" | "app";
};

export type LinkedAccount = {
  provider: "google" | "github" | "linkedin";
  label: string;
  connected: boolean;
  email?: string;
  url?: string;
};

export type Member = {
  memberId?: string | null;
  memberFullName?: string;
  memberUsername?: string;
  memberEmail?: string;
  hasPassword?: boolean;
  subscriptionId?: string | null;
  jobRole?: string | null;
  experience?: string | null;
  country?: string | null;
};

export type MemberIdentityData = Member & {
  mfa: MultifactorMethod;
  linkedAccounts: LinkedAccount[];
};

export type MemberCreateRequest = {
  memberFullName: string;
  memberEmail: string;
  memberUsername?: string;
  password: string;
  jobRole?: string;
  experience?: string;
  country?: string;
};

export type MemberUpdatePayload = {
  memberFullName?: string;
  memberUsername?: string;
  memberEmail?: string;
  jobRole?: string;
  experience?: string;
  country?: string;
  summary?: string;
  experiences?: {
    role: string;
    company: string;
    location: string;
    period: string;
    bullets: string[];
  }[];
  educations?: {
    degree: string;
    institution: string;
    location: string;
    period: string;
  }[];
  skills?: {
    category: string;
    items: string[];
  }[];
  projects?: {
    name: string;
    description: string;
    bullets: string[];
    year?: string;
  }[];
  certifications?: string[];
  languages?: string[];
};

export type AuthMember = {
  email: string;
  password: string;
};

export type AtomicAchievement = {
  qualificationTerm: string;
  qualificationDescription: string;
};

export type AtomicSkillResponseDTO = {
  message?: string | null;
  achievements: AtomicAchievement[];
  targetRoles?: string[];
  detectedJobRole?: string | null;
  detectedExperience?: string | null;
  detectedCountry?: string | null;
};
