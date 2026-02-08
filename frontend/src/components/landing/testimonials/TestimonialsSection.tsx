"use client";

import React from "react";
import TestimonialSlider from "./TestimonialSlider";
import SectionHeader from "@/components/layout/SectionHeader";

const testimonials = [
  {
    id: 1,
    quote:
      "I've tested countless AI tools, but this one feels different — less like software, more like a guide that clears the fog in my projects.",
    name: "Sophia M.",
    role: "Product Designer",
  },
  {
    id: 2,
    quote:
      "Within days, it streamlined my workflow. The balance of precision and inspiration it offers is unlike anything I've seen.",
    name: "David K.",
    role: "Indie Hacker",
  },
  {
    id: 3,
    quote:
      "At first I was skeptical. But the clarity it brings into complex problems feels almost like working with a second brain.",
    name: "Aria L.",
    role: "Researcher",
  },
  {
    id: 4,
    quote:
      "The seamless integration into my creative process has been a game changer. It doesn't replace me; it amplifies my reach.",
    name: "Marcus T.",
    role: "Art Director",
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <div
      id="testimonials"
      className="bg-[#0a0a0a] text-[#f5f5f5] font-sans flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20 md:py-24 selection:bg-white/20"
    >
      <div className="max-w-[1240px] mx-auto w-full space-y-8 sm:space-y-12 md:space-y-16">
        <div className="mb-10 sm:mb-14 md:mb-20">
          <SectionHeader
            label="Testimonials"
            title="What others whisper"
            subtitle="about the experience"
          />
        </div>

        <TestimonialSlider testimonials={testimonials} />
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default TestimonialsSection;
