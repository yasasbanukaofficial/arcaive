import type { JobSource } from "@/@types/jobs";

export interface AccentColor {
  bg: string;
  border: string;
  dot: string;
}

export const ACCENT_COLORS: AccentColor[] = [
  {
    bg: "var(--accent-blue-bg)",
    border: "var(--accent-blue-border)",
    dot: "var(--accent-blue-dot)",
  },
  {
    bg: "var(--accent-emerald-bg)",
    border: "var(--accent-emerald-border)",
    dot: "var(--accent-emerald-dot)",
  },
  {
    bg: "var(--accent-violet-bg)",
    border: "var(--accent-violet-border)",
    dot: "var(--accent-violet-dot)",
  },
  {
    bg: "var(--accent-amber-bg)",
    border: "var(--accent-amber-border)",
    dot: "var(--accent-amber-dot)",
  },
  {
    bg: "var(--accent-pink-bg)",
    border: "var(--accent-pink-border)",
    dot: "var(--accent-pink-dot)",
  },
  {
    bg: "var(--accent-teal-bg)",
    border: "var(--accent-teal-border)",
    dot: "var(--accent-teal-dot)",
  },
];

export interface MatchColor {
  text: string;
  bg: string;
  border: string;
  label: string;
}

export function getMatchColor(score: number): MatchColor {
  if (score >= 85)
    return {
      text: "var(--match-excellent-text)",
      bg: "var(--match-excellent-bg)",
      border: "var(--match-excellent-border)",
      label: "Excellent Match",
    };
  if (score >= 70)
    return {
      text: "var(--match-good-text)",
      bg: "var(--match-good-bg)",
      border: "var(--match-good-border)",
      label: "Good Match",
    };
  if (score >= 50)
    return {
      text: "var(--match-partial-text)",
      bg: "var(--match-partial-bg)",
      border: "var(--match-partial-border)",
      label: "Partial Match",
    };
  return {
    text: "var(--match-low-text)",
    bg: "var(--match-low-bg)",
    border: "var(--match-low-border)",
    label: "Low Match",
  };
}

export function hashStringToIndex(str: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % max;
}

export function getAccentForCompany(company: string): AccentColor {
  return ACCENT_COLORS[hashStringToIndex(company, ACCENT_COLORS.length)];
}

export function getSourceIcon(source: JobSource): string {
  switch (source) {
    case "LinkedIn":
      return "🔗";
    case "Serper":
      return "🔍";
    case "Indeed":
      return "📋";
    case "Glassdoor":
      return "🚪";
  }
}
