"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Zap, Target, Shield, Search, RefreshCw } from "lucide-react";

const benefits = [
  {
    title: "Precision Matching",
    description: "Our agents synchronize your vector space with live market requirements for absolute alignment.",
    icon: Target,
  },
  {
    title: "Velocity",
    description: "Accelerate through the digital noise with autonomous job application swarms.",
    icon: Zap,
  },
  {
    title: "Narrative Armor",
    description: "Stress-test your experience against adversarial AI models before real interaction.",
    icon: Shield,
  }
];

export default function Benefits() {
  return (
    <section id="benefits" className="bg-transparent py-40 px-6 lg:px-12 relative overflow-hidden">
      <div className="max-w-[1800px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-24">
          <div className="flex flex-col gap-8">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.4em] text-white/30 font-mono">ALIGNMENT_ENGINE.BOOT()</span>
            <h2 className="font-sans text-[48px] sm:text-[64px] font-medium leading-[1] tracking-tight text-white">
              Engineered for <br/>
              <span className="text-white/20 italic font-light">high-signal outcomes.</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="flex flex-col gap-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                  <b.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-sans text-[18px] font-bold text-white mb-2">{b.title}</h4>
                  <p className="font-sans text-[14px] text-white/30 leading-relaxed font-light italic">
                    {b.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dynamic Visualization Component */}
        <div className="h-[400px] w-full bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[64px] relative overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-[800px] h-[1px] bg-white/5">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    x: ["-100%", "200%"],
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: i * 0.5
                  }}
                  className="absolute top-0 w-32 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
              ))}
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-mono text-[9px] uppercase tracking-[8px] text-white/20 rotate-90">SYMMETRICAL_MATCHING</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
