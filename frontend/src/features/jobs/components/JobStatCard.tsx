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
      className="flex flex-col gap-2 p-5 rounded-[20px] duration-300 hover:scale-[1.02] bg-[#161616] border border-[#2a2a2a]"
    >
      <div
        className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 mb-1"
        style={{
          backgroundColor: accent ? accent.bg : "#0e0e0e",
          border: accent ? `1px solid ${accent.border}` : "1px solid #2a2a2a",
        }}
      >
        <Icon className="w-5 h-5 transition-colors" style={{ color: accent ? accent.dot : "white" }} />
      </div>
      <div>
        <p className="text-[11px] font-medium text-white/35 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-[15px] font-semibold text-white/90 truncate">
          {value}
        </p>
      </div>
    </motion.div>
  );
}
