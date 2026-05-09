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
      title: "Digital Identity",
      description:
        "Manage your profile parameters, cryptographic security, and linked access nodes.",
    },
    career: {
      title: "Career Intelligence",
      description:
        "Archival records and role vector suggestions for AI discovery agents.",
    },
    agents: {
      title: "Agent Configuration",
      description:
        "Threshold optimization, persona selection, and LLM model routing.",
    },
    notifications: {
      title: "System Synchronization",
      description:
        "Configure temporal alerts, theme preference, and data privacy protocols.",
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
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="w-full flex flex-col gap-8 pb-20 px-4 md:px-8"
    >
      <motion.div 
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: smoothEase } }
        }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
      >
        <div className="space-y-1">
          <h1 className="text-[44px] md:text-[56px] font-semibold text-[var(--text-primary)] tracking-[-0.04em] leading-none">
            Settings
          </h1>
          <p className="text-[var(--text-secondary)] text-[14px] font-medium tracking-tight">System configuration and identity management</p>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-10 mt-4">
        <div className="w-full lg:w-72 shrink-0">
          <div className="sticky top-28 space-y-6">
            <SettingsNav
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
            <div className="px-6 py-6 bg-[var(--text-primary)]/[0.03] border border-[var(--glass-border)] rounded-[24px]">
               <p className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.15em] mb-3">System Integrity</p>
               <div className="flex items-center gap-2 text-[var(--accent-brand)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span className="text-[13px] font-semibold tracking-tight">Verified Protocol</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: smoothEase }}
              className="mb-12"
            >
              <div className="flex items-baseline gap-4 mb-3">
                <h2 className="text-[32px] font-bold tracking-tight text-[var(--text-primary)] leading-none capitalize">
                  {title}
                </h2>
              </div>
              <p className="text-[15px] text-[var(--text-secondary)] max-w-xl leading-relaxed font-medium">
                {description}
              </p>
              <div className="h-[1px] w-full bg-[var(--glass-border)] mt-8" />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${activeSection}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: smoothEase }}
            >
              {renderSection(activeSection)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
