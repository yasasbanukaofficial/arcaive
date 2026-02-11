"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings } from "lucide-react";
import SettingsNav, {
  type SettingsSection,
} from "@/components/settings/SettingsNav";
import UserIdentitySection from "@/components/settings/UserIdentitySection";
import CareerIntelligenceSection from "@/components/settings/CareerIntelligenceSection";
import AgentConfigSection from "@/components/settings/AgentConfigSection";
import BillingSection from "@/components/settings/BillingSection";
import NotificationsSection from "@/components/settings/NotificationsSection";
import { fadeUp, dashboardStagger } from "@/components/dashboard/animations";

const sectionTitles: Record<
  SettingsSection,
  { title: string; description: string }
> = {
  identity: {
    title: "Identity & Authentication",
    description:
      "Manage your profile, password, multi-factor authentication, and linked accounts.",
  },
  career: {
    title: "Career Intelligence",
    description:
      "Upload your resume, manage achievements, and define target roles for the Discovery Agent.",
  },
  agents: {
    title: "Agent Configuration",
    description:
      "Fine-tune your AI agents — thresholds, persona, model selection, and filters.",
  },
  billing: {
    title: "Subscription & Billing",
    description:
      "View your plan, manage payment methods, and download invoices.",
  },
  notifications: {
    title: "Notifications & System",
    description:
      "Configure alerts, theme preferences, and data privacy options.",
  },
};

function renderSection(section: SettingsSection) {
  switch (section) {
    case "identity":
      return <UserIdentitySection />;
    case "career":
      return <CareerIntelligenceSection />;
    case "agents":
      return <AgentConfigSection />;
    case "billing":
      return <BillingSection />;
    case "notifications":
      return <NotificationsSection />;
    default:
      return null;
  }
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("identity");

  const { title, description } = sectionTitles[activeSection];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={dashboardStagger(0.08, 0.1)}
      className="max-w-7xl mx-auto"
    >
      {/* Page header */}
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: "var(--d-surface-active)",
              border: "1px solid var(--d-border)",
            }}
          >
            <Settings
              className="w-5 h-5"
              style={{ color: "var(--d-text-tertiary)" }}
            />
          </div>
          <div>
            <h1
              className="text-[22px] font-bold tracking-tight"
              style={{ color: "var(--d-text-primary)" }}
            >
              Settings
            </h1>
            <p
              className="text-[13px] mt-0.5"
              style={{ color: "var(--d-text-muted)" }}
            >
              Configure your account, agents, and preferences
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mobile nav — rendered above the flex layout so it doesn't break the grid */}
      <motion.div variants={fadeUp} className="lg:hidden mb-6">
        <div
          className="overflow-x-auto pb-2 -mx-1 px-1 rounded-xl"
          style={{
            backgroundColor: "var(--d-surface)",
            border: "1px solid var(--d-border)",
          }}
        >
          <div className="flex gap-1 p-1.5 min-w-max">
            {(
              [
                "identity",
                "career",
                "agents",
                "billing",
                "notifications",
              ] as SettingsSection[]
            ).map((id) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
                  className="relative px-3 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all duration-200"
                  style={{
                    backgroundColor: isActive
                      ? "var(--d-surface-active)"
                      : "transparent",
                    color: isActive
                      ? "var(--d-text-primary)"
                      : "var(--d-text-muted)",
                    border: isActive
                      ? "1px solid var(--d-border)"
                      : "1px solid transparent",
                  }}
                >
                  {sectionTitles[id].title.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Layout: sidebar nav + content */}
      <motion.div variants={fadeUp} className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left nav — desktop only */}
        <div className="w-60 shrink-0 hidden lg:block">
          <div className="sticky top-24">
            <SettingsNav
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Section header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-6"
            >
              <h2
                className="text-[18px] font-semibold tracking-tight mb-1"
                style={{ color: "var(--d-text-primary)" }}
              >
                {title}
              </h2>
              <p
                className="text-[13px]"
                style={{ color: "var(--d-text-muted)" }}
              >
                {description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Section content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${activeSection}`}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
              variants={dashboardStagger(0.06, 0.05)}
            >
              {renderSection(activeSection)}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
