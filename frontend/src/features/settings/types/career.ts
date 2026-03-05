export type Achievement = {
  id: string;
  qualificationTerm: string;
  qualificationDescription: string;
  source: "ai" | "manual";
};

export type CareerIntelligenceData = {
  achievements: Achievement[];
  targetRoles: string[];
  roleSuggestions: string[];
};
