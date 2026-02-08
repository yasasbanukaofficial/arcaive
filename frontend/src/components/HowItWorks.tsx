"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MessageSquare, Sparkles, CheckCircle2, Paperclip, Image as ImageIcon, Mic, Library, Send } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Call",
    description: "Type or speak your request, a thought, a task, a question.",
    icon: MessageSquare,
  },
  {
    number: "2",
    title: "Awaken",
    description: "The assistant weaves the answer, shaping text or insight in seconds.",
    icon: Sparkles,
  },
  {
    number: "3",
    title: "Embrace",
    description: "Take what appears — refine it, use it, and move forward with ease.",
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6 relative z-10 bg-[#0a0a0a]">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Product Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-square md:aspect-[4/3] rounded-[40px] overflow-hidden p-6 md:p-12 flex items-center justify-center group bg-[#0d0d0d] border border-white/5"
          >
            {/* Background Blur Image */}
            <div className="absolute inset-0 z-0 opacity-20">
               <Image
                src="/images/hero-bg.png"
                alt="Atmospheric Background"
                fill
                className="object-cover blur-3xl scale-125"
              />
            </div>

            {/* Terminal Interface */}
            <div className="relative z-10 w-full max-w-md bg-black/40 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-2 h-2 rounded-full bg-white/20" />
                 <div className="w-2 h-2 rounded-full bg-white/20" />
                 <div className="w-2 h-2 rounded-full bg-white/20" />
                 <div className="ml-3 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Workspace / Clarity</div>
              </div>
              
              <div className="space-y-4">
                <div className="h-3 w-3/4 bg-white/10 rounded-full" />
                <div className="h-3 w-1/2 bg-white/5 rounded-full" />
                <div className="h-10 w-full bg-white/[0.02] border border-white/5 rounded-lg flex items-center px-3">
                   <div className="h-4 w-[1px] bg-white/40 animate-pulse" />
                   <span className="ml-2 text-xs text-white/20">Ask anything...</span>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-4 text-white/30">
                  <Library className="w-4 h-4 hover:text-white transition-colors" />
                  <Paperclip className="w-4 h-4 hover:text-white transition-colors" />
                  <ImageIcon className="w-4 h-4 hover:text-white transition-colors" />
                  <Mic className="w-4 h-4 hover:text-white transition-colors" />
                </div>
                <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                  <Send className="w-3.5 h-3.5 text-black" />
                </button>
              </div>
            </div>
            
            {/* Subtle Floating Sparkles */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-12 right-12 bg-white/[0.03] border border-white/5 rounded-xl p-3 backdrop-blur-xl hidden md:block"
            >
               <Sparkles className="w-5 h-5 text-white/40" />
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <div className="lg:pl-10">
            <div className="mb-12">
              <span className="text-[11px] font-bold text-white/30 uppercase tracking-[0.3em] block mb-4">• How It Works</span>
              <h2 className="text-[32px] md:text-[52px] font-medium tracking-[-0.03em] leading-[1.1] text-white">
                One prompt to begin, <br />
                <span className="text-white/40">three steps to clarity.</span>
              </h2>
            </div>

            <div className="relative space-y-12">
              <div className="absolute left-[23px] top-6 bottom-6 w-[1px] bg-white/5" />

              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex items-start gap-8 group"
                >
                  <div className="relative z-10 w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-white/[0.08] transition-all">
                    <step.icon className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                  </div>
                  <div className="space-y-2 pt-1.5 text-left">
                    <h4 className="text-[14px] font-bold text-white uppercase tracking-[0.15em]">{step.number} — {step.title}</h4>
                    <p className="text-white/40 font-medium leading-[1.6] max-w-sm text-[15px]">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
