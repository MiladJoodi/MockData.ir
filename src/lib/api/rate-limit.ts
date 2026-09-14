/** Simple in-memory IP rate limiter (per process). Fine for a mock API. */

export type RateLimitResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  /** Unix seconds when the window resets */
  reset: number;
  retryAfter: number;
};

const WINDOW_MS = 60_000;
const LIMIT = 60;

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

/** Periodic cleanup so the Map does not grow forever. */
let lastCleanup = Date.now();

function cleanup(now: number) {
  if (now - lastCleanup < WINDOW_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  cleanup(now);

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(key, bucket);
  }

  bucket.count += 1;
  const remaining = Math.max(0, LIMIT - bucket.count);
  const reset = Math.ceil(bucket.resetAt / 1000);
  const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

  return {
    ok: bucket.count <= LIMIT,
    limit: LIMIT,
    remaining,
    reset,
    retryAfter,
  };
}

export function rateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.reset),
    ...(result.ok ? {} : { "Retry-After": String(result.retryAfter) }),
  };
}

export const RATE_LIMIT = { limit: LIMIT, windowMs: WINDOW_MS } as const;
