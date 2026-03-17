import { apiInstance } from "@/app/api/axios/api";
import { getToken } from "@/utils/auth";
import { useEffect, useState } from "react";

interface ConnectDetails {
  token: string;
  url: string;
}

export default function useLiveKitToken() {
  const [connection, setConnection] = useState<ConnectDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const response = await apiInstance({
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
          url: `api/v1/livekit/token`,
          withCredentials: true,
        });

        console.log(response);

        setConnection(response.data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  return { connection, loading, error };
}
