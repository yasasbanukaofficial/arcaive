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
        // Correct the URL to use API_URL consistently
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
        await axios.post(`${apiUrl}/auth/refresh`, {}, { withCredentials: true });
        
        // Since we are using HttpOnly cookies, we don't need to manually update document.cookie.
        // The browser handles the Set-Cookie headers from the /refresh response.

        isRefreshing = false;
        processQueue(null);
        return apiInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        
        // Detailed logging for diagnostics
        console.warn("Silent refresh failed - session likely expired. Redirecting to login.");
        
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