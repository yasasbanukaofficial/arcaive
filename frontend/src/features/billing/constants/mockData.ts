import type {
  PaymentMethod,
  BillingHistory,
  MemberSubscription,
  SubscriptionPlan,
} from "@/@types/subscription";

export const MOCK_MEMBER_SUBSCRIPTION: MemberSubscription = {
  currentPlan: "free",
  billingPeriod: "month",
  renewalDate: "2026-03-14",
  isActive: true,
  usage: {
    agentsUsed: 3,
    jobsApplied: 47,
  },
};

export const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    billingPeriod: "month",
    features: [
      "1 AI Agent",
      "10 job applications per month",
      "Basic resume optimization",
      "Email support",
      "Standard response time",
    ],
    maxAgents: 1,
    maxJobs: 10,
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    billingPeriod: "month",
    features: [
      "5 AI Agents",
      "Unlimited job applications",
      "Advanced resume optimization",
      "Priority email support",
      "Interview preparation tools",
      "Application tracking",
      "Custom cover letters",
    ],
    isPopular: true,
    maxAgents: 5,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    billingPeriod: "month",
    features: [
      "Unlimited AI Agents",
      "Unlimited job applications",
      "Premium resume optimization",
      "24/7 priority support",
      "Dedicated success manager",
      "Advanced analytics",
      "Custom integrations",
      "Team collaboration",
    ],
  },
  {
    id: "free",
    name: "Free",
    price: 0,
    billingPeriod: "year",
    features: [
      "1 AI Agent",
      "10 job applications per month",
      "Basic resume optimization",
      "Email support",
      "Standard response time",
    ],
    maxAgents: 1,
    maxJobs: 10,
  },
  {
    id: "pro",
    name: "Pro",
    price: 279,
    billingPeriod: "year",
    features: [
      "5 AI Agents",
      "Unlimited job applications",
      "Advanced resume optimization",
      "Priority email support",
      "Interview preparation tools",
      "Application tracking",
      "Custom cover letters",
      "Save $69 per year",
    ],
    isPopular: true,
    maxAgents: 5,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 949,
    billingPeriod: "year",
    features: [
      "Unlimited AI Agents",
      "Unlimited job applications",
      "Premium resume optimization",
      "24/7 priority support",
      "Dedicated success manager",
      "Advanced analytics",
      "Custom integrations",
      "Team collaboration",
      "Save $239 per year",
    ],
  },
];

export const MOCK_BILLING_HISTORY: BillingHistory[] = [
  {
    id: "inv_001",
    date: "2026-02-14",
    amount: 29.0,
    status: "paid",
    invoice: "/invoices/inv_001.pdf",
  },
  {
    id: "inv_002",
    date: "2026-01-14",
    amount: 29.0,
    status: "paid",
    invoice: "/invoices/inv_002.pdf",
  },
  {
    id: "inv_003",
    date: "2025-12-14",
    amount: 29.0,
    status: "paid",
    invoice: "/invoices/inv_003.pdf",
  },
];

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm_001",
    type: "card",
    last4: "4242",
    brand: "Visa",
    expiryMonth: 12,
    expiryYear: 2027,
    isDefault: true,
  },
  {
    id: "pm_002",
    type: "card",
    last4: "5555",
    brand: "Mastercard",
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false,
  },
];
