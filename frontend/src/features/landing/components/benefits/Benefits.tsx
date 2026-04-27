"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Benefits() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from(".benefit-reveal", {
      opacity: 0,
      y: 40,
      duration: 1.5,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 60%",
      },
    });
  }, { scope: container });

  return (
    <section id="benefits" ref={container} className="scene-section">
      <div className="w-full relative z-10 flex flex-col justify-end min-h-[50vh]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-end">
          <div className="benefit-reveal">
            <h2 className="leading-[1] text-[var(--text-primary)] font-bold font-sans tracking-tight" style={{ fontSize: "clamp(42px, 6vw, 90px)"}}>
              ALIGNMENT<br/>
              ENGINE.
            </h2>
          </div>
          
          <div className="flex justify-end benefit-reveal">
             <div className="oryzo-panel max-w-[400px]">
               <h3 className="font-sans text-[22px] font-bold tracking-tight leading-[1.2] mb-6">
                 ABSOLUTE PRECISION
               </h3>
               <p className="font-sans text-[16px] text-[var(--text-secondary)] leading-relaxed mb-8">
                 We eliminate the variance of the human element. Our agents synchronize your vector space with live market requirements.
               </p>
               <div className="flex gap-8 text-[var(--text-primary)] font-bold font-sans text-[24px]">
                 <div>98% <span className="oryzo-label block mt-2">ACCURACY</span></div>
                 <div>14K+ <span className="oryzo-label block mt-2">SUBMISSIONS</span></div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
