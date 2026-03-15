import { apiInstance } from "@/app/api/axios/api";
import { useEffect, useState } from "react";

interface ConnectDetails {
  token: string;
  url: string;
}

export default function useLiveKitToken(
  roomName: string,
  participantName: string,
) {
  const [connection, setConnection] = useState<ConnectDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomName || !participantName) return;
    const fetchToken = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiInstance({
          method: "GET",
          baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
          url: `api/v1/livekit/token`,
          params: { roomName, participantName },
        });

        setConnection(response.data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [roomName, participantName]);

  return { connection, loading, error };
}
