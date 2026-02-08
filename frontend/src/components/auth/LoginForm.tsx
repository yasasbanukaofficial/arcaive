"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SocialButtons from "./SocialButtons";
import PasswordInput from "./PasswordInput";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: add login logic
    console.log("login", { email, password });
  };

  return (
    <>
      <SocialButtons />

      <div className="relative flex items-center gap-4 py-2">
        <div className="h-px flex-1 bg-white/5"></div>
        <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">
          Or use email
        </span>
        <div className="h-px flex-1 bg-white/5"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-gray-400 ml-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all"
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="text-[13px] font-medium text-gray-400">
              Password
            </label>
            <Link
              href="#"
              className="text-[12px] text-emerald-500/80 hover:text-emerald-400 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-white text-black font-semibold py-3.5 rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group"
        >
          Sign In
          <ArrowRight
            size={18}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-8">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="text-white hover:underline decoration-white/30 underline-offset-4"
        >
          Create one for free
        </Link>
      </p>
    </>
  );
}
