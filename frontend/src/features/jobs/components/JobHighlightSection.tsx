
import { motion } from "framer-motion";
import {
  Star,
  Sparkles,
  GraduationCap,
  Hammer,
} from "lucide-react";
import { fadeUp } from "@/components/animations/animations";

export default function JobHighlightSection({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;

  const getIcon = (t: string) => {
    const l = t.toLowerCase();
    if (l.includes("qualification") || l.includes("requirement")) return <GraduationCap className="w-5 h-5" />;
    if (l.includes("responsibility")) return <Hammer className="w-5 h-5" />;
    if (l.includes("benefit")) return <Star className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  return (
    <motion.div variants={fadeUp} className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="p-2 " style={{ backgroundColor: "var(--bg-color)", border: "1px solid var(--glass-border)" }}>
          {getIcon(title)}
        </div>
        <h3 className="text-[18px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-4  border transition-colors hover:bg-[var(--bg-color)] group"
            style={{
              backgroundColor: "var(--glass-bg)",
              borderColor: "var(--glass-border)",
            }}
          >
            <div className="mt-1 w-1.5 h-1.5  bg-blue-500 shrink-0 group-hover:scale-125 transition-transform" />
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {item}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}