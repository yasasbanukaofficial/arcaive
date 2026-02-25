"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings } from "lucide-react";
import SettingsNav, {
  type SettingsSection,
} from "@/features/settings/components/SettingsNav";
import UserIdentitySection from "@/features/settings/components/UserIdentitySection";
import CareerIntelligenceSection from "@/features/settings/components/CareerIntelligenceSection";
import AgentConfigSection from "@/features/settings/components/AgentConfigSection";
import BillingSection from "@/features/settings/components/BillingSection";
import NotificationsSection from "@/features/settings/components/NotificationsSection";
import { fadeUp, dashboardStagger } from "@/features/dashboard/components/animations";
import {
  initialUserIdentityData,
  initialCareerIntelligenceData,
  initialAgentConfigData,
  initialBillingData,
  initialNotificationsData,
  UserIdentityData,
} from "@/app/data/settings";
import { useUser } from "@/hooks/useUser";

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function SettingsPage() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("identity");
  const { data: user, isLoading, error } = useUser();

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

  const { title, description } = sectionTitles[activeSection];

  if (isLoading) return <div>Loading User Data...</div>;
  if (error || !user) return <div>Error loading profile.</div>;

  function renderSection(section: SettingsSection) {
    switch (section) {
      case "identity":
        return <UserIdentitySection data={user} />;
      case "career":
        return (
          <CareerIntelligenceSection data={initialCareerIntelligenceData} />
        );
      case "agents":
        return <AgentConfigSection data={initialAgentConfigData} />;
      case "billing":
        return <BillingSection data={initialBillingData} />;
      case "notifications":
        return <NotificationsSection data={initialNotificationsData} />;
      default:
        return null;
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={dashboardStagger(0.04, 0.02)}
      className="max-w-7xl mx-auto"
    >
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: "var(--d-surface-active)",
              border: "1px solid var(--d-border)",
            }}
          >
            <Settings
              className="w-6 h-6"
              style={{ color: "var(--d-text-tertiary)" }}
            />
          </div>
          <div>
            <h1
              className="text-[26px] font-bold tracking-tight"
              style={{ color: "var(--d-text-primary)" }}
            >
              Settings
            </h1>
            <p
              className="text-[15px] mt-1"
              style={{ color: "var(--d-text-muted)" }}
            >
              Configure your account, agents, and preferences
            </p>
          </div>
        </div>
      </motion.div>
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
                  onClick={() => {
                    setActiveSection(id);
                    console.log(id);
                  }}
                  className="relative px-4 py-2.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? "#000000" : "transparent",
                    color: isActive ? "#ffffff" : "var(--d-text-muted)",
                    border: "1px solid transparent",
                  }}
                >
                  {sectionTitles[id].title.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
      <motion.div
        variants={fadeUp}
        className="flex flex-col lg:flex-row gap-8 lg:gap-10"
      >
        <div className="w-60 shrink-0 hidden lg:block">
          <div className="sticky top-24">
            <SettingsNav
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: smoothEase }}
              className="mb-6"
            >
              <h2
                className="text-[20px] font-semibold tracking-tight mb-1.5"
                style={{ color: "var(--d-text-primary)" }}
              >
                {title}
              </h2>
              <p
                className="text-[14px]"
                style={{ color: "var(--d-text-muted)" }}
              >
                {description}
              </p>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${activeSection}`}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
              variants={dashboardStagger(0.03, 0.02)}
            >
              {renderSection(activeSection)}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
