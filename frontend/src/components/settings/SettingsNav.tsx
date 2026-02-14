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
import { useTheme } from "@/components/dashboard/ThemeContext";

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
  const { isDark } = useTheme();
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
                ? isDark
                  ? "var(--d-surface-active)"
                  : "#000000"
                : "transparent",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="settings-nav-active"
                className="absolute inset-0 rounded-xl"
                style={{
                  backgroundColor: isDark
                    ? "var(--d-surface-active)"
                    : "#000000",
                  border: isDark ? "1px solid var(--d-border)" : "none",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}

            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 relative z-10 transition-colors duration-200 mt-0.5"
              style={{
                backgroundColor: isActive
                  ? isDark
                    ? "var(--d-surface-hover)"
                    : "rgba(255,255,255,0.1)"
                  : "transparent",
                border: isActive
                  ? isDark
                    ? "1px solid var(--d-border)"
                    : "1px solid rgba(255,255,255,0.2)"
                  : "1px solid transparent",
              }}
            >
              <Icon
                className="w-5 h-5 transition-colors duration-200"
                style={{
                  color: isActive
                    ? isDark
                      ? "var(--d-text-primary)"
                      : "#ffffff"
                    : "var(--d-text-muted)",
                }}
              />
            </div>

            <div className="relative z-10 min-w-0 flex-1">
              <span
                className="block text-[14px] font-medium leading-snug transition-colors duration-200"
                style={{
                  color: isActive
                    ? isDark
                      ? "var(--d-text-primary)"
                      : "#ffffff"
                    : "var(--d-text-tertiary)",
                }}
              >
                {item.label}
              </span>
              <span
                className="block text-[12px] leading-relaxed mt-0.5 transition-colors duration-200"
                style={{
                  color: isActive
                    ? isDark
                      ? "var(--d-text-muted)"
                      : "rgba(255,255,255,0.7)"
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
