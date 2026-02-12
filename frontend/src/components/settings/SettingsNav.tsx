"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Brain,
  Cpu,
  CreditCard,
  Bell,
  type LucideIcon,
} from "lucide-react";

export type SettingsSection =
  | "identity"
  | "career"
  | "agents"
  | "billing"
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
    icon: User,
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
    id: "billing",
    label: "Subscription & Billing",
    description: "Plan, payments, invoices",
    icon: CreditCard,
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
      <p
        className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.2em]"
        style={{ color: "var(--d-text-muted)" }}
      >
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
            className="relative flex items-start gap-3 w-full px-3 py-3 rounded-xl text-left transition-all duration-200 group"
            style={{
              backgroundColor: isActive
                ? "var(--d-surface-active)"
                : "transparent",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="settings-nav-active"
                className="absolute inset-0 rounded-xl"
                style={{
                  backgroundColor: "var(--d-surface-active)",
                  border: "1px solid var(--d-border)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}

            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 relative z-10 transition-colors duration-200 mt-0.5"
              style={{
                backgroundColor: isActive
                  ? "var(--d-surface-hover)"
                  : "transparent",
                border: isActive
                  ? "1px solid var(--d-border)"
                  : "1px solid transparent",
              }}
            >
              <Icon
                className="w-5 h-5 transition-colors duration-200"
                style={{
                  color: isActive
                    ? "var(--d-text-primary)"
                    : "var(--d-text-muted)",
                }}
              />
            </div>

            <div className="relative z-10 min-w-0 flex-1">
              <span
                className="block text-[14px] font-medium leading-snug transition-colors duration-200"
                style={{
                  color: isActive
                    ? "var(--d-text-primary)"
                    : "var(--d-text-tertiary)",
                }}
              >
                {item.label}
              </span>
              <span
                className="block text-[12px] leading-relaxed mt-0.5 transition-colors duration-200"
                style={{
                  color: isActive
                    ? "var(--d-text-muted)"
                    : "var(--d-text-ghost)",
                }}
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
