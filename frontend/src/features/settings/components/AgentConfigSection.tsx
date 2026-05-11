"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Gauge, Theater, Zap, Ban, Info, Check } from "lucide-react";
import Card, { CardRow } from "@/components/ui/Card";
import Slider from "@/components/ui/Slider";
import Select from "@/components/ui/SelectInput";
import Toggle from "@/components/ui/Toggle";
import TextArea from "@/components/ui/TextArea";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { AgentConfigData } from "@/features/settings/types";

type AgentConfigSectionProps = {
  data: AgentConfigData;
};

export default function AgentConfigSection({ data }: AgentConfigSectionProps) {
  const [applyThreshold, setApplyThreshold] = useState(data.applyThreshold);

  const [personaId, setPersonaId] = useState(data.personaId);

  const [useGpt4o, setUseGpt4o] = useState(data.useGpt4o);

  const [blacklist, setBlacklist] = useState(data.blacklist);

  const [thresholdSaving, setThresholdSaving] = useState(false);
  const [thresholdSaved, setThresholdSaved] = useState(false);
  const [personaSaving, setPersonaSaving] = useState(false);
  const [personaSaved, setPersonaSaved] = useState(false);
  const [modelSaving, setModelSaving] = useState(false);
  const [modelSaved, setModelSaved] = useState(false);
  const [blacklistSaving, setBlacklistSaving] = useState(false);
  const [blacklistSaved, setBlacklistSaved] = useState(false);

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

  const personaOptions = data.personaOptions.map((option) => ({
    ...option,
    icon: option.icon,
  }));

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
        title="Auto-Apply Threshold"
        description="Set the minimum Match Score required for the Auto-Apply Agent Bot to automatically submit an application on your behalf."
        icon={<Gauge className="w-4 h-4" />}
        actions={
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {thresholdSaved && (
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
            <Button variant="primary" size="sm" onClick={makeSaveHandler(setThresholdSaving, setThresholdSaved)} loading={thresholdSaving} disabled={thresholdSaving}>
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Slider
            label="Minimum Match Score"
            value={applyThreshold}
            onChange={setApplyThreshold}
            min={0}
            max={100}
            step={5}
            valueSuffix="%"
            hint={
              applyThreshold >= 80
                ? "High threshold — only near-perfect matches will be auto-applied."
                : applyThreshold >= 50
                  ? "Moderate — a balanced mix of precision and volume."
                  : "Low threshold — more applications will be auto-submitted. Review frequently."
            }
          />
          <div className="flex items-center gap-3 pt-1">
            <div className="flex gap-1">
              {[20, 40, 60, 80, 100].map((mark) => (
                <div
                  key={mark}
                  className="w-8 h-1.5 transition-colors duration-200"
                  style={{
                    backgroundColor:
                      applyThreshold >= mark
                        ? "var(--text-primary)"
                        : "var(--glass-border)",
                  }}
                />
              ))}
            </div>
            <span
              className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]"
            >
              {applyThreshold >= 80
                ? "Conservative"
                : applyThreshold >= 50
                  ? "Balanced"
                  : "Aggressive"}
            </span>
          </div>
        </div>
      </Card>
      <Card
        title="Agent Persona"
        description="Select the tone and voice used by the Refinement Swarm when tailoring your application materials."
        icon={<Theater className="w-4 h-4" />}
        actions={
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {personaSaved && (
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
            <Button variant="primary" size="sm" onClick={makeSaveHandler(setPersonaSaving, setPersonaSaved)} loading={personaSaving} disabled={personaSaving}>
              Save Changes
            </Button>
          </div>
        }
      >
        <Select
          label="Communication Tone"
          options={personaOptions.map((option) => ({
            ...option,
            icon: option.icon ? <option.icon className="w-4 h-4" /> : undefined,
          }))}
          value={personaId}
          onChange={setPersonaId}
          hint="This affects how your cover letters and application responses are written."
        />
      </Card>
      <Card
        title="Model Selection"
        description="Choose which LLM powers your agents. Available on the Strategist tier."
        icon={<Cpu className="w-4 h-4" />}
        actions={
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {modelSaved && (
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
            <Button variant="primary" size="sm" onClick={makeSaveHandler(setModelSaving, setModelSaved)} loading={modelSaving} disabled={modelSaving}>
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <CardRow
            label="Primary Model"
            description="Toggle between GPT-4o and Claude 3.5 Sonnet for agent processing."
          >
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]"
                style={{
                  color: !useGpt4o
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                }}
              >
                Claude 3.5
              </span>
              <Toggle checked={useGpt4o} onChange={setUseGpt4o} size="md" />
              <span
                className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]"
                style={{
                  color: useGpt4o
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                }}
              >
                GPT-4o
              </span>
            </div>
          </CardRow>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-3 py-2.5 "
            style={{
              backgroundColor: "rgba(139, 92, 246, 0.04)",
              border: "1px solid rgba(139, 92, 246, 0.1)",
            }}
          >
            <Badge variant="purple" size="sm">
              Strategist
            </Badge>
            <span
              className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]"
            >
              Model selection is available exclusively on the Strategist tier.
            </span>
          </motion.div>
        </div>
      </Card>
      <Card
        title="Blacklisted Keywords & Companies"
        description="Companies or terms the Discovery Agent should ignore when scanning for job matches."
        icon={<Ban className="w-4 h-4" />}
        actions={
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {blacklistSaved && (
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
            <Button variant="primary" size="sm" onClick={makeSaveHandler(setBlacklistSaving, setBlacklistSaved)} loading={blacklistSaving} disabled={blacklistSaving}>
              Save Changes
            </Button>
          </div>
        }
      >
        <TextArea
          label="Blacklist"
          value={blacklist}
          onChange={(e) => setBlacklist(e.target.value)}
          placeholder="Enter company names or keywords, one per line..."
          rows={5}
          hint="One entry per line. The Discovery Agent will skip any listing that matches these terms."
        />
      </Card>
    </motion.div>
  );
}
