"use client";

import React from "react";
import { MOCK_PLANS } from "@/app/data/billing";
import { useRouter } from "next/navigation";
import SubscriptionGrid from "./SubscriptionGrid";

export default function SubscriptionChoosingPage() {
  const router = useRouter();

  const plans = MOCK_PLANS.filter((p) => p.billingPeriod === "month").filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i);

  function handleChoose(id: string) {
    router.push("/jobs");
  }

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto">
        {/* <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white">Choose a plan that suits you</h2>
          <p className="text-white/70 mt-2">You can change your plan anytime</p>
        </div> */}
        <SubscriptionGrid plans={plans} onSelect={handleChoose} />
      </div>
    </div>
  );
}
