export type PlanType = "explorer" | "strategist" | "architect";

export interface SubscriptionPlan {
  id: PlanType;
  name: string;
  price: number;
  billingPeriod: "month" | "year";
  features: string[];
  isPopular?: boolean;
  cvAnalysisLimit?: number;
  jobSearchLimit?: number;
  jobResultsPerSearch?: number;
  interviewLimit?: number;
  autoApplyLimit?: number;
  cvVersionsLimit?: number;
}

export interface UsageQuota {
  periodStart: string;
  periodEnd: string;
  cvAnalysisUsed: number;
  cvAnalysisLimit: number;
  jobSearchUsed: number;
  jobSearchLimit: number;
  jobResultsPerSearch: number;
  interviewUsed: number;
  interviewLimit: number;
  autoApplyUsed: number;
  autoApplyLimit: number;
  cvVersionsStored: number;
  cvVersionsLimit: number;
}

export interface MemberSubscription {
  currentPlan: PlanType;
  billingPeriod: "month" | "year";
  renewalDate: string;
  isActive: boolean;
  cancelAtPeriodEnd?: boolean;
  usage: UsageQuota;
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
