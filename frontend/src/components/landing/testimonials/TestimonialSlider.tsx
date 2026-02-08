"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import TestimonialCard from "./TestimonialCard";

type Testimonial = {
  id: number;
  quote: string;
  name: string;
  role: string;
};

type Props = {
  testimonials: Testimonial[];
};

const TestimonialSlider: React.FC<Props> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );

  return (
    <div className="relative">
      {/* Desktop: 3-column grid */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[0, 1, 2].map((offset) => {
            const index = (currentIndex + offset) % testimonials.length;
            const item = testimonials[index];
            return (
              <TestimonialCard
                key={item.id}
                quote={item.quote}
                name={item.name}
                role={item.role}
                index={index}
                total={testimonials.length}
                mode="grid"
              />
            );
          })}
        </div>

        {/* Desktop arrows */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Previous"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Next"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tablet: 2-column grid */}
      <div className="hidden md:block lg:hidden">
        <div className="grid grid-cols-2 gap-5 mb-10">
          {[0, 1].map((offset) => {
            const index = (currentIndex + offset) % testimonials.length;
            const item = testimonials[index];
            return (
              <TestimonialCard
                key={item.id}
                quote={item.quote}
                name={item.name}
                role={item.role}
                index={index}
                total={testimonials.length}
                mode="grid"
              />
            );
          })}
        </div>

        {/* Tablet arrows */}
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={prevSlide}
            className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Previous"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Next"
          >
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Mobile: Carousel */}
      <div className="md:hidden relative">
        <div className="overflow-hidden relative mb-6">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((item, index) => (
              <div key={item.id} className="w-full flex-shrink-0 px-1">
                <TestimonialCard
                  quote={item.quote}
                  name={item.name}
                  role={item.role}
                  index={index}
                  total={testimonials.length}
                  mode="carousel"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile arrows */}
        <div className="flex items-center justify-center gap-5 mb-6">
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

        {/* Mobile dots */}
        <div className="flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-transform duration-300 ${
                currentIndex === i ? "bg-white scale-125" : "bg-white/30"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
