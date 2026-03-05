export type Achievement = {
  id: string;
  competencyTerm: string;
  competencyDescription: string;
  source: "ai" | "manual";
};

export type CareerIntelligenceData = {
  achievements: Achievement[];
  targetRoles: string[];
  roleSuggestions: string[];
};
