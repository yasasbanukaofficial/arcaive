import axios from 'axios';

export const apiInstance = axios.create({baseURL: process.env.NEXT_PUBLIC_API_URL});

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const redirectToHeader = error.response.headers?.['x-redirect-to'];
      const redirectToBody = error.response.data?.data?.redirectTo;
      const redirectTo = redirectToHeader || redirectToBody;
      if (redirectTo) {
        window.location.href = redirectTo;
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