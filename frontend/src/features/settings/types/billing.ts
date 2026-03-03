export type PlanFeature = {
  name: string;
  active: boolean;
  strategistOnly?: boolean;
};

export type Invoice = {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "pending";
};

export type BillingData = {
  currentPlan: string;
  features: PlanFeature[];
  invoices: Invoice[];
  paymentMethod: {
    last4: string;
    expiry: string;
  };
};
