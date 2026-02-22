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
      whileTap={{ scale: 0.9 }}
      className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border ${
        isDark
          ? "bg-white/3 border-white/6 hover:bg-white/6"
          : "bg-black/[0.04] border-black/[0.08] hover:bg-black/[0.06]"
      }`}
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
          <Moon className="w-4 h-4 text-black/40 hover:text-black/70 transition-colors" />
        )}
      </motion.div>
    </motion.button>
  );
}
