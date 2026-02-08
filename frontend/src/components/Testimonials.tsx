"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "@/components/layout/SectionHeader";
import TextCard from "@/components/ui/TextCard";
import { container } from "@/components/animations/variants";

const testimonials = [
  {
    quote:
      "I've tested countless AI tools, but this one feels different — less like software, more like a guide that clears the fog in my projects.",
    author: "Sophia M.",
    role: "Product Designer",
    count: "1/4",
  },
  {
    quote:
      "Within days, it streamlined my workflow. The balance of precision and inspiration it offers is unlike anything I've seen.",
    author: "David K",
    role: "Indie Hacker",
    count: "2/4",
  },
  {
    quote:
      "At first I was skeptical. But the clarity it brings into complex problems feels almost like working with a second brain.",
    author: "Aria L.",
    role: "Researcher",
    count: "3/4",
  },
  {
    quote:
      "It doesn't just answer — it reframes. Every interaction feels like it points me toward a clearer path.",
    author: "Ethan R;",
    role: "Entrepreneur",
    count: "4/4",
  },
];

export default function Testimonials() {
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const scrollLeft = () => {
    if (!scrollRef.current) return;
    const currentScroll = scrollRef.current.scrollLeft;
    const cardWidth = scrollRef.current.offsetWidth / 3 + 12; // width of one card + gap
    scrollRef.current.scrollTo({
      left: Math.max(0, currentScroll - cardWidth),
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    const currentScroll = scrollRef.current.scrollLeft;
    const cardWidth = scrollRef.current.offsetWidth / 3 + 12; // width of one card + gap
    const maxScroll =
      scrollRef.current.scrollWidth - scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({
      left: Math.min(maxScroll, currentScroll + cardWidth),
      behavior: "smooth",
    });
  };

  return (
    <section
      id="testimonials"
      className="py-32 px-6 bg-[#0a0a0a] border-t border-white/5"
    >
      <div className="max-w-[1240px] mx-auto">
        <div className="mb-16">
          <div className="max-w-4xl">
            <SectionHeader
              tag={"• Testimonials"}
              title={"What others whisper "}
              subtitle={"about the experience"}
              tagTracking={"tracking-[0.3em]"}
            />
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden scrollbar-hide cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
              <motion.ul
                className="flex gap-3 pb-2"
                style={{ width: "fit-content", listStyle: "none" }}
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-120px" }}
              >
                {testimonials.map((t, i) => (
                  <li key={i} style={{ display: "contents" }}>
                    <TextCard quote={t.quote} author={t.author} role={t.role} count={t.count} />
                  </li>
                ))}
              </motion.ul>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-end gap-4 mt-16">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full bg-[#D5FF45] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-black" />
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full bg-[#D5FF45] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
