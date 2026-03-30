import { apiInstance } from "@/app/api/axios/api";
import { getToken } from "@/utils/auth";

const SUBSCRIPTION_URL = `${process.env.NEXT_PUBLIC_API_URL}/subscriptions`;
const MEMBER_URL = `${process.env.NEXT_PUBLIC_API_URL}/members`;

export interface SubscriptionResponse {
  id: string;
  memberId: string;
  tier: string;
  status: string;
  billingCycle: string;
  priceAmount: number;
  currency: string;
  startedAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt: string | null;
  paymentProvider: string;
  externalSubscriptionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberResponse {
  id: string;
  subscriptionId: string | null;
}

export const subscriptionAPI = {
  getMemberSubscription: async (): Promise<SubscriptionResponse | null> => {
    const token = await getToken();
    const memberResponse = await apiInstance({
      baseURL: `${MEMBER_URL}/me`,
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    
    const memberData: MemberResponse = memberResponse.data.data;
    
    if (!memberData.subscriptionId) {
      return null;
    }
    
    const subscriptionResponse = await apiInstance({
      baseURL: `${SUBSCRIPTION_URL}/${memberData.subscriptionId}`,
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    
    return subscriptionResponse.data.data;
  },
};
