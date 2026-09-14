import type { NextRequest, NextResponse } from "next/server";
import { jsonError, validationError } from "@/lib/api/response";
import { sleep } from "@/lib/sleep";
import {
  parseMockControls,
  type MockControls,
} from "@/lib/validations/mock-controls";

export function forcedStatusError(status: number) {
  return jsonError(
    "FORCED_ERROR",
    `Simulated HTTP ${status} via ?status=`,
    status,
  );
}

/** Apply delay / forced status from already-parsed controls. */
export async function applyParsedMockControls(
  controls: MockControls,
): Promise<NextResponse | null> {
  if (controls.delay) await sleep(controls.delay);
  if (controls.status) return forcedStatusError(controls.status);
  return null;
}

/**
 * Read `delay` + `status` from the request URL.
 * Returns a validation error response, a forced error, or null to continue.
 */
export async function applyMockControls(
  request: NextRequest,
): Promise<NextResponse | null> {
  const parsed = parseMockControls(request.nextUrl.searchParams);
  if (!parsed.ok) return validationError(parsed.error);
  return applyParsedMockControls(parsed.data);
}
