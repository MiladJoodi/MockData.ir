import { NextRequest } from "next/server";
import { db } from "@/db";
import { runSeed } from "@/db/seed";
import { applyMockControls } from "@/lib/api/mock-controls";
import { jsonError, jsonSuccess, internalError } from "@/lib/api/response";

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const header =
    request.headers.get("x-admin-key") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  return Boolean(header && header === secret);
}

/** POST /api/admin/reset — wipe DB and re-seed (requires ADMIN_SECRET). */
export async function POST(request: NextRequest) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    if (!process.env.ADMIN_SECRET) {
      return jsonError(
        "NOT_CONFIGURED",
        "ADMIN_SECRET is not set on the server",
        503,
      );
    }

    if (!isAuthorized(request)) {
      return jsonError("UNAUTHORIZED", "Invalid or missing admin key", 401);
    }

    const counts = await runSeed(db);
    return jsonSuccess({
      reset: true,
      ...counts,
    });
  } catch (error) {
    console.error("POST /api/admin/reset failed:", error);
    return internalError();
  }
}
