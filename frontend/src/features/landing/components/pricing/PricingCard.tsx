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
    <div
      className={`relative p-10 h-full flex flex-col transition-[background-color,border-color] duration-300 border ${
        popular ? "bg-[var(--glass-border)] border-[var(--glass-border)]" : "bg-[var(--glass-bg)] border-[var(--glass-border)]"
      }`}
      style={{ borderRadius: "var(--radius)" }}
    >
      {popular && (
        <div className="absolute top-6 right-6">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-primary)] border border-[var(--glass-border)] px-2 py-1">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="mb-10">
        <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-8">
          {plan}
        </h4>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="font-sans text-[56px] font-bold text-[var(--text-primary)] leading-tight tracking-tight">
            {typeof price === "number" && "€"}
            <AnimatePresence mode="wait">
              <AnimatedPrice value={displayPrice} />
            </AnimatePresence>
          </span>
          {typeof price === "number" && (
            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)] ml-2">
              /month
            </span>
          )}
        </div>
        <p className="font-sans text-[14px] text-[var(--text-secondary)] leading-relaxed">
          {description}
        </p>
      </div>

      <div className="w-full h-[1px] bg-[var(--glass-border)] mb-10" />

      <div className="flex-1">
        <ul className="space-y-4 mb-12">
          {features.map((feature, i) => (
            <li
              key={i}
              className="flex items-start gap-3 font-sans text-[14px] text-[var(--text-primary)]"
            >
              <span className="text-[var(--text-secondary)]">—</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => onSelect?.(plan)}
        className="btn-primary w-full"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default PricingCard;
