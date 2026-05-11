"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Shield as MemberIcon,
  Brain,
  Cpu,
  Bell,
  type LucideIcon,
} from "lucide-react";

export type SettingsSection =
  | "identity"
  | "career"
  | "agents"
  | "notifications";

type NavItem = {
  id: SettingsSection;
  label: string;
  description: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  {
    id: "identity",
    label: "Identity & Auth",
    description: "Profile, password, MFA",
    icon: MemberIcon,
  },
  {
    id: "career",
    label: "Career Intelligence",
    description: "CV, achievements, skills",
    icon: Brain,
  },
  {
    id: "agents",
    label: "Agent Configuration",
    description: "Thresholds, persona, model",
    icon: Cpu,
  },
  {
    id: "notifications",
    label: "Notifications & System",
    description: "Alerts, privacy, theme",
    icon: Bell,
  },
];

type SettingsNavProps = {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  className?: string;
};

export default function SettingsNav({
  activeSection,
  onSectionChange,
  className = "",
}: SettingsNavProps) {
  return (
    <nav className={`space-y-2 ${className}`}>
      <p className="px-4 pb-4 pt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
        Control Interface
      </p>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSectionChange(item.id)}
            className={`relative flex items-center gap-4 w-full px-4 py-4 rounded-[20px] text-left transition-all duration-300 group ${
              isActive ? "bg-[var(--accent-brand)] shadow-lg shadow-[var(--accent-brand)]/10" : "hover:bg-[var(--text-primary)]/[0.03]"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                isActive ? "bg-[var(--bg-color)]/20" : "bg-[var(--text-primary)]/[0.03] border border-[var(--glass-border)]"
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] transition-colors duration-300 ${
                  isActive ? "text-[var(--accent-brand-contrast)]" : "text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]"
                }`}
              />
            </div>

            <div className="min-w-0 flex-1">
              <span
                className={`block text-[14px] font-bold tracking-tight transition-colors duration-300 ${
                  isActive ? "text-[var(--accent-brand-contrast)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`block text-[11px] font-medium mt-0.5 transition-colors duration-300 ${
                  isActive ? "text-[var(--accent-brand-contrast)]/60" : "text-[var(--text-tertiary)]"
                }`}
              >
                {item.description}
              </span>
            </div>
          </button>
        );
      })}
    </nav>
  );
}

export { navItems };
export type { NavItem };
