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
        icon={<Bell className="w-4 h-4" />}
        actions={
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {alertsSaved && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="flex items-center gap-1 text-[12px] font-medium"
                  style={{ color: "rgba(34, 197, 94, 0.8)" }}
                >
                  <Check className="w-3.5 h-3.5" />
                  Saved
                </motion.span>
              )}
            </AnimatePresence>
            <Button variant="primary" size="sm" onClick={handleAlertsSave} loading={alertsSaving} disabled={alertsSaving}>
              Save Changes
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
              size="md"
            />
          </CardRow>

          <CardRow
            label="Auto-Apply Success"
            description="Receive a confirmation when the Auto-Apply Agent submits an application."
          >
            <Toggle
              checked={alertAutoApply}
              onChange={setAlertAutoApply}
              size="md"
            />
          </CardRow>

          <CardRow
            label="Simulation Session Ready"
            description="Get alerted when a new interview simulation session is available."
          >
            <Toggle
              checked={alertSimulation}
              onChange={setAlertSimulation}
              size="md"
            />
          </CardRow>
        </div>
      </Card>
      <Card
        title="Theme"
        description="Customize the look and feel of your dashboard."
        icon={<Palette className="w-4 h-4" />}
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
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200"
              style={{
                backgroundColor: !isDark
                  ? "var(--d-surface-active)"
                  : "transparent",
                border: !isDark
                  ? "1px solid var(--d-border-hover)"
                  : "1px solid var(--d-border)",
                color: !isDark
                  ? "var(--d-text-primary)"
                  : "var(--d-text-muted)",
              }}
            >
              <Sun className="w-4 h-4" />
              Light
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isDark) toggleTheme();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200"
              style={{
                backgroundColor: isDark
                  ? "var(--d-surface-active)"
                  : "transparent",
                border: isDark
                  ? "1px solid var(--d-border-hover)"
                  : "1px solid var(--d-border)",
                color: isDark ? "var(--d-text-primary)" : "var(--d-text-muted)",
              }}
            >
              <Moon className="w-4 h-4" />
              Dark
            </button>
          </div>
        </CardRow>
      </Card>
      <Card
        title="Data Privacy"
        description="Manage your stored data across all connected databases."
        icon={<ShieldAlert className="w-4 h-4" />}
      >
        <div className="space-y-4">
          <div
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.04)",
              border: "1px solid rgba(239, 68, 68, 0.1)",
            }}
          >
            <AlertTriangle
              className="w-5 h-5 shrink-0 mt-0.5"
              style={{ color: "rgba(239, 68, 68, 0.6)" }}
            />
            <div className="flex-1">
              <p
                className="text-[13px] font-medium mb-1"
                style={{ color: "var(--d-text-secondary)" }}
              >
                Danger Zone
              </p>
              <p
                className="text-[12px] leading-relaxed mb-3"
                style={{ color: "var(--d-text-muted)" }}
              >
                Deleting all data will permanently remove your profile,
                achievements, agent configurations, and all records from both
                Neon (PostgreSQL) and Chroma (Vector) databases. This action
                cannot be undone.
              </p>

              <AnimatePresence>
                {!showDeleteConfirm ? (
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete All Data
                  </Button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-3"
                  >
                    <div>
                      <label
                        className="block text-[12px] font-medium mb-1.5"
                        style={{ color: "rgba(239, 68, 68, 0.7)" }}
                      >
                        Type <strong>DELETE</strong> to confirm
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="Type DELETE"
                        className="w-full max-w-60 rounded-lg px-3 py-2 text-[13px] outline-none transition-all duration-200 focus:ring-2 focus:ring-red-500/20"
                        style={{
                          backgroundColor: "var(--d-bg)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          color: "var(--d-text-primary)",
                        }}
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={deleteConfirmText !== "DELETE"}
                        onClick={handleDeleteAllData}
                        icon={<Trash2 className="w-3.5 h-3.5" />}
                      >
                        Permanently Delete
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText("");
                        }}
                      >
                        Cancel
                      </Button>
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
