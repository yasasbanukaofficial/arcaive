"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Gauge, Theater, Zap, Ban, Info } from "lucide-react";
import Card, { CardRow } from "@/components/ui/Card";
import Slider from "@/components/ui/Slider";
import Select from "@/components/ui/Select";
import Toggle from "@/components/ui/Toggle";
import TextArea from "@/components/ui/TextArea";
import Badge from "@/components/ui/Badge";

export default function AgentConfigSection() {
  const [applyThreshold, setApplyThreshold] = useState(75);

  const [personaId, setPersonaId] = useState("bold");

  const [useGpt4o, setUseGpt4o] = useState(true);

  const [blacklist, setBlacklist] = useState(
    "Palantir\nClearview AI\ncrypto trading",
  );

  const personaOptions = [
    {
      value: "bold",
      label: "Bold & Innovative",
      description: "Highlights leadership and creative problem-solving",
      icon: <Zap className="w-4 h-4" />,
    },
    {
      value: "conservative",
      label: "Conservative & Academic",
      description: "Formal tone with emphasis on research and methodology",
      icon: <Info className="w-4 h-4" />,
    },
    {
      value: "direct",
      label: "Direct & Concise",
      description: "Straight-to-the-point with minimal fluff",
      icon: <Gauge className="w-4 h-4" />,
    },
  ];

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
                  className="w-8 h-1.5 rounded-full transition-colors duration-200"
                  style={{
                    backgroundColor:
                      applyThreshold >= mark
                        ? "rgba(59, 130, 246, 0.5)"
                        : "var(--d-surface-active)",
                  }}
                />
              ))}
            </div>
            <span
              className="text-[12px]"
              style={{ color: "var(--d-text-muted)" }}
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
      >
        <Select
          label="Communication Tone"
          options={personaOptions}
          value={personaId}
          onChange={setPersonaId}
          hint="This affects how your cover letters and application responses are written."
        />
      </Card>
      <Card
        title="Model Selection"
        description="Choose which LLM powers your agents. Available on the Strategist tier."
        icon={<Cpu className="w-4 h-4" />}
      >
        <div className="space-y-4">
          <CardRow
            label="Primary Model"
            description="Toggle between GPT-4o and Claude 3.5 Sonnet for agent processing."
          >
            <div className="flex items-center gap-3">
              <span
                className="text-[12px] font-medium"
                style={{
                  color: !useGpt4o
                    ? "var(--d-text-primary)"
                    : "var(--d-text-muted)",
                }}
              >
                Claude 3.5
              </span>
              <Toggle checked={useGpt4o} onChange={setUseGpt4o} size="md" />
              <span
                className="text-[12px] font-medium"
                style={{
                  color: useGpt4o
                    ? "var(--d-text-primary)"
                    : "var(--d-text-muted)",
                }}
              >
                GPT-4o
              </span>
            </div>
          </CardRow>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{
              backgroundColor: "rgba(139, 92, 246, 0.04)",
              border: "1px solid rgba(139, 92, 246, 0.1)",
            }}
          >
            <Badge variant="purple" size="sm">
              Strategist
            </Badge>
            <span
              className="text-[12px]"
              style={{ color: "var(--d-text-muted)" }}
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
