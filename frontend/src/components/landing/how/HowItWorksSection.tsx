"use client";

import React, { useState } from "react";
import HowItWorksVisual from "./HowItWorksVisual";
import HowItWorksStepper from "./HowItWorksStepper";
import SectionHeader from "@/components/layout/SectionHeader";
import { MessageSquare, Sparkles, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";

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

  const nextSlide = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const prevSlide = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <section id="how-it-works" className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-[1240px] mx-auto">
        <div className="mb-20">
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

        {/* Medium and small devices: Carousel */}
        <div className="lg:hidden">
          <div className="overflow-hidden relative mb-8">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeStep * 100}%)` }}
            >
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.id} className="w-full flex-shrink-0 px-4">
                    <div className="space-y-6">
                      {/* Image */}
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-neutral-900/40">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-full object-cover opacity-40 grayscale"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80"></div>
                      </div>

                      {/* Content */}
                      <div className="flex items-start gap-4">
                        <div className="mt-1.5 text-white">
                          {Icon && <Icon size={22} strokeWidth={1.5} />}
                        </div>
                        <div>
                          <h3 className="text-xl font-light tracking-tight text-white mb-2">
                            {step.id} — {step.title}
                          </h3>
                          <p className="text-[15px] leading-relaxed text-gray-400">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Previous"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Next"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots pagination */}
          <div className="flex justify-center gap-2">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeStep === i ? "bg-white scale-125" : "bg-white/30"
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
