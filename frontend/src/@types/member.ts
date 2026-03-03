import type { LucideIcon } from "lucide-react";

export type MultifactorMethod = {
  enabled: boolean;
  method: "sms" | "app";
};

export type LinkedAccount = {
  provider: "google" | "github" | "linkedin";
  label: string;
  icon: LucideIcon;
  connected: boolean;
  email?: string;
};

export type SocialLinks = {
  githubLink?: string | null;
  linkedinLink?: string | null;
};

export type Member = {
  memberId?: string | null;
  memberFullName?: string;
  memberUsername?: string;
  memberEmail?: string;
  password?: string;
  socialLinks?: {
    githubLink?: string | null;
    linkedinLink?: string | null;
  } | null;
  memberTier?: string | null;
  subscriptionId?: string | null;
};

export type MemberIdentityData = Member & {
  mfa: MultifactorMethod;
  linkedAccounts: LinkedAccount[];
};

export type AuthMember = {
  email: string;
  password: string;
};
