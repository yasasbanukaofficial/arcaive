import { Zap, Info, Gauge } from "lucide-react";
import type { CareerIntelligenceData } from "../types/career";
import type { AgentConfigData } from "../types/agent";
import type { BillingData } from "../types/billing";
import type { NotificationsData } from "../types/notifications";

export const initialCareerIntelligenceData: CareerIntelligenceData = {
  achievements: [
    {
      id: "1",
      competencyTerm: "Cloud-Native Microservices Architecture",
      competencyDescription: "Able to decompose monolithic systems into independently deployable microservices using containerization (Docker) and orchestration (Kubernetes), significantly reducing deployment cycles and improving scalability.",
      source: "ai",
    },
    {
      id: "2",
      competencyTerm: "Real-Time Data Pipeline Engineering",
      competencyDescription: "Able to design and operate high-throughput, event-driven data pipelines using distributed streaming platforms (e.g., Apache Kafka, Apache Flink) to process millions of events per day for real-time analytics.",
      source: "ai",
    },
    {
      id: "3",
      competencyTerm: "Identity & Access Management",
      competencyDescription: "Able to architect and implement production-grade authentication and authorization flows (OAuth 2.0, OpenID Connect) for multi-tenant SaaS environments, ensuring secure user isolation and compliance.",
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

export const initialNotificationsData: NotificationsData = {
  alerts: {
    jobMatch: true,
    autoApply: true,
    simulation: false,
  },
};
