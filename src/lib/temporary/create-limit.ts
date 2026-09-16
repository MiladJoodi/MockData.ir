/**
 * In-memory create throttle per IP (separate from global API rate limit).
 */

type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 60 * 60 * 1000;
const buckets = new Map<string, Bucket>();
let lastCleanup = Date.now();

function cleanup(now: number) {
  if (now - lastCleanup < WINDOW_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function checkTemporaryCreateLimit(
  ip: string,
  limit: number,
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  cleanup(now);
  const key = `tmp-create:${ip}`;
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  return { ok: true, retryAfterSec: 0 };
}
