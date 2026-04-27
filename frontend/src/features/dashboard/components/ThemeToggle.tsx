"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
      className={`relative w-10 h-10 flex items-center justify-center transition-[background-color,border-color] duration-200 border ${
        isDark
          ? "bg-black border-white hover:bg-[var(--glass-bg)]/10"
          : "bg-[var(--glass-bg)] border-[var(--glass-border)] hover:bg-[var(--glass-border)]"
      }`}
      style={{ borderRadius: 0 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180, scale: [0.8, 1] }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-white/40 hover:text-white/70 transition-colors" />
        ) : (
          <Moon className="w-4 h-4 text-[var(--text-secondary)] hover:text-[var(--text-secondary)] transition-colors" />
        )}
      </motion.div>
    </motion.button>
  );
}
