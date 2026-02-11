"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Bell, Plus, ChevronDown } from "lucide-react";
import { fadeUp } from "./animations";

export default function TopBar() {
  return (
    <motion.header
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="flex items-center justify-between px-6 lg:px-8 py-4 border-b border-white/4 bg-[#0a0a0a]/60 backdrop-blur-xl sticky top-0 z-40"
    >
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/3 border border-white/6 w-full group hover:border-white/10 transition-all duration-300">
          <Search className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent text-[13px] text-white/70 placeholder:text-white/20 outline-none w-full"
          />
          <kbd className="hidden sm:inline-flex text-[10px] text-white/15 bg-white/4 border border-white/6 rounded-md px-1.5 py-0.5 font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/6 border border-white/8 text-[13px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Create</span>
        </motion.button>

        <button className="relative w-9 h-9 rounded-xl bg-white/3 border border-white/6 flex items-center justify-center hover:bg-white/6 transition-all duration-300">
          <Bell className="w-4 h-4 text-white/30" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500" />
        </button>

        <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/3 transition-all duration-300">
          <div className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-500/30 to-purple-500/30 border border-white/8 flex items-center justify-center">
            <span className="text-[11px] font-bold text-white/80">Y</span>
          </div>
          <ChevronDown className="w-3 h-3 text-white/20 hidden sm:block" />
        </button>
      </div>
    </motion.header>
  );
}
