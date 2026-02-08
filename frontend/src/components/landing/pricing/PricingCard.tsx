"use client";

import React from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedPrice from "./AnimatedPrice";

type Props = {
  plan: string;
  price: number | string;
  description: string;
  buttonText: string;
  features: string[];
  popular?: boolean;
  isYearly?: boolean;
};

const PricingCard: React.FC<Props> = ({
  plan,
  price,
  description,
  buttonText,
  features,
  popular = false,
  isYearly = false,
}) => {
  const displayPrice =
    typeof price === "number"
      ? isYearly
        ? Math.floor(price * 0.8)
        : price
      : price;

  return (
    <div
      className={`relative p-8 bg-[#121212]/50 border ${popular ? "border-white/30" : "border-white/10"} transition-all duration-300 h-full flex flex-col`}
    >
      {popular && (
        <span className="absolute top-4 right-4 px-3 py-1 rounded-full border border-white/20 text-[10px] uppercase tracking-widest text-white/80 bg-white/5">
          Popular
        </span>
      )}

      <div className="mb-8">
        <h4 className="text-gray-400 text-sm font-medium mb-6 uppercase tracking-wider">
          {plan}
        </h4>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-4xl font-light text-white flex overflow-hidden">
            {typeof price === "number" && <span>€</span>}
            <AnimatePresence mode="wait">
              <AnimatedPrice value={displayPrice} />
            </AnimatePresence>
          </span>
          {typeof price === "number" && (
            <span className="text-gray-500 text-sm ml-1">/month</span>
          )}
        </div>
        <p className="text-sm text-gray-400 leading-relaxed min-h-[48px]">
          {description}
        </p>
      </div>

      <button
        className={`w-full py-3 px-6 rounded-full text-sm font-medium transition-all mb-10 ${
          popular
            ? "bg-white text-black hover:bg-gray-200"
            : "bg-transparent text-white border border-white/20 hover:border-white/40"
        }`}
      >
        {buttonText}
      </button>

      <div className="mt-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-white/10 flex-grow" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
            Features
          </span>
          <div className="h-px bg-white/10 flex-grow" />
        </div>
        <ul className="space-y-4">
          {features.map((feature, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-gray-400"
            >
              <Check size={16} className="text-gray-500 mt-0.5 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PricingCard;
