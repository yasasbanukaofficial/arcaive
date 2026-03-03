export type Achievement = {
  id: string;
  text: string;
  tags: string[];
  source: "ai" | "manual";
};

export type CareerIntelligenceData = {
  achievements: Achievement[];
  targetRoles: string[];
  roleSuggestions: string[];
  skillSuggestions: string[];
};
