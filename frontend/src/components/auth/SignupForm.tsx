"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from 'lucide-react';
import SocialButtons from './SocialButtons';
import PasswordInput from './PasswordInput';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: add signup logic
    console.log('signup', { name, email, password, confirmPassword });
  };

  return (
    <>
      <SocialButtons />

      <div className="relative flex items-center gap-4 py-2">
        <div className="h-px flex-1 bg-white/5"></div>
        <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Or use email</span>
        <div className="h-px flex-1 bg-white/5"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-gray-400 ml-1">Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-gray-400 ml-1">Email Address</label>
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
          <label className="text-[13px] font-medium text-gray-400">Password</label>
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-gray-400">Confirm password</label>
          <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} name="confirmPassword" />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-white text-black font-semibold py-3.5 rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group"
        >
          Create account
          <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-8">
        Already have an account?{' '}
        <Link href="/login" className="text-white hover:underline decoration-white/30 underline-offset-4">Sign in</Link>
      </p>
    </>
  );
}
