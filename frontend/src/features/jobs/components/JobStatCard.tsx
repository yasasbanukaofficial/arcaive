import { motion } from "framer-motion";
import { fadeUp } from "@/components/animations/animations";
import { AccentColor } from "@/styles/jobColors";

export default function JobStatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any;
  label: string;
  value: string;
  accent?: AccentColor;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col gap-2 p-5 rounded-[20px] duration-300 hover:scale-[1.02] bg-[var(--d-surface)] border border-[var(--d-border)]"
    >
      <div
        className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 mb-1"
        style={{
          backgroundColor: accent ? accent.bg : "var(--d-surface-hover)",
          border: accent ? `1px solid ${accent.border}` : "1px solid var(--d-border)",
        }}
      >
        <Icon className="w-5 h-5 transition-colors" style={{ color: accent ? accent.dot : "var(--d-text-primary)" }} />
      </div>
      <div>
        <p className="text-[11px] font-medium text-[var(--d-text-muted)] uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-[15px] font-semibold text-[var(--d-text-primary)] truncate">
          {value}
        </p>
      </div>
    </motion.div>
  );
}
