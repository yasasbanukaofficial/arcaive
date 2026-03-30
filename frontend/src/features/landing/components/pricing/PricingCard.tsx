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
  onSelect?: (plan: string) => void;
};

const PricingCard = ({
  plan,
  price,
  description,
  buttonText,
  features,
  popular = false,
  isYearly = false,
  onSelect,
}: Props) => {
  const displayPrice =
    typeof price === "number"
      ? isYearly
        ? Math.floor(price * 0.8)
        : price
      : price;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative p-6 sm:p-8 bg-[#0f0f0f] border-2 rounded-2xl h-full flex flex-col transition-all duration-300 ${
        popular
          ? "border-emerald-500/50 shadow-lg shadow-emerald-500/10"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 rounded-full bg-emerald-500 text-black text-xs font-semibold uppercase tracking-wider">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h4 className="text-white text-lg font-semibold mb-2">
          {plan}
        </h4>
        <p className="text-white/50 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl sm:text-5xl font-bold text-white">
            {typeof price === "number" && "€"}
            <AnimatePresence mode="wait">
              <AnimatedPrice value={displayPrice} />
            </AnimatePresence>
          </span>
          {typeof price === "number" && (
            <span className="text-white/50 text-sm">
              /month
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onSelect?.(plan)}
        className={`w-full py-3 px-6 rounded-xl text-sm font-semibold transition-all ${
          popular
            ? "bg-emerald-500 text-black hover:bg-emerald-400"
            : "bg-white text-black hover:bg-gray-200"
        }`}
      >
        {buttonText}
      </button>

      <div className="mt-8">
        <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
          What's included
        </p>
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-white/80"
            >
              <Check
                size={18}
                className={`mt-0.5 shrink-0 ${
                  popular ? "text-emerald-400" : "text-white/60"
                }`}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default PricingCard;
