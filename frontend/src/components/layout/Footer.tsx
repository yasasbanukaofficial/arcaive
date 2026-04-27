"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, Github, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-[#FAF9F6] text-black pt-40 pb-20 px-6 lg:px-12 border-t border-black/[0.03]">
      <div className="max-w-[1400px] mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-12 mb-32">
          {/* Brand & Mission */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <Link href="/" className="flex items-center gap-4 group w-fit">
              <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center bg-white group-hover:bg-black group-hover:text-white transition-all duration-500 shadow-sm">
                <span className="font-sans text-[18px] font-bold italic">A</span>
              </div>
              <span className="font-sans text-[24px] font-medium tracking-tight">Arcaive<span className="text-black/20 italic ml-1 text-[12px]">INT</span></span>
            </Link>

            <p className="font-sans text-[20px] leading-relaxed text-black/50 max-w-[400px] font-light italic">
              "The intelligence layer for the modern professional. Built to automate the search, so you can focus on the vision."
            </p>

            <div className="flex gap-6 mt-4">
              {[
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Github, href: "#" }
              ].map((social, i) => (
                <Link key={i} href={social.href} className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center bg-white text-black/40 hover:text-black hover:border-black/20 transition-all duration-500 shadow-sm">
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Nav Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-12">
            {[
              {
                title: "Platform",
                links: [
                  { name: "Features", href: "#features" },
                  { name: "Intelligence", href: "#howitworks" },
                  { name: "Economics", href: "#pricing" },
                  { name: "Support", href: "#faq" },
                ],
              },
              {
                title: "Legal",
                links: [
                  { name: "Privacy", href: "#" },
                  { name: "Terms", href: "#" },
                  { name: "Security", href: "#" },
                ],
              }
            ].map((section) => (
              <div key={section.title} className="flex flex-col gap-8">
                <h5 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-black/30">
                  {section.title}
                </h5>
                <div className="flex flex-col gap-5">
                  {section.links.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="font-sans text-[14px] font-medium text-black/50 hover:text-black transition-all group flex items-center gap-2"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h5 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-black/30 mb-8">
              Intelligence Feed
            </h5>
            <div className="bg-white rounded-[32px] p-8 border border-black/[0.03] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              
              <p className="font-sans text-[13px] text-black/50 mb-6 leading-relaxed">
                Receive the monthly digest on AI recruitment trends.
              </p>
              
              <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-[#FAF9F6] border border-black/5 rounded-full px-5 py-3 font-sans text-[13px] text-black placeholder:text-black/30 focus:outline-none focus:border-black/20 transition-all"
                />
                <button
                  type="submit"
                  className="bg-black text-white rounded-full py-3 font-sans text-[12px] font-bold uppercase tracking-widest hover:bg-black/80 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Join Feed <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-black/[0.03] flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="font-sans text-[12px] font-medium text-black/20 uppercase tracking-[0.1em]">
            © {new Date().getFullYear()} Arcaive Intelligence.
          </p>
          <div className="flex gap-10">
            <span className="font-sans text-[12px] font-medium text-black/20 uppercase tracking-[0.1em]">
              Designed for impact.
            </span>
            <span className="font-sans text-[12px] font-medium text-black/20 uppercase tracking-[0.1em]">
              V 2.5
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
