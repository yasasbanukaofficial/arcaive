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
    name: "Talent scout",
    description: "Screening opportunities and evaluating compatibility",
    status: "active",
    tasks: 24,
    icon: "🎯",
  },
  {
    name: "Resume architect",
    description: "Crafting tailored resumes for target positions",
    status: "active",
    tasks: 18,
    icon: "📄",
  },
  {
    name: "Interview coach",
    description: "Preparing personalized practice questions",
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
    title: "Resume architect finished customization",
    description: "Optimized CV for senior frontend position at Stripe",
    time: "2 min ago",
    status: "success",
  },
  {
    icon: Send,
    title: "Automated application dispatched",
    description: "Submitted application to Google for ML engineer role",
    time: "15 min ago",
    status: "success",
  },
  {
    icon: AlertCircle,
    title: "API rate limit alert",
    description: "Approaching daily quota — currently at 92% capacity",
    time: "1 hr ago",
    status: "warning",
  },
  {
    icon: FileText,
    title: "Cover letter crafted",
    description: "Generated personalized cover letter for product designer role at Figma",
    time: "3 hrs ago",
    status: "success",
  },
  {
    icon: CheckCircle2,
    title: "Interview preparation completed",
    description: "Completed mock interview session for system design assessment",
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
    label: "Total API requests",
    value: "12,847",
    change: "+14.2%",
    trending: "up",
    icon: Activity,
    color: "from-blue-500/20 to-blue-600/5",
    borderColor: "border-blue-500/10",
  },
  {
    label: "Active agents",
    value: "6",
    change: "+2",
    trending: "up",
    icon: Zap,
    color: "from-amber-500/20 to-amber-600/5",
    borderColor: "border-amber-500/10",
  },
  {
    label: "Applications sent",
    value: "342",
    change: "+28.5%",
    trending: "up",
    icon: MessageSquare,
    color: "from-emerald-500/20 to-emerald-600/5",
    borderColor: "border-emerald-500/10",
  },
  {
    label: "Avg response time",
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
    title: "Multi-agent swarm v2",
    description: "Our most sophisticated AI orchestration system to date.",
    tag: "New",
  },
  {
    icon: "🖼️",
    title: "Visual resume builder",
    description: "Next-generation template generation with intelligent design.",
    tag: "Beta",
  },
  {
    icon: "🎬",
    title: "Interview simulator 3.0",
    description: "Enhanced with real-time video analysis and adaptive questioning.",
    tag: "New",
  },
  {
    icon: "🔊",
    title: "Voice practice mode",
    description: "Refine your verbal communication with intelligent AI feedback.",
    tag: "Coming soon",
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
    title: "Resume builder",
    description: "AI-powered resume optimization for targeted job opportunities",
    icon: FileText,
    gradient: "from-blue-500/10 to-cyan-500/5",
    tag: "Popular",
  },
  {
    title: "Mock interview",
    description: "Simulate interviews with AI coaches and receive real-time feedback",
    icon: MessageSquare,
    gradient: "from-purple-500/10 to-pink-500/5",
    tag: "New",
  },
  {
    title: "Auto apply",
    description: "Deploy intelligent agents to discover and apply for matching positions",
    icon: Bot,
    gradient: "from-amber-500/10 to-orange-500/5",
    tag: "Template",
  },
  {
    title: "Cover letter",
    description: "Craft compelling cover letters instantly with advanced AI assistance",
    icon: Sparkles,
    gradient: "from-emerald-500/10 to-teal-500/5",
    tag: "Template",
  },
];
