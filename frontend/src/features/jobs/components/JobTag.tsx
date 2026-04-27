import {
  getTagColor,
} from "@/styles/jobColors";

export default function JobTag({ children }: { children: string }) {
  const accent = getTagColor(children);
  return (
    <span
      className="text-[11px] font-bold uppercase tracking-widest px-3 py-1.5  border flex items-center gap-1.5 transition-transform hover:scale-105 select-none"
      style={{
        backgroundColor: accent.bg,
        borderColor: accent.border,
        color: accent.dot,
      }}
    >
      <div className="w-1.5 h-1.5 " style={{ backgroundColor: accent.dot }} />
      {children}
    </span>
  );
}