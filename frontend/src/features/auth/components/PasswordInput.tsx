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
          className={`w-full rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all ${
            error
              ? "bg-red-500/[0.03] border border-red-500/30 focus:ring-red-500/20 focus:border-red-500/40"
              : "bg-white/[0.03] border border-white/10 focus:ring-emerald-500/20 focus:border-emerald-500/40"
          }`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="text-[12px] mt-1.5 ml-1 text-red-400/90"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
