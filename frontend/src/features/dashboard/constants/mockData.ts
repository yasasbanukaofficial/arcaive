import type { LucideIcon } from "lucide-react";
import {
  Bot,
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  Activity,
  Zap,
  Clock,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export interface AgentData {
  name: string;
  description: string;
  status: "active" | "paused";
  tasks: number;
  icon: string;
}

export const DUMMY_AGENTS: AgentData[] = [
  {
    name: "Recruiter Agent",
    description: "Screening roles & scoring fit",
    status: "active",
    tasks: 24,
    icon: "🎯",
  },
  {
    name: "Resume Agent",
    description: "Tailoring CVs for applications",
    status: "active",
    tasks: 18,
    icon: "📄",
  },
  {
    name: "Interview Prep",
    description: "Generating mock questions",
    status: "paused",
    tasks: 7,
    icon: "🎤",
  },
];

export interface ActivityData {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  status: "success" | "warning";
}

export const DUMMY_ACTIVITIES: ActivityData[] = [
  {
    icon: Bot,
    title: "Resume Agent completed tailoring",
    description: "Tailored CV for Senior Frontend role at Stripe",
    time: "2 min ago",
    status: "success",
  },
  {
    icon: Send,
    title: "Auto-apply submitted",
    description: "Application sent to Google — ML Engineer",
    time: "15 min ago",
    status: "success",
  },
  {
    icon: AlertCircle,
    title: "API rate limit warning",
    description: "Approaching daily limit — 92% usage",
    time: "1 hr ago",
    status: "warning",
  },
  {
    icon: FileText,
    title: "Cover letter generated",
    description: "For Product Designer position at Figma",
    time: "3 hrs ago",
    status: "success",
  },
  {
    icon: CheckCircle2,
    title: "Interview prep completed",
    description: "Mock interview for System Design round",
    time: "5 hrs ago",
    status: "success",
  },
];

export interface StatData {
  label: string;
  value: string;
  change: string;
  trending: "up" | "down";
  icon: LucideIcon;
  color: string;
  borderColor: string;
}

export const DUMMY_STATS: StatData[] = [
  {
    label: "Total API Requests",
    value: "12,847",
    change: "+14.2%",
    trending: "up",
    icon: Activity,
    color: "from-blue-500/20 to-blue-600/5",
    borderColor: "border-blue-500/10",
  },
  {
    label: "Active Agents",
    value: "6",
    change: "+2",
    trending: "up",
    icon: Zap,
    color: "from-amber-500/20 to-amber-600/5",
    borderColor: "border-amber-500/10",
  },
  {
    label: "Applications Sent",
    value: "342",
    change: "+28.5%",
    trending: "up",
    icon: MessageSquare,
    color: "from-emerald-500/20 to-emerald-600/5",
    borderColor: "border-emerald-500/10",
  },
  {
    label: "Avg Response Time",
    value: "1.2s",
    change: "-8.3%",
    trending: "down",
    icon: Clock,
    color: "from-purple-500/20 to-purple-600/5",
    borderColor: "border-purple-500/10",
  },
];

export const USAGE_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const USAGE_DATA = [72, 56, 63, 48, 38, 34, 42];

export interface WhatsNewItem {
  icon: string;
  title: string;
  description: string;
  tag: string;
}

export const DUMMY_WHATS_NEW: WhatsNewItem[] = [
  {
    icon: "✨",
    title: "Multi-Agent Swarm v2",
    description: "Our most intelligent orchestration yet.",
    tag: "New",
  },
  {
    icon: "🖼️",
    title: "Visual Resume Builder",
    description: "State-of-the-art template generation.",
    tag: "Beta",
  },
  {
    icon: "🎬",
    title: "Interview Simulator 3.0",
    description: "Now with real-time video analysis.",
    tag: "New",
  },
  {
    icon: "🔊",
    title: "Voice Practice Mode",
    description: "Practice verbal responses with AI feedback.",
    tag: "Coming Soon",
  },
];

export interface QuickActionTemplate {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  tag: string;
}

export const DUMMY_QUICK_ACTIONS: QuickActionTemplate[] = [
  {
    title: "Resume Builder",
    description: "AI-powered resume tailoring for specific job descriptions",
    icon: FileText,
    gradient: "from-blue-500/10 to-cyan-500/5",
    tag: "Popular",
  },
  {
    title: "Mock Interview",
    description: "Practice with AI interviewers and get instant feedback",
    icon: MessageSquare,
    gradient: "from-purple-500/10 to-pink-500/5",
    tag: "New",
  },
  {
    title: "Auto Apply",
    description: "Let our agents find and apply to matching roles for you",
    icon: Bot,
    gradient: "from-amber-500/10 to-orange-500/5",
    tag: "Template",
  },
  {
    title: "Cover Letter",
    description: "Generate tailored cover letters in seconds with AI",
    icon: Sparkles,
    gradient: "from-emerald-500/10 to-teal-500/5",
    tag: "Template",
  },
];
