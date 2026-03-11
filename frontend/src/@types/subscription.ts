export type PlanType = "explorer" | "strategist" | "architect";

export interface SubscriptionPlan {
  id: PlanType;
  name: string;
  price: number;
  billingPeriod: "month" | "year";
  features: string[];
  isPopular?: boolean;
  maxAgents?: number;
  maxJobs?: number;
}

export interface MemberSubscription {
  currentPlan: PlanType;
  billingPeriod: "month" | "year";
  renewalDate: string;
  isActive: boolean;
  cancelAtPeriodEnd?: boolean;
  usage: {
    agentsUsed: number;
    jobsApplied: number;
  };
}

export interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  invoice?: string;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "paypal";
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}
