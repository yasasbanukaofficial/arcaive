import { JobListing } from "@/@types/jobs";
import { apiInstance } from "@/app/api/axios/api";
import { getToken } from "@/utils/auth";
import { useEffect, useRef, useState } from "react";

interface ConnectDetails {
  token: string;
  url: string;
}

export default function useLiveKitToken(posting?: JobListing | null) {
  const [connection, setConnection] = useState<ConnectDetails | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (posting === undefined) return;
    if (hasFetched.current) return;
    hasFetched.current = true;
    const fetchToken = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const response = await apiInstance({
          method: posting ? "POST" : "GET",
          headers: { Authorization: `Bearer ${token}` },
          baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
          url: `api/v1/livekit/token`,
          withCredentials: true,
          ...(posting && { data: posting }),
        });
        hasFetched.current = true; 
        const responseData = response.data.data
        setConnection({token: responseData.token, url: responseData.url});
        setDuration(responseData.duration)
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [posting]);

  return { connection, duration, loading, error };
}
