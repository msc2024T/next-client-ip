export async function ipHandler(request: Request): Promise<Response> {
  try {
    // Check various headers for the real IP
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIP = request.headers.get("x-real-ip");
    const cfConnectingIP = request.headers.get("cf-connecting-ip");

    let ip = "unknown";

    if (cfConnectingIP) {
      ip = cfConnectingIP;
    } else if (realIP) {
      ip = realIP;
    } else if (forwardedFor) {
      // Take the first IP from the forwarded-for chain
      ip = forwardedFor.split(",")[0].trim();
    }

    return Response.json({ ip });
  } catch (error) {
    console.error("Error in IP handler:", error);
    return Response.json(
      { error: "Failed to get IP address" },
      { status: 500 }
    );
  }
}
