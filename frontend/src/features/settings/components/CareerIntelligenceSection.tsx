"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Trophy,
  Tag,
  Target,
  Pencil,
  Trash2,
  Plus,
  GripVertical,
  Sparkles,
  CheckCircle,
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
import type { CareerIntelligenceData, Achievement } from "@/app/data/settings";

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
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="group rounded-xl p-3.5 transition-colors duration-200"
      style={{
        backgroundColor: "var(--d-surface)",
        border: "1px solid var(--d-border)",
      }}
    >
      <div className="flex items-start gap-2.5">
        <div
          className="mt-0.5 shrink-0 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: "var(--d-text-ghost)" }}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                rows={2}
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
              {achievement.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
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
              <div className="mt-2">
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
        <div className="shrink-0 flex items-center gap-1.5">
          {achievement.source === "ai" && (
            <Badge
              variant="purple"
              size="sm"
              icon={<Sparkles className="w-2.5 h-2.5" />}
            >
              AI
            </Badge>
          )}
        </div>
        {!isEditing && !disabled && (
          <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150"
              style={{
                color: "var(--d-text-muted)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--d-surface-hover)";
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
              style={{
                color: "var(--d-text-muted)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(239, 68, 68, 0.08)";
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
    </motion.div>
  );
}

type CareerIntelligenceSectionProps = {
  data: CareerIntelligenceData;
};

export default function CareerIntelligenceSection({
  data,
}: CareerIntelligenceSectionProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploadStatus, setUploadStatus] = useState<FileUploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);

  const [achievements, setAchievements] = useState<Achievement[]>(
    data.achievements,
  );
  const [newAchievement, setNewAchievement] = useState("");

  const [targetRoles, setTargetRoles] = useState<string[]>(data.targetRoles);

  const handleFileUpload = useCallback(async (newFiles: UploadedFile[]) => {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      setUploadStatus("uploading");
      setUploadProgress(0);
      for (let i = 0; i <= 100; i += 5) {
        await new Promise((r) => setTimeout(r, 80));
        setUploadProgress(i);
      }
      setUploadStatus("success");
    }
  }, []);

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
              ? "Ingestion Agent is parsing your resume..."
              : uploadStatus === "success"
                ? "Resume parsed successfully — achievements extracted!"
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
      >
        <div className="space-y-3">
          <div className="space-y-2 max-h-100 overflow-y-auto pr-1">
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
                className="text-center py-8 rounded-xl"
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
