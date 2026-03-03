import type { LucideIcon } from "lucide-react";

export type PersonaOption = {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export type AgentConfigData = {
  applyThreshold: number;
  personaId: string;
  personaOptions: PersonaOption[];
  useGpt4o: boolean;
  blacklist: string;
};
