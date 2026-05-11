import axios from 'axios';

export const apiInstance = axios.create({baseURL: process.env.NEXT_PUBLIC_API_URL});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes("/auth/refresh")) {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await apiInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {}, { withCredentials: true });
        const newAccessToken = response.data?.data?.accessToken;

        if (newAccessToken && typeof document !== "undefined") {
          const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          document.cookie = `access_token=${newAccessToken}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure`;
        }

        isRefreshing = false;
        processQueue(null);
        return apiInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 429) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('arcaive-quota-exceeded', {
          detail: { message: error.response.data?.message }
        }));
      }
    }
    return Promise.reject(error);
  }
);