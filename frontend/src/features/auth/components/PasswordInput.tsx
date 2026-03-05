"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
};

export default function PasswordInput({
  value,
  onChange,
  name = "password",
  placeholder = "••••••••",
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        name={name}
        type={show ? "text" : "password"}
        value={value ?? ""}
        onChange={onChange ?? (() => {})}
        placeholder={placeholder}
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all"
        required
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
  );
}
