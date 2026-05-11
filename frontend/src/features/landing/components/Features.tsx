"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Features() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from(".feature-reveal", {
      opacity: 0,
      y: 50,
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 65%",
      }
    });
  }, { scope: container });

  return (
    <section
      id="features"
      ref={container}
      className="scene-section justify-between"
    >
      <div className="w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        {/* Left Side: Massive Statement */}
        <div className="feature-reveal">
          <h2 className="leading-[1.1] text-[var(--text-primary)] font-bold font-sans tracking-tight" style={{ fontSize: "clamp(48px, 6vw, 90px)"}}>
            ISN'T JUST<br/>
            A RESUME.
          </h2>
        </div>

        {/* Right Side: Description */}
        <div className="feature-reveal flex flex-col justify-end h-full">
          <p className="font-sans text-[28px] sm:text-[36px] text-[var(--text-primary)] leading-[1.3] font-medium max-w-[500px]">
            Arcaive isn't just a tool. It's the result of unprecedented AI* breakthroughs, executing submissions while you sleep.
          </p>

          <div className="mt-32 w-full max-w-[500px]">
            <div className="w-full border-b border-[var(--border-light)] border-dashed mb-4" />
            <span className="oryzo-label text-right w-full block">
              * ARTIFICIAL INTELLIGENCE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
