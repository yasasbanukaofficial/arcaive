import { motion } from "framer-motion";
import { fadeUp } from "@/components/animations/animations";
import {
  AccentColor,
} from "@/styles/jobColors";

export default function JobStatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: AccentColor;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col gap-2 p-4   duration-300 hover:scale-[1.02]"
      style={{
        backgroundColor: "var(--d-surface)",
        border: "1px solid var(--d-border-subtle)",
      }}
    >
      <div
        className="w-10 h-10  flex items-center justify-center shrink-0 mb-1"
        style={{
          backgroundColor: accent ? accent.bg : "var(--d-surface-hover)",
          border: accent ? `1px solid ${accent.border}` : "1px solid var(--d-border-subtle)",
        }}
      >
        <Icon className="w-5 h-5" style={{ color: accent ? accent.dot : "var(--d-icon-hover)" }} />
      </div>
      <div>
        <p
          className="text-[11px] font-bold uppercase tracking-widest mb-0.5"
          style={{ color: "var(--d-text-muted)" }}
        >
          {label}
        </p>
        <p
          className="text-[15px] font-semibold truncate"
          style={{ color: "var(--d-text-primary)" }}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
}
