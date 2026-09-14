import { z } from "zod";

/** Optional artificial latency for loading-state demos (ms). */
export const delaySchema = z.coerce.number().int().min(0).max(5000).optional();

/**
 * Force an error HTTP status for frontend error-state demos.
 * Only 400–599 are allowed.
 */
export const statusSchema = z.coerce
  .number()
  .int()
  .min(400)
  .max(599)
  .optional();

export type MockControls = {
  delay?: number;
  status?: number;
};

export function parseMockControls(
  searchParams: URLSearchParams,
): { ok: true; data: MockControls } | { ok: false; error: z.ZodError } {
  const delayRaw = searchParams.get("delay");
  const statusRaw = searchParams.get("status");

  const parsed = z
    .object({
      delay: delaySchema,
      status: statusSchema,
    })
    .safeParse({
      delay: delayRaw === null || delayRaw === "" ? undefined : delayRaw,
      status: statusRaw === null || statusRaw === "" ? undefined : statusRaw,
    });

  if (!parsed.success) {
    return { ok: false, error: parsed.error };
  }

  return { ok: true, data: parsed.data };
}

/** @deprecated Prefer parseMockControls */
export function parseDelay(
  searchParams: URLSearchParams,
): number | undefined {
  const result = parseMockControls(searchParams);
  return result.ok ? result.data.delay : undefined;
}
