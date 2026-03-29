import { apiInstance } from "@/app/api/axios/api";

const SUBSCRIPTION_URL = `${process.env.NEXT_PUBLIC_API_URL}/subscriptions`;

export const checkoutAPI = {
  checkout: async (tier: string) => {
    return (
      await apiInstance({
        method: "POST",
        url: `${SUBSCRIPTION_URL}/checkout?tier=${tier}`,
        withCredentials: true,
      })
    ).data;
  },
};
