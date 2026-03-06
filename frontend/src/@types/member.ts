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
  password?: string;
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

export type AtomicAchievement = {
  qualificationTerm: string;
  qualificationDescription: string;
};

export type AtomicSkillResponseDTO = {
  message?: string | null;
  achievements: AtomicAchievement[];
  targetRoles?: string[];
};
