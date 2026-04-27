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
  icon: any;
  label: string;
  value: string;
  accent?: AccentColor;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col gap-2 p-4 duration-300 hover:scale-[1.02] oryzo-card-glow"
      style={{
        backgroundColor: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
      }}
    >
      <div
        className="w-10 h-10  flex items-center justify-center shrink-0 mb-1"
        style={{
          backgroundColor: accent ? accent.bg : "var(--bg-color)",
          border: accent ? `1px solid ${accent.border}` : "1px solid var(--glass-border)",
        }}
      >
        <Icon className="w-5 h-5 transition-colors" style={{ color: accent ? accent.dot : "var(--text-primary)" }} />
      </div>
      <div>
        <p
          className="text-[11px] font-bold uppercase tracking-widest mb-0.5"
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
        </p>
        <p
          className="text-[15px] font-semibold truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
}
