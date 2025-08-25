"use client";

import { useClientIP } from "next-client-ip";
import { useEffect } from "react";

export default function Home() {
  // Use internal API endpoint
  const { ip, loading, error } = useClientIP("/api/get-ip");

  // Alternative: Use external service (uncomment to test)
  // const { ip, loading, error } = useClientIP("https://api.ipify.org?format=json");

  useEffect(() => {
    if (ip) {
      console.log("Client IP Address:", ip);
    }
  }, [ip]);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Your IP Address</h1>

        {loading && (
          <div className="text-lg text-gray-600">
            <div className="animate-pulse">Loading...</div>
          </div>
        )}

        {error && (
          <div className="text-lg text-red-600 mb-4">
            <div className="bg-red-50 border border-red-200 rounded p-3">
              Error: {error}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Make sure your API route is set up at `/api/get-ip/route.ts`
            </div>
          </div>
        )}

        {ip && !loading && (
          <div className="space-y-2">
            <div className="text-lg font-mono bg-gray-100 px-4 py-2 rounded border">
              {ip}
            </div>
            {(ip.includes("::1") ||
              ip.includes("127.0.0.1") ||
              ip.includes("localhost")) && (
              <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                💡 This is localhost - deploy to see your real public IP
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500">
          <p>Running in development mode</p>
        </div>
      </div>
    </div>
  );
}
