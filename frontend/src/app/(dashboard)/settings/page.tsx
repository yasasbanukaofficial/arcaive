"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings } from "lucide-react";
import SettingsNav, {
  type SettingsSection,
} from "@/features/settings/components/SettingsNav";
import MemberIdentitySection from "@/features/settings/components/MemberIdentitySection";
import CareerIntelligenceSection from "@/features/settings/components/CareerIntelligenceSection";
import AgentConfigSection from "@/features/settings/components/AgentConfigSection";
import NotificationsSection from "@/features/settings/components/NotificationsSection";
import { fadeUp, dashboardStagger } from "@/features/dashboard/components/animations";
import {
  initialAgentConfigData,
  initialNotificationsData,
} from "@/features/settings/constants/initialData";
import { useMemberSettings } from "@/features/settings/hooks/useMember";

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function SettingsPage() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("identity");
  const { data: member, isLoading, error } = useMemberSettings();

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
    notifications: {
      title: "Notifications & System",
      description:
        "Configure alerts, theme preferences, and data privacy options.",
    },
  };

  const { title, description } = sectionTitles[activeSection];

  function renderSection(section: SettingsSection) {
    switch (section) {
      case "identity":
        return <MemberIdentitySection data={member} isLoading={isLoading} error={error} />;
      case "career":
        return (
          <CareerIntelligenceSection
            data={{ achievements: [], targetRoles: [], roleSuggestions: [] }}
          />
        );
      case "agents":
        return <AgentConfigSection data={initialAgentConfigData} />;
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
      <motion.div variants={fadeUp} className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <h1 className="text-[11px] font-black tracking-[0.3em] text-[var(--text-secondary)]">
            Control center
          </h1>
        </div>
        <h2 className="font-display text-5xl sm:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[0.9] capitalize">
          System <br /> configuration
        </h2>
        <p className="text-[15px] mt-6 max-w-2xl text-[var(--text-secondary)] leading-relaxed">
          Fine-tune your platform experience, manage AI agent parameters, and secure your 
          digital identity through our centralized command interface.
        </p>
      </motion.div>
      <motion.div variants={fadeUp} className="lg:hidden mb-8">
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
          {(["identity", "career", "agents", "notifications"] as SettingsSection[]).map((id) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                 className={`flex-shrink-0 px-6 py-3 text-[11px] font-black tracking-[0.2em] border transition-all ${
                  isActive ? "bg-[var(--d-text-primary)] text-[var(--d-bg)] border-[var(--d-text-primary)]" : "bg-[var(--d-surface)] text-[var(--d-text-muted)] border-[var(--d-border)]"
                }`}
                style={{ borderRadius: "var(--radius)" }}
              >
                {sectionTitles[id].title.split(" ")[0]}
              </button>
            );
          })}
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
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25, ease: smoothEase }}
              className="mb-10"
            >
              <div className="flex items-baseline gap-4 mb-2">
                  <h2 className="font-display text-3xl font-black tracking-tight text-[var(--text-primary)] capitalize">
                    {title.split(" & ")[0]}
                  </h2>
                  <span className="text-[var(--text-tertiary)] font-display text-2xl font-light italic">
                   {title.split(" & ")[1] ? `& ${title.split(" & ")[1]}` : ""}
                 </span>
              </div>
              <p className="text-[14px] text-[var(--text-secondary)] max-w-xl leading-relaxed">
                {description}
              </p>
              <div className="h-[1px] w-full bg-[var(--d-border)] mt-6" />
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
