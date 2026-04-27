"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
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
      className="w-full flex flex-col md:flex-row items-stretch border border-[#222] bg-white overflow-hidden"
    >
      <div className="flex-1 flex items-center px-6 py-4">
        <input
          type="text"
          placeholder="JOB TITLE, KEYWORD, OR COMPANY"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full bg-transparent outline-none font-sans text-[18px] uppercase font-bold placeholder:text-[#888880]"
        />
      </div>

      <div className="w-full md:w-auto flex items-stretch border-t md:border-t-0 md:border-l border-[#222]">
        <div className="flex-1 md:w-64 px-6 py-4 flex items-center">
          <input
            type="text"
            placeholder="LOCATION"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full bg-transparent outline-none font-mono text-[14px] uppercase tracking-widest text-black"
          />
        </div>
        
        <button 
          className="bg-black text-white px-8 flex items-center justify-center text-[24px] hover:bg-[#D4F461] hover:text-black transition-colors"
        >
          →
        </button>
      </div>
    </motion.div>
  );
}
