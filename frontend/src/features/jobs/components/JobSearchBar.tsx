"use client";

import React from "react";
import { motion } from "framer-motion";
import LocationDropdown from "./LocationDropdown";

interface JobSearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
}

export default function JobSearchBar({
  query,
  onQueryChange,
  location,
  onLocationChange,
}: JobSearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex flex-col md:flex-row items-stretch border border-[#2a2a2a] bg-[#161616] rounded-[24px] overflow-hidden"
    >
      <div className="flex-1 flex items-center px-6 py-4">
        <input
          type="text"
          placeholder="Job title, keyword, or company"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full bg-transparent outline-none font-sans text-[16px] font-medium text-white/90 placeholder:text-white/30"
        />
      </div>

      <div className="w-full md:w-auto flex items-stretch border-t md:border-t-0 md:border-l border-[#2a2a2a]">
        <div className="flex-1 md:w-64 px-6 py-4 flex items-center">
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full bg-transparent outline-none font-sans text-[14px] text-white/70 placeholder:text-white/30"
          />
        </div>
        
        <button 
          className="bg-[#e6efdf] text-[#111] px-8 flex items-center justify-center text-[20px] font-bold hover:opacity-90 transition-opacity"
        >
          →
        </button>
      </div>
    </motion.div>
  );
}
