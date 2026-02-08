"use client";

import React from "react";
import { motion } from "framer-motion";

type Step = {
  id: number;
  title: string;
  description: string;
  icon?: any;
};

type Props = {
  steps: Step[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

const HowItWorksStepper: React.FC<Props> = ({
  steps,
  activeIndex,
  onSelect,
}) => {
  return (
    <div className="flex flex-col relative">
      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/5" />

      {steps.map((step, index) => {
        const isActive = activeIndex === index;
        const Icon = step.icon;

        return (
          <div
            key={step.id}
            onClick={() => onSelect(index)}
            className="relative pl-10 py-10 cursor-pointer group"
          >
            {isActive && (
              <motion.div
                layoutId="active-line-segment"
                className="absolute left-0 top-0 bottom-0 w-[1px] bg-white z-10"
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            )}

            <div className="flex items-start gap-6">
              <div
                className={`mt-1.5 transition-colors duration-500 ${isActive ? "text-white" : "text-gray-600 group-hover:text-gray-400"}`}
              >
                {Icon && <Icon size={22} strokeWidth={1.5} />}
              </div>

              <div className="flex-1">
                <h3
                  className={`text-xl font-light tracking-tight transition-colors duration-500 mb-2 ${isActive ? "text-white" : "text-gray-600 group-hover:text-gray-400"}`}
                >
                  {step.id} — {step.title}
                </h3>
                <p
                  className={`text-[15px] leading-relaxed max-w-sm transition-colors duration-500 ${isActive ? "text-gray-400" : "text-gray-700 group-hover:text-gray-500"}`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HowItWorksStepper;
