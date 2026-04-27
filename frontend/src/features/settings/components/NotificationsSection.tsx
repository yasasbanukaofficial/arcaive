"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ShieldAlert,
  Palette,
  AlertTriangle,
  Trash2,
  Sun,
  Moon,
  Check,
} from "lucide-react";
import Card, { CardRow } from "@/components/ui/Card";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import { useTheme } from "@/features/dashboard/components/ThemeContext";
import type { NotificationsData } from "@/features/settings/types";

type NotificationsSectionProps = {
  data: NotificationsData;
};

export default function NotificationsSection({
  data,
}: NotificationsSectionProps) {
  const [alertJobMatch, setAlertJobMatch] = useState(data.alerts.jobMatch);
  const [alertAutoApply, setAlertAutoApply] = useState(data.alerts.autoApply);
  const [alertSimulation, setAlertSimulation] = useState(
    data.alerts.simulation,
  );

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [alertsSaving, setAlertsSaving] = useState(false);
  const [alertsSaved, setAlertsSaved] = useState(false);

  const handleAlertsSave = async () => {
    setAlertsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setAlertsSaving(false);
    setAlertsSaved(true);
    setTimeout(() => setAlertsSaved(false), 2000);
  };

  const { theme, toggleTheme, isDark } = useTheme();

  const handleDeleteAllData = () => {
    if (deleteConfirmText === "DELETE") {
      setShowDeleteConfirm(false);
      setDeleteConfirmText("");
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } },
      }}
    >
      <Card
        title="Alert Preferences"
        description="Choose which notifications you'd like to receive."
        actions={
          <div className="flex items-center gap-4">
            <AnimatePresence>
              {alertsSaved && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]"
                >
                  [ SAVED ]
                </motion.span>
              )}
            </AnimatePresence>
            <Button variant="primary" size="sm" onClick={handleAlertsSave} loading={alertsSaving} disabled={alertsSaving}>
              SAVE_CHANGES
            </Button>
          </div>
        }
      >
        <div className="space-y-1">
          <CardRow
            label="New Job Match Found"
            description="Get notified when the Discovery Agent finds a role matching your profile."
          >
            <Toggle
              checked={alertJobMatch}
              onChange={setAlertJobMatch}
            />
          </CardRow>

          <CardRow
            label="Auto-Apply Success"
            description="Receive a confirmation when the Auto-Apply Agent submits an application."
          >
            <Toggle
              checked={alertAutoApply}
              onChange={setAlertAutoApply}
            />
          </CardRow>

          <CardRow
            label="Simulation Session Ready"
            description="Get alerted when a new interview simulation session is available."
          >
            <Toggle
              checked={alertSimulation}
              onChange={setAlertSimulation}
            />
          </CardRow>
        </div>
      </Card>

      <Card
        title="Theme"
        description="Customize the look and feel of your dashboard."
      >
        <CardRow
          label="Appearance"
          description="Switch between dark mode and light mode for the dashboard UI."
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (isDark) toggleTheme();
              }}
              className={`px-4 py-2 font-mono text-[11px] uppercase tracking-widest  border ${
                !isDark ? "bg-black text-white border-[var(--glass-border)]" : "bg-[var(--glass-bg)] text-[var(--text-secondary)] border-[var(--glass-border)] hover:border-[var(--glass-border)]"
              }`}
              style={{ borderRadius: 0 }}
            >
              LIGHT
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isDark) toggleTheme();
              }}
              className={`px-4 py-2 font-mono text-[11px] uppercase tracking-widest  border ${
                isDark ? "bg-black text-white border-[var(--glass-border)]" : "bg-[var(--glass-bg)] text-[var(--text-secondary)] border-[var(--glass-border)] hover:border-[var(--glass-border)]"
              }`}
              style={{ borderRadius: 0 }}
            >
              DARK
            </button>
          </div>
        </CardRow>
      </Card>

      <Card
        title="Data Privacy"
        description="Manage your stored data across all connected databases."
      >
        <div className="space-y-4">
          <div className="p-8 border border-[#D83B2A] bg-[var(--glass-bg)]">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#D83B2A]">
                  [ DANGER_ZONE ]
                </span>
              </div>
              <p className="font-sans text-[13px] leading-relaxed text-[var(--text-secondary)] mb-6">
                Deleting all data will permanently remove your profile,
                achievements, agent configurations, and all records from both
                Neon (PostgreSQL) and Chroma (Vector) databases. This action
                cannot be undone.
              </p>

              <AnimatePresence mode="wait">
                {!showDeleteConfirm ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    DELETE ALL DATA
                  </Button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <label className="font-mono text-[11px] uppercase tracking-widest text-[#D83B2A]">
                        TYPE <strong className="font-bold underline">DELETE</strong> TO_CONFIRM
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="TYPE_DELETE"
                        className="w-full max-w-[240px] px-[14px] py-[10px] font-mono text-[13px] border border-[#D83B2A] focus:outline-none focus:border-[var(--glass-border)] "
                        style={{ borderRadius: 0 }}
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={deleteConfirmText !== "DELETE"}
                        onClick={handleDeleteAllData}
                      >
                        PERMANENTLY DELETE
                      </Button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText("");
                        }}
                        className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        CANCEL
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
