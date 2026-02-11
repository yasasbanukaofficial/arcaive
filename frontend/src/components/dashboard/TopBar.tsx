"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Bell, Plus, ChevronDown } from "lucide-react";
import { fadeUp } from "./animations";
import ThemeToggle from "./ThemeToggle";

export default function TopBar() {
  return (
    <motion.header
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="flex items-center justify-between px-6 lg:px-8 py-4 border-b backdrop-blur-xl sticky top-0 z-40 transition-colors duration-300"
      style={{
        borderColor: "var(--d-border-subtle)",
        backgroundColor: "var(--d-bg-alpha)",
      }}
    >
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl w-full group transition-all duration-300"
          style={{
            backgroundColor: "var(--d-surface)",
            border: "1px solid var(--d-border)",
          }}
        >
          <Search className="w-4 h-4 transition-colors" style={{ color: "var(--d-text-muted)" }} />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent text-[13px] placeholder:opacity-50 outline-none w-full"
            style={{ color: "var(--d-text-secondary)" }}
          />
          <kbd
            className="hidden sm:inline-flex text-[10px] rounded-md px-1.5 py-0.5 font-mono"
            style={{
              color: "var(--d-text-ghost)",
              backgroundColor: "var(--d-kbd-bg)",
              border: "1px solid var(--d-border)",
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-300"
          style={{
            backgroundColor: "var(--d-surface-active)",
            border: "1px solid var(--d-border-hover)",
            color: "var(--d-text-secondary)",
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Create</span>
        </motion.button>

        <ThemeToggle />

        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
          style={{
            backgroundColor: "var(--d-surface)",
            border: "1px solid var(--d-border)",
          }}
        >
          <Bell className="w-4 h-4" style={{ color: "var(--d-icon)" }} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500" />
        </button>

        <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-300 hover:opacity-80">
          <div
            className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center"
            style={{ border: "1px solid var(--d-border-hover)" }}
          >
            <span className="text-[11px] font-bold" style={{ color: "var(--d-text-secondary)" }}>Y</span>
          </div>
          <ChevronDown className="w-3 h-3 hidden sm:block" style={{ color: "var(--d-text-muted)" }} />
        </button>
      </div>
    </motion.header>
  );
}
