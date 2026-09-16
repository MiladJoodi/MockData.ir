import { NextRequest } from "next/server";
import { db } from "@/db";
import { runSeed } from "@/db/seed";
import { purgeExpiredTemporaryApis } from "@/db/queries/temporary-apis";
import { jsonError, jsonSuccess, internalError } from "@/lib/api/response";

export const maxDuration = 60;

/**
 * GET /api/cron/reset — Vercel Cron entrypoint.
 * Secured by CRON_SECRET (Vercel sends Authorization: Bearer <CRON_SECRET>).
 */
export async function GET(request: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      return jsonError(
        "NOT_CONFIGURED",
        "CRON_SECRET is not set on the server",
        503,
      );
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return jsonError("UNAUTHORIZED", "Invalid or missing cron secret", 401);
    }

    const purgedTemporary = await purgeExpiredTemporaryApis();
    const counts = await runSeed(db);
    return jsonSuccess({
      reset: true,
      source: "cron",
      purgedTemporary,
      ...counts,
    });
  } catch (error) {
    console.error("GET /api/cron/reset failed:", error);
    return internalError();
  }
}
