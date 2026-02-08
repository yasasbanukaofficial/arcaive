"use client";

import Link from "next/link";
import { Twitter, Disc as Discord, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-24 px-6 border-t border-white/5 bg-[#0a0a0a]">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white group-hover:scale-110 transition-all duration-500"
              >
                <path
                  d="M12 4L14.5 9.5L20 12L14.5 14.5L12 20L9.5 14.5L4 12L9.5 9.5L12 4Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-xl font-bold tracking-tight text-white">Message</span>
            </Link>
            <p className="text-white/30 font-medium max-w-sm leading-relaxed text-[15px]">
              An AI companion that whispers clarity, conjures ideas, and guides your every move towards efficiency.
            </p>
            <div className="flex items-center gap-4">
              {[Twitter, Discord, Linkedin].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-11 h-11 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500"
                >
                  <Icon className="w-4.5 h-4.5 text-white/40 group-hover:text-white" />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h5 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.3em]">Product</h5>
            <div className="flex flex-col gap-4 text-[14px] font-medium text-white/40">
              <Link href="#about" className="hover:text-white transition-colors">About</Link>
              <Link href="#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="#testimonials" className="hover:text-white transition-colors">Testimonials</Link>
            </div>
          </div>

          <div className="space-y-8">
            <h5 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.3em]">Support</h5>
            <div className="flex flex-col gap-4 text-[14px] font-medium text-white/40">
              <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-6">
          <p className="text-[12px] font-bold text-white/20 uppercase tracking-[0.1em]">
            © {new Date().getFullYear()} Message AI. All rights reserved.
          </p>
          <p className="text-[12px] font-bold text-white/20 uppercase tracking-[0.2em]">
            Created with Clarity
          </p>
        </div>
      </div>
    </footer>
  );
}
