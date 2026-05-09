"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  BarChart3,
  Receipt,
  type LucideIcon,
} from "lucide-react";

export type BillingSection =
  | "subscription"
  | "resources"
  | "payment"
  | "invoices";

type NavItem = {
  id: BillingSection;
  label: string;
  description: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  {
    id: "subscription",
    label: "Subscription",
    description: "Plan, upgrades, downgrades",
    icon: CreditCard,
  },
  {
    id: "resources",
    label: "Resource Usage",
    description: "Monthly consumption",
    icon: BarChart3,
  },
  {
    id: "payment",
    label: "Payment Method",
    description: "Cards, billing address",
    icon: CreditCard,
  },
  {
    id: "invoices",
    label: "Invoices",
    description: "Billing history, downloads",
    icon: Receipt,
  },
];

type BillingNavProps = {
  activeSection: BillingSection;
  onSectionChange: (section: BillingSection) => void;
  className?: string;
};

export default function BillingNav({
  activeSection,
  onSectionChange,
  className = "",
}: BillingNavProps) {
  return (
    <nav className={`space-y-1 ${className}`}>
      <p className="px-3 pb-3 pt-1 text-[11px] font-medium uppercase tracking-widest text-white/25">
        Billing
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
              isActive ? "bg-[#e6efdf]" : "hover:bg-[#161616]"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="billing-nav-active"
                className="absolute inset-0 rounded-[16px] bg-[#e6efdf] border border-[#d4e8cf]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}

            <div
              className={`w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0 relative z-10 transition-colors duration-200 mt-0.5 ${
                isActive ? "bg-[#d4e8cf]" : ""
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors duration-200 ${
                  isActive ? "text-[#111111]" : "text-white/25"
                }`}
              />
            </div>

            <div className="relative z-10 min-w-0 flex-1">
              <span
                className={`block text-[13px] font-medium leading-snug transition-colors duration-200 ${
                  isActive ? "text-[#111111]" : "text-white/35"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`block text-[11px] leading-relaxed mt-0.5 transition-colors duration-200 ${
                  isActive ? "text-[#111111]/60" : "text-white/15"
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
