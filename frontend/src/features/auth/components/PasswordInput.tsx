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
          className={`w-full px-4 py-[14px] pr-16 font-sans text-[15px] border  focus:outline-none ${
            error
              ? "border-[#D83B2A]"
              : "border-[#E8E6DE] bg-white focus:border-black"
          }`}
          style={{ borderRadius: 0 }}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-widest text-[#888880] hover:text-black transition-colors"
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
