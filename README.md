# next-client-ip

A tiny helper for **Next.js** that gives you a **React hook** and an **API handler** to read the visitor's IP address.

- ✅ Works with **App Router** (`app/` & `route.ts`)
- ✅ Also works with **Pages Router** (`pages/api/...`)
- ✅ TypeScript ready
- ✅ Multi-platform friendly (reads `x-forwarded-for`, `x-real-ip`, `cf-connecting-ip`)

---

## Install

```bash
npm install next-client-ip
# or
yarn add next-client-ip
# or
pnpm add next-client-ip
```

**Peer deps:** Next.js ≥ 12, React ≥ 17

---

## Quick Start (App Router)

### 1) API route – `app/api/get-ip/route.ts`

```typescript
import { ipHandler } from "next-client-ip";
export { ipHandler as GET };
```

### 2) Client component – `app/page.tsx`

```typescript
"use client";
import { useClientIP } from "next-client-ip";

export default function Home() {
  const { ip, loading, error } = useClientIP(); // defaults to /api/get-ip

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <p>Your IP: {ip}</p>;
}
```

Visit `/api/get-ip` to see:

```json
{ "ip": "203.0.113.45" }
```

On localhost you'll usually see `127.0.0.1` or `::1`. On production platforms (Vercel, Cloudflare, etc.), you'll see the real visitor IP.

---

## Usage with Pages Router

⚠️ **Note:** `ipHandler` is built for the App Router.
If your project still uses the Pages Router, you must create your own API handler.

### 1) API route – `pages/api/get-ip.ts`

```typescript
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check various headers for the real IP
    const forwardedFor = req.headers["x-forwarded-for"] as string;
    const realIP = req.headers["x-real-ip"] as string;
    const cfConnectingIP = req.headers["cf-connecting-ip"] as string;

    let ip = "unknown";

    if (cfConnectingIP) {
      ip = cfConnectingIP;
    } else if (realIP) {
      ip = realIP;
    } else if (forwardedFor) {
      // Take the first IP from the forwarded-for chain
      ip = forwardedFor.split(",")[0].trim();
    }

    res.status(200).json({ ip });
  } catch (error) {
    console.error("Error in IP handler:", error);
    res.status(500).json({ error: "Failed to get IP address" });
  }
}
```

### 2) Client component

```typescript
"use client";
import { useClientIP } from "next-client-ip";

export default function Home() {
  const { ip, loading, error } = useClientIP("/api/get-ip");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <p>Your IP: {ip}</p>;
}
```

---

## API Reference

### Hook API

```typescript
useClientIP(apiPath?: string): { ip: string | null; loading: boolean; error: string | null }
```

- **apiPath:** defaults to `"/api/get-ip"`
- **Returns:** an object with:
  - `ip`: the IP address string once loaded, otherwise `null`
  - `loading`: `true` while fetching, `false` when complete
  - `error`: error message if request failed, otherwise `null`

### Server Handler (App Router)

```typescript
ipHandler(request: Request): Promise<Response>
```

A Fetch-API style handler that intelligently reads IP from multiple headers in priority order:

1. `cf-connecting-ip` (Cloudflare)
2. `x-real-ip` (Nginx/reverse proxies)
3. `x-forwarded-for` (standard proxy header)

Returns JSON:

```json
{ "ip": "<string>" }
```

Or on error:

```json
{ "error": "Failed to get IP address" }
```

---

## Example: Custom Route

### API – `app/api/whoami/route.ts`

```typescript
import { ipHandler } from "next-client-ip";
export { ipHandler as GET };
```

### Client

```typescript
"use client";
import { useClientIP } from "next-client-ip";

export default function WhoAmI() {
  const { ip, loading, error } = useClientIP("/api/whoami");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <p>Your IP: {ip}</p>;
}
```

---

## Troubleshooting

- **Getting `127.0.0.1` in production?** Make sure your deployment platform properly forwards IP headers (`x-forwarded-for`, `x-real-ip`, or `cf-connecting-ip`)
- **Hook returns `null`?** Verify your API route is responding correctly at the specified path
- **Getting "unknown" as IP?** The handler couldn't find any of the expected IP headers - check your proxy/CDN configuration

---

## Contributing

PRs welcome.

**Build:** `npm run lib:build`

**Test** in a Next.js app (App Router recommended)

---

## License

MIT © Mohammad Sepahi Chavoshloo
