"use client";

import React, { useState } from "react";
import HowItWorksVisual from "./HowItWorksVisual";
import HowItWorksStepper from "./HowItWorksStepper";
import SectionHeader from "@/components/layout/SectionHeader";
import { MessageSquare, Sparkles, CheckCircle2 } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Call",
    icon: MessageSquare,
    description: "Type or speak your request, a thought, a task, a question.",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 2,
    title: "Awaken",
    icon: Sparkles,
    description:
      "The assistant weaves the answer, shaping text or insight in seconds.",
    image:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 3,
    title: "Embrace",
    icon: CheckCircle2,
    description:
      "Take what appears — refine it, use it, and move forward with ease.",
    image:
      "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1000",
  },
];

const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [hasSelected, setHasSelected] = useState(false);

  return (
    <section
      id="howitworks"
      className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-[#0a0a0a]"
    >
      <div className="max-w-[1240px] mx-auto">
        <div className="mb-10 sm:mb-14 md:mb-20">
          <SectionHeader
            label="How It Works"
            title="One prompt to begin,"
            subtitle="three steps to clarity."
          />
        </div>

        {/* Large devices: Original layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-32 items-center">
          <HowItWorksVisual steps={steps} activeIndex={activeStep} />

          <HowItWorksStepper
            steps={steps}
            activeIndex={activeStep}
            onSelect={setActiveStep}
          />
        </div>

        {/* Medium devices: side by side smaller */}
        <div className="hidden md:grid md:grid-cols-2 lg:hidden gap-8 items-center">
          <div className="relative aspect-[4/3] rounded-[24px] bg-[#0c0c0c] overflow-hidden border border-white/5">
            <img
              src={steps[activeStep].image}
              alt={steps[activeStep].title}
              className="w-full h-full object-cover grayscale brightness-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
          </div>

          <HowItWorksStepper
            steps={steps}
            activeIndex={activeStep}
            onSelect={setActiveStep}
          />
        </div>

        {/* Small devices: Stacked images + vertical step list */}
        <div className="md:hidden">
          {/* All images stacked vertically */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Show only the default image until a step is clicked */}
            {(() => {
              const displayIndex = hasSelected ? activeStep : 0;
              const step = steps[displayIndex];
              return (
                <div
                  key={step.id}
                  className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/10 bg-neutral-900/40"
                  style={{ transition: "opacity 0.3s ease" }}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                </div>
              );
            })()}
          </div>

          {/* All steps listed vertically with left border */}
          <div className="flex flex-col">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              return (
                <div
                  key={step.id}
                  onClick={() => {
                    setActiveStep(index);
                    setHasSelected(true);
                  }}
                  className={`relative flex flex-col gap-3 py-5 px-4 cursor-pointer border-l-2 transition-all ${
                    isActive
                      ? "border-white"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  {/* Icon and Title row */}
                  <div className="flex items-center gap-3">
                    <div className="text-white">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[15px] font-medium tracking-tight text-white">
                      {step.id} — {step.title}
                    </h3>
                  </div>
                  {/* Description */}
                  <div className="pl-8">
                    <p className="text-[13px] leading-relaxed text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
