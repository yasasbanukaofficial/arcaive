"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CoreValueSection() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from(".value-reveal", {
      opacity: 0,
      y: 60,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 60%",
      },
    });
  }, { scope: container });

  return (
    <section 
      ref={container}
      className="scene-section items-center justify-center text-center"
    >
      <div className="w-full relative z-10 value-reveal flex flex-col items-center">
         <span className="oryzo-label mb-12 block">01 / AUTONOMY</span>
         <h2 className="leading-[1] text-[var(--text-primary)] font-bold font-sans tracking-tight max-w-[1200px] mx-auto text-center" style={{ fontSize: "clamp(32px, 5vw, 70px)"}}>
            THE SWARM SCANS GLOBAL JOB ECOSYSTEMS, EVALUATES CULTURAL FIT, AND EXECUTES HYPER-TAILORED SUBMISSIONS WHILE YOU SLEEP.
         </h2>
      </div>
    </section>
  );
}
