"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/overview");
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-[var(--glass-bg)] text-[var(--text-primary)] flex items-center justify-center font-mono selection:bg-[#D4F461]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="w-8 h-8 border border-[var(--glass-border)] border-t-transparent animate-spin mx-auto mb-6" />
        <p className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
          Completing sign in...
        </p>
      </motion.div>
    </div>
  );
}
