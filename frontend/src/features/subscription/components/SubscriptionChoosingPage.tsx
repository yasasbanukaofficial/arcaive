"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { MOCK_PLANS } from "@/app/data/billing";
import { Check } from "lucide-react";

const PLANS = MOCK_PLANS
  .filter((p) => p.billingPeriod === "month")
  .reduce((acc: any[], p) => (acc.find((x) => x.id === p.id) ? acc : [...acc, p]), []);

const DESCRIPTION_MAP: Record<string, string> = {
  free: "Starter pack to get you going",
  pro: "Power tools for active job seekers",
  enterprise: "For teams and large-scale workflows",
};

export default function SubscriptionChoosingPage() {
  const router = useRouter();

  const handleSelect = (planId: string) => {
    console.log("selected plan", planId);
    router.push("/jobs");
  };

  const handleContinueStarter = () => {
    console.log("continue with starter");
    router.push("/jobs");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0c0d] p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-extrabold text-center text-white mb-10">Choose a plan that suits you</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan: any) => (
            <div
              key={plan.id}
              className="relative p-6 bg-[#121212]/50 border rounded-2xl flex flex-col h-full transition-transform hover:-translate-y-2 shadow-lg"
              style={{ borderColor: plan.isPopular ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)" }}
            >
              {plan.isPopular && (
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs uppercase tracking-wider bg-white/5 text-white/90 border border-white/20">
                  Popular
                </span>
              )}

              <div className="mb-4">
                <h3 className="text-xs uppercase text-gray-400 tracking-wider font-medium mb-2">{plan.id === 'free' ? 'Starter' : plan.name}</h3>

                <div className="flex items-end gap-3">
                  <div className="text-4xl font-bold text-white">{plan.price === 0 ? "Free" : `$${plan.price}`}</div>
                  <div className="text-sm text-white/70 mb-1">/month</div>
                </div>

                <p className="text-sm text-white/60 mt-3 min-h-[40px]">{DESCRIPTION_MAP[plan.id] ?? "Great value"}</p>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px bg-white/8 flex-1" />
                  <div className="text-xs uppercase tracking-widest text-gray-400">Features</div>
                  <div className="h-px bg-white/8 flex-1" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/90">
                  {plan.features?.map((f: string, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                      <span className="leading-tight">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={() => handleSelect(plan.id)}
                  className="w-full rounded-full py-2.5 bg-transparent border border-white/12 text-white hover:bg-white/6"
                >
                  Choose {plan.name}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button
            variant="secondary"
            className="w-full max-w-md mx-auto bg-transparent border border-white/12 text-white hover:bg-white/6"
            onClick={handleContinueStarter}
          >
            Continue with Default Starter Pack
          </Button>
        </div>
      </div>
    </div>
  );
}
