"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
  error?: string;
};

export default function PasswordInput({
  value,
  onChange,
  onBlur,
  name = "password",
  placeholder = "••••••••",
  error,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <div className="relative">
        <input
          name={name}
          type={show ? "text" : "password"}
          value={value ?? ""}
          onChange={onChange ?? (() => {})}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pr-14 bg-[#0a0a0a] font-sans text-[15px] text-[#ffffff] placeholder-[#444444] border transition-colors rounded-lg focus:outline-none focus:ring-1 focus:ring-[#888888] ${
            error
              ? "border-red-500/50 focus:border-red-500"
              : "border-[#222222] focus:border-[#666666]"
          }`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-0 top-1/2 -translate-y-1/2 oryzo-label hover:text-[var(--text-primary)] transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? "HIDE" : "SHOW"}
        </button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="font-mono text-[11px] mt-2 text-[#D83B2A]"
          >
            ! {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
