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

export function getSourceIcon(publisher: string): string {
  const lower = publisher.toLowerCase();
  if (lower.includes("linkedin")) return "🔗";
  if (lower.includes("indeed")) return "📋";
  if (lower.includes("glassdoor")) return "🚪";
  if (lower.includes("google")) return "🔍";
  return "🌐";
  }
