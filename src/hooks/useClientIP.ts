"use client";
import { useEffect, useState } from "react";

// Hook for fetching client IP
export function useClientIP(apiPath: string = "/api/get-ip") {
  const [ip, setIp] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIP() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(apiPath);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        // Handle different API response formats
        let clientIP = data.ip || data.query || data;

        // Handle localhost cases
        if (clientIP === "::1" || clientIP === "127.0.0.1") {
          console.log(
            "Detected localhost - this is expected during development"
          );
          clientIP = `${clientIP} (localhost)`;
        }

        setIp(clientIP);
      } catch (error) {
        console.error("Error fetching IP address:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch IP");

        // Fallback: try to detect if we're on localhost
        if (typeof window !== "undefined") {
          const isLocalhost =
            window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1" ||
            window.location.hostname === "::1";
          if (isLocalhost) {
            setIp("localhost (development)");
            setError(null);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    fetchIP();
  }, [apiPath]);

  return { ip, loading, error };
}
