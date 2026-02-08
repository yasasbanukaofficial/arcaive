"use client";

import { motion } from "framer-motion";
import { container, item } from "@/components/animations/variants";
import Image from "next/image";
import SectionHeader from "@/components/layout/SectionHeader";

const features = [
  {
    title: "Time Unfolded",
    description:
      "Automate tasks and reclaim hours, your AI assistant turns routine into seconds so you can focus on growth.",
    image:
      "https://framerusercontent.com/images/bgZEvWFyqIzjQSJmv4ytUskyjNc.jpg",
  },
  {
    title: "Words That Flow",
    description:
      "Drafts, blogs, and emails written with clarity and speed — the elegance of language without the struggle.",
    image:
      "https://framerusercontent.com/images/90SenaC5dxwhBj330jLiE7wnyjU.jpg",
  },
  {
    title: "A Silent Guide",
    description:
      "Always present to keep you focused — suggestions, reminders, and insights right when you need them.",
    image:
      "https://framerusercontent.com/images/UXYVZgG95Xo7GvB3Mj9Avi4ouU.jpg",
  },
];

export default function Features() {
  return (
    <section
      id="about"
      className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 bg-[#0a0a0a]"
    >
      <div className="max-w-[1240px] mx-auto">
        <div className="mb-10 sm:mb-14 md:mb-20">
          <SectionHeader
            label="Introducing"
            title="Harness invisible power"
            subtitle="to write faster, focus deeper, and save hours."
          />
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-5 md:gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={item}
              className={`group relative overflow-hidden ${index === 2 ? "sm:col-span-2 md:col-span-1" : ""}`}
            >
              <div className="aspect-[16/10] sm:aspect-[9/8] relative overflow-hidden rounded-[16px] sm:rounded-[20px] md:rounded-[24px] mb-4 sm:mb-5 md:mb-6 bg-[#111]">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  unoptimized
                  className="object-cover transition-all duration-700 scale-100 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-[18px] sm:text-[20px] md:text-[24px] font-light text-white tracking-tight dm-sans">
                  {feature.title}
                </h3>
                <p className="text-white/50 leading-relaxed text-[13px] sm:text-[14px] md:text-[15px] font-light dm-sans-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
