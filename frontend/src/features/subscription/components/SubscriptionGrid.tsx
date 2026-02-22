"use client";

import React from "react";
import PricingCard from "./PricingCard";

type Plan = {
  id: string;
  name: string;
  price: number;
  features?: string[];
  isPopular?: boolean;
};

export default function SubscriptionGrid({ plans, onSelect }: { plans: Plan[]; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((p) => (
        <PricingCard key={p.id} plan={p} onSelect={onSelect} />
      ))}
    </div>
  );
}
