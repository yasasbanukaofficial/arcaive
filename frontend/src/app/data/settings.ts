import {
  Chrome,
  Github,
  Linkedin,
  Zap,
  Info,
  Gauge,
  LucideIcon,
} from "lucide-react";

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

export type Achievement = {
  id: string;
  text: string;
  tags: string[];
  source: "ai" | "manual";
};

export type CareerIntelligenceData = {
  achievements: Achievement[];
  targetRoles: string[];
  roleSuggestions: string[];
  skillSuggestions: string[];
};

export const initialCareerIntelligenceData: CareerIntelligenceData = {
  achievements: [
    {
      id: "1",
      text: "Led migration of monolithic Java application to microservices architecture, reducing deployment time by 73%.",
      tags: ["Java", "Microservices", "Docker", "Kubernetes"],
      source: "ai",
    },
    {
      id: "2",
      text: "Built real-time analytics pipeline processing 2M+ events/day using Kafka and Flink.",
      tags: ["Kafka", "Apache Flink", "Python", "AWS"],
      source: "ai",
    },
    {
      id: "3",
      text: "Designed and implemented OAuth 2.0 + OIDC authentication layer for multi-tenant SaaS platform.",
      tags: ["OAuth", "Security", "Node.js"],
      source: "manual",
    },
  ],
  targetRoles: ["Senior Backend Engineer", "Tech Lead"],
  roleSuggestions: [
    "Senior Backend Engineer",
    "Tech Lead",
    "Staff Engineer",
    "Principal Engineer",
    "Engineering Manager",
    "Solutions Architect",
    "DevOps Engineer",
    "Senior Frontend Engineer",
    "Full-Stack Developer",
    "Platform Engineer",
    "Site Reliability Engineer",
    "Data Engineer",
    "ML Engineer",
  ],
  skillSuggestions: [
    "Python",
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "AWS",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
    "Redis",
    "GraphQL",
    "REST API",
    "CI/CD",
    "Terraform",
    "Go",
    "Rust",
    "Java",
    "Machine Learning",
    "LLM",
  ],
};

export type PersonaOption = {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export type AgentConfigData = {
  applyThreshold: number;
  personaId: string;
  personaOptions: PersonaOption[];
  useGpt4o: boolean;
  blacklist: string;
};

export const initialAgentConfigData: AgentConfigData = {
  applyThreshold: 75,
  personaId: "bold",
  personaOptions: [
    {
      value: "bold",
      label: "Bold & Innovative",
      description: "Highlights leadership and creative problem-solving",
      icon: Zap,
    },
    {
      value: "conservative",
      label: "Conservative & Academic",
      description: "Formal tone with emphasis on research and methodology",
      icon: Info,
    },
    {
      value: "direct",
      label: "Direct & Concise",
      description: "Straight-to-the-point with minimal fluff",
      icon: Gauge,
    },
  ],
  useGpt4o: true,
  blacklist: "Palantir\nClearview AI\ncrypto trading",
};

export type PlanFeature = {
  name: string;
  active: boolean;
  strategistOnly?: boolean;
};

export type Invoice = {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "pending";
};

export type BillingData = {
  currentPlan: string;
  features: PlanFeature[];
  invoices: Invoice[];
  paymentMethod: {
    last4: string;
    expiry: string;
  };
};

export const initialBillingData: BillingData = {
  currentPlan: "Explorer",
  features: [
    { name: "AI Resume Parsing", active: true },
    { name: "Achievement Extraction", active: true },
    { name: "Discovery Agent (10 matches/day)", active: true },
    { name: "Unlimited Applications", active: false, strategistOnly: true },
    { name: "Simulation Loop", active: false, strategistOnly: true },
    {
      name: "Model Selection (GPT-4o / Claude)",
      active: false,
      strategistOnly: true,
    },
    { name: "Priority Agent Processing", active: false, strategistOnly: true },
  ],
  invoices: [
    {
      id: "INV-2026-001",
      date: "Jan 1, 2026",
      amount: "$19.00",
      status: "paid",
    },
    {
      id: "INV-2025-012",
      date: "Dec 1, 2025",
      amount: "$19.00",
      status: "paid",
    },
    {
      id: "INV-2025-011",
      date: "Nov 1, 2025",
      amount: "$19.00",
      status: "paid",
    },
  ],
  paymentMethod: {
    last4: "4242",
    expiry: "12/2027",
  },
};

export type NotificationAlerts = {
  jobMatch: boolean;
  autoApply: boolean;
  simulation: boolean;
};

export type NotificationsData = {
  alerts: NotificationAlerts;
};

export const initialNotificationsData: NotificationsData = {
  alerts: {
    jobMatch: true,
    autoApply: true,
    simulation: false,
  },
};
