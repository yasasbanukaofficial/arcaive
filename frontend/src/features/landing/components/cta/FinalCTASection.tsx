"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FinalCTASection() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from(".cta-reveal", {
      opacity: 0,
      y: 60,
      duration: 1.5,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 60%",
      },
    });
  }, { scope: container });

  return (
    <section ref={container} className="scene-section items-center justify-center min-h-[90vh]">
      <div className="w-full relative z-10 flex flex-col items-center text-center cta-reveal">
        <h2 className="leading-[0.85] text-[var(--text-primary)] font-bold font-sans tracking-tight mb-20" style={{ fontSize: "clamp(60px, 12vw, 200px)"}}>
          OWN YOUR<br/>
          EVOLUTION.
        </h2>
        
        <Link
          href="/register"
          className="dark:bg-[#050505] dark:text-white dark:border-[#050505] light:bg-white light:text-black light:border-white group inline-flex items-center gap-6 px-12 py-6 border rounded-sm font-sans text-[14px] font-bold uppercase tracking-[0.2em] transition-colors duration-300"
        >
          JOIN US
          <ArrowUpRight className="w-5 h-5 dark:text-white light:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>

      </div>
    </section>
  );
}
