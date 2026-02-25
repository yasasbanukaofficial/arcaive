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

const PricingCard = ({
  plan,
  price,
  description,
  buttonText,
  features,
  popular = false,
  isYearly = false,
}: Props) => {
  const displayPrice =
    typeof price === "number"
      ? isYearly
        ? Math.floor(price * 0.8)
        : price
      : price;

  return (
    <div
      className={`relative p-5 sm:p-6 md:p-8 bg-[#121212]/50 border ${popular ? "border-white/30" : "border-white/10"} transition-all duration-300 h-full flex flex-col`}
    >
      {popular && (
        <span className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/20 text-[9px] sm:text-[10px] uppercase tracking-widest text-white/80 bg-white/5">
          Popular
        </span>
      )}

      <div className="mb-5 sm:mb-6 md:mb-8">
        <h4 className="text-gray-400 text-[13px] sm:text-sm font-medium mb-4 sm:mb-6 uppercase tracking-wider">
          {plan}
        </h4>
        <div className="flex items-baseline gap-1 mb-3 sm:mb-4">
          <span className="text-3xl sm:text-4xl font-light text-white flex overflow-hidden">
            {typeof price === "number" && <span>€</span>}
            <AnimatePresence mode="wait">
              <AnimatedPrice value={displayPrice} />
            </AnimatePresence>
          </span>
          {typeof price === "number" && (
            <span className="text-gray-500 text-[13px] sm:text-sm ml-1">
              /month
            </span>
          )}
        </div>
        <p className="text-[13px] sm:text-sm text-gray-400 leading-relaxed min-h-[40px] sm:min-h-[48px]">
          {description}
        </p>
      </div>

      <button
        className={`w-full py-2.5 sm:py-3 px-5 sm:px-6 rounded-full text-[13px] sm:text-sm font-medium transition-all mb-6 sm:mb-8 md:mb-10 ${
          popular
            ? "bg-white text-black hover:bg-gray-200"
            : "bg-transparent text-white border border-white/20 hover:border-white/40"
        }`}
      >
        {buttonText}
      </button>

      <div className="mt-auto">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="h-px bg-white/10 flex-grow" />
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
            Features
          </span>
          <div className="h-px bg-white/10 flex-grow" />
        </div>
        <ul className="space-y-3 sm:space-y-4">
          {features.map((feature, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 sm:gap-3 text-[13px] sm:text-sm text-gray-400"
            >
              <Check
                size={15}
                className="text-gray-500 mt-0.5 shrink-0 sm:hidden"
              />
              <Check
                size={16}
                className="text-gray-500 mt-0.5 shrink-0 hidden sm:block"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PricingCard;
