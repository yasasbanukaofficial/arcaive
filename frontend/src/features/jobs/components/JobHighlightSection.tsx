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
        <div className="p-2 rounded-[12px] bg-[#0e0e0e] border border-[#2a2a2a]">
          {getIcon(title)}
        </div>
        <h3 className="text-[16px] font-semibold text-white/90 tracking-tight">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-4 rounded-[16px] border border-[#2a2a2a] bg-[#161616] hover:bg-[#1f1f1f] transition-colors group"
          >
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#4a7c59] shrink-0 group-hover:scale-125 transition-transform" />
            <p className="text-[14px] leading-relaxed text-white/50">
              {item}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}