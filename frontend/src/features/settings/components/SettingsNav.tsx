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
    <nav className={`space-y-1 ${className}`}>
      <p className="px-3 pb-3 pt-1 text-[11px] font-medium uppercase tracking-widest text-white/25">
        Settings
      </p>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSectionChange(item.id)}
            className={`relative flex items-start gap-3 w-full px-3 py-3 rounded-[16px] text-left transition-all duration-200 group ${
              isActive ? "bg-[#1f1f1f]" : "hover:bg-[#161616]"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="settings-nav-active"
                className="absolute inset-0 rounded-[16px] bg-[#1f1f1f] border border-[#2a2a2a]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}

            <div
              className={`w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0 relative z-10 transition-colors duration-200 mt-0.5 ${
                isActive ? "bg-[#2a2a2a]" : ""
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors duration-200 ${
                  isActive ? "text-white/80" : "text-white/25"
                }`}
              />
            </div>

            <div className="relative z-10 min-w-0 flex-1">
              <span
                className={`block text-[13px] font-medium leading-snug transition-colors duration-200 ${
                  isActive ? "text-white/80" : "text-white/35"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`block text-[11px] leading-relaxed mt-0.5 transition-colors duration-200 ${
                  isActive ? "text-white/35" : "text-white/15"
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
