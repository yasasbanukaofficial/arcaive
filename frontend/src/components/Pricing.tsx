"use client";

import { motion } from "framer-motion";
import { container, item } from "@/components/animations/variants";
import { Check } from "lucide-react";
import SectionHeader from "@/components/layout/SectionHeader";

const plans = [
  {
    name: "Starter",
    price: "€0",
    period: "/month",
    description:
      "Perfect to explore AI with essential tools for individuals and small projects.",
    cta: "Start for Free",
    features: [
      "Basic access to AI core",
      "Limited prompts per month",
      "Community support",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "€29",
    period: "/month",
    description:
      "Advanced features and flexibility to scale productivity and handle bigger workloads.",
    cta: "Upgrade to Pro",
    features: [
      "Unlimited AI prompts",
      "Priority response time",
      "Early access to new models",
    ],
    popular: true,
  },
  {
    name: "Lifetime",
    price: "Custom",
    period: "",
    description:
      "Full power with custom options, priority support, and team-ready collaboration.",
    cta: "Contact Sales",
    features: [
      "Dedicated workspace",
      "Advanced model tuning",
      "Premium support & SLA",
    ],
    popular: false,
  },
];

import PricingSection from "./landing/pricing/PricingSection";

export default function Pricing() {
  return <PricingSection />;
}
