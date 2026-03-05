"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Trophy,
  Tag,
  Target,
  Pencil,
  Trash2,
  Plus,
  Sparkles,
  CheckCircle,
  Check,
} from "lucide-react";
import Card from "@/components/ui/Card";
import TextField from "@/components/ui/TextField";
import TagInput from "@/components/ui/TagInput";
import FileUpload from "@/components/ui/FileUpload";
import type {
  UploadedFile,
  FileUploadStatus,
} from "@/components/ui/FileUpload";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import type { CareerIntelligenceData, Achievement } from "@/features/settings/types";
import { memberAPI } from "@/features/settings/api/memberAPI";
import { useToast } from "@/components/ui/Toast";

type AchievementItemProps = {
  achievement: Achievement;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onTagsChange: (id: string, tags: string[]) => void;
  disabled?: boolean;
  skillSuggestions: string[];
};

function AchievementItem({
  achievement,
  onEdit,
  onDelete,
  onTagsChange,
  disabled = false,
  skillSuggestions,
}: AchievementItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(achievement.text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(achievement.id, editText.trim());
    } else {
      setEditText(achievement.text);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(achievement.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="group relative rounded-2xl transition-all duration-200"
      style={{
        backgroundColor: "var(--d-surface)",
        border: "1px solid var(--d-border)",
      }}
    >
      {/* Top bar: source badge + actions */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: "1px solid var(--d-border-subtle)" }}
      >
        <div className="flex items-center gap-2">
          {achievement.source === "ai" ? (
            <Badge
              variant="purple"
              size="sm"
              icon={<Sparkles className="w-2.5 h-2.5" />}
            >
              AI Generated
            </Badge>
          ) : (
            <Badge variant="default" size="sm" icon={<Pencil className="w-2.5 h-2.5" />}>
              Manual
            </Badge>
          )}
        </div>
        {!isEditing && !disabled && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150"
              style={{ color: "var(--d-text-muted)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--d-surface-hover)";
                e.currentTarget.style.color = "var(--d-text-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--d-text-muted)";
              }}
              aria-label="Edit achievement"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(achievement.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150"
              style={{ color: "var(--d-text-muted)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.08)";
                e.currentTarget.style.color = "rgba(239, 68, 68, 0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--d-text-muted)";
              }}
              aria-label="Delete achievement"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Body: text + tags */}
      <div className="px-4 py-3 space-y-3">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              rows={3}
              className="w-full rounded-lg px-3 py-2 text-[13px] leading-relaxed outline-none transition-all duration-200 resize-none focus:ring-2 focus:ring-blue-500/20"
              style={{
                backgroundColor: "var(--d-bg)",
                border: "1px solid var(--d-border-hover)",
                color: "var(--d-text-primary)",
              }}
            />
            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--d-text-secondary)" }}
            >
              {achievement.text}
            </p>

            {/* Tags section */}
            <div
              className="pt-2.5"
              style={{ borderTop: "1px solid var(--d-border-subtle)" }}
            >
              {achievement.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <AnimatePresence mode="popLayout">
                    {achievement.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="blue"
                        size="sm"
                        removable={!disabled}
                        onRemove={() =>
                          onTagsChange(
                            achievement.id,
                            achievement.tags.filter((t) => t !== tag),
                          )
                        }
                      >
                        {tag}
                      </Badge>
                    ))}
                  </AnimatePresence>
                </div>
              )}
              <TagInput
                tags={achievement.tags}
                onChange={(newTags) => onTagsChange(achievement.id, newTags)}
                placeholder="Add skill tag..."
                suggestions={skillSuggestions}
                disabled={disabled}
                variant="blue"
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

type CareerIntelligenceSectionProps = {
  data: CareerIntelligenceData;
};

export default function CareerIntelligenceSection({
  data,
}: CareerIntelligenceSectionProps) {
  const { addToast } = useToast();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploadStatus, setUploadStatus] = useState<FileUploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadProgressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [achievements, setAchievements] = useState<Achievement[]>(
    data.achievements,
  );
  const [newAchievement, setNewAchievement] = useState("");

  const [targetRoles, setTargetRoles] = useState<string[]>(data.targetRoles);

  const [achievementsSaving, setAchievementsSaving] = useState(false);
  const [achievementsSaved, setAchievementsSaved] = useState(false);
  const [targetRolesSaving, setTargetRolesSaving] = useState(false);
  const [targetRolesSaved, setTargetRolesSaved] = useState(false);
  const [cvSaving, setCvSaving] = useState(false);
  const [cvSaved, setCvSaved] = useState(false);

  const makeSaveHandler = (
    setSaving: (v: boolean) => void,
    setSaved: (v: boolean) => void,
  ) => async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFileUpload = useCallback(async (newFiles: UploadedFile[]) => {
    setFiles(newFiles);
    if (newFiles.length === 0) return;

    const rawFile = newFiles[0].file;
    setUploadStatus("uploading");
    setUploadProgress(0);

    let fakeProgress = 0;
    uploadProgressRef.current = setInterval(() => {
      fakeProgress += Math.random() * 4 + 1;
      if (fakeProgress >= 90) {
        fakeProgress = 90;
        if (uploadProgressRef.current) {
          clearInterval(uploadProgressRef.current);
          uploadProgressRef.current = null;
        }
      }
      setUploadProgress(Math.round(fakeProgress));
    }, 80);

    try {
      const result = await memberAPI.extractAtomicSkills(rawFile);

      if (uploadProgressRef.current) {
        clearInterval(uploadProgressRef.current);
        uploadProgressRef.current = null;
      }

      if (!result?.achievements?.length) {
        throw new Error("No achievements found");
      }

      const extracted: Achievement[] = result.achievements.map((a: any, i: any) => ({
        id: `ai-${Date.now()}-${i}`,
        text: a.achievement,
        tags: a.techStack ?? [],
        source: "ai",
      }));

      setAchievements((prev) => [
        ...extracted,
        ...prev.filter((a) => a.source === "manual"),
      ]);
      setUploadProgress(100);
      setUploadStatus("success");
    } catch {
      if (uploadProgressRef.current) {
        clearInterval(uploadProgressRef.current);
        uploadProgressRef.current = null;
      }
      setUploadStatus("error");
      setFiles([]);
      addToast({
        type: "error",
        title: "Extraction failed",
        description: "Couldn't extract achievements from this file. Please ensure it's a valid CV.",
      });
    }
  }, [addToast]);

  const handleEditAchievement = useCallback((id: string, text: string) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, text } : a)),
    );
  }, []);

  const handleDeleteAchievement = useCallback((id: string) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const handleTagsChange = useCallback((id: string, tags: string[]) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, tags } : a)),
    );
  }, []);

  const handleAddAchievement = () => {
    if (!newAchievement.trim()) return;
    const id = Date.now().toString();
    setAchievements((prev) => [
      ...prev,
      { id, text: newAchievement.trim(), tags: [], source: "manual" },
    ]);
    setNewAchievement("");
  };

  const roleSuggestions = data.roleSuggestions;
  const skillSuggestions = data.skillSuggestions;

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
        title="CV / Resume Management"
        description="Upload your resume for AI-powered achievement extraction by the Ingestion Agent."
        icon={<FileText className="w-4 h-4" />}
        actions={
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {cvSaved && (
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
            <Button variant="primary" size="sm" onClick={makeSaveHandler(setCvSaving, setCvSaved)} loading={cvSaving} disabled={cvSaving}>
              Save Changes
            </Button>
          </div>
        }
      >
        <FileUpload
          label="Resume File"
          accept=".pdf,.doc,.docx"
          maxSizeMB={10}
          files={files}
          onFilesChange={handleFileUpload}
          status={uploadStatus}
          statusMessage={
            uploadStatus === "uploading"
              ? "AI is analyzing your resume..."
              : uploadStatus === "success"
                ? `Resume analyzed — ${achievements.filter((a) => a.source === "ai").length} achievement${achievements.filter((a) => a.source === "ai").length === 1 ? "" : "s"} extracted!`
                : uploadStatus === "error"
                  ? "Failed to extract achievements. Please try again."
                  : undefined
          }
          progress={uploadProgress}
          hint="Supported formats: PDF, DOCX. Max size: 10 MB."
        />
      </Card>
      <Card
        title="Atomic Achievement Manager"
        description="Individual bullet points extracted from your resume. Edit or remove inaccuracies before storing in the Vector DB."
        icon={<Trophy className="w-4 h-4" />}
        actions={
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {achievementsSaved && (
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
            <Button variant="primary" size="sm" onClick={makeSaveHandler(setAchievementsSaving, setAchievementsSaved)} loading={achievementsSaving} disabled={achievementsSaving}>
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AnimatePresence mode="popLayout">
              {achievements.map((achievement) => (
                <AchievementItem
                  key={achievement.id}
                  achievement={achievement}
                  onEdit={handleEditAchievement}
                  onDelete={handleDeleteAchievement}
                  onTagsChange={handleTagsChange}
                  skillSuggestions={skillSuggestions}
                />
              ))}
            </AnimatePresence>

            {achievements.length === 0 && (
              <div
                className="col-span-full text-center py-10 rounded-2xl"
                style={{
                  backgroundColor: "var(--d-surface)",
                  border: "1px dashed var(--d-border)",
                }}
              >
                <Trophy
                  className="w-8 h-8 mx-auto mb-2"
                  style={{ color: "var(--d-text-ghost)" }}
                />
                <p
                  className="text-[13px]"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  No achievements yet. Upload a resume or add manually.
                </p>
              </div>
            )}
          </div>
          <div
            className="flex items-center gap-2 pt-2"
            style={{ borderTop: "1px solid var(--d-border-subtle)" }}
          >
            <div
              className="flex-1"
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Enter") handleAddAchievement();
              }}
            >
              <TextField
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="Add an achievement manually..."
              />
            </div>
            <Button
              variant="secondary"
              size="md"
              onClick={handleAddAchievement}
              disabled={!newAchievement.trim()}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add
            </Button>
          </div>
        </div>
      </Card>
      <Card
        title="Target Roles"
        description="Roles you're targeting — used by the Discovery Agent to match you with relevant positions."
        icon={<Target className="w-4 h-4" />}
        actions={
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {targetRolesSaved && (
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
            <Button variant="primary" size="sm" onClick={makeSaveHandler(setTargetRolesSaving, setTargetRolesSaved)} loading={targetRolesSaving} disabled={targetRolesSaving}>
              Save Changes
            </Button>
          </div>
        }
      >
        <TagInput
          label="Job Titles"
          tags={targetRoles}
          onChange={setTargetRoles}
          placeholder="Add a target role..."
          suggestions={roleSuggestions}
          variant="purple"
          hint="Add job titles you'd like the Discovery Agent to focus on."
        />
      </Card>
    </motion.div>
  );
}
