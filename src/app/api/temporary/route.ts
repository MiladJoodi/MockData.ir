import { NextRequest } from "next/server";
import {
  countActiveTemporaryApisByClient,
  createTemporaryApi,
  listActiveTemporaryApisByClient,
  purgeExpiredTemporaryApisForClient,
} from "@/db/queries/temporary-apis";
import { getClientIp } from "@/lib/api/rate-limit";
import {
  internalError,
  jsonError,
  jsonSuccess,
  validationError,
} from "@/lib/api/response";
import {
  appendTmpClientCookie,
  ensureTmpClientKey,
  temporaryPublicUrl,
} from "@/lib/temporary/client";
import { checkTemporaryCreateLimit } from "@/lib/temporary/create-limit";
import {
  generateManageToken,
  generatePublicId,
  hashManageToken,
} from "@/lib/temporary/ids";
import {
  TEMPORARY_DURATION_MS,
  TEMPORARY_LIMITS,
} from "@/lib/temporary/limits";
import {
  createTemporaryApiSchema,
  validateTemporaryJson,
} from "@/lib/temporary/validate-json";

export async function GET(request: NextRequest) {
  try {
    const { clientKey, setCookie } = ensureTmpClientKey(request);
    await purgeExpiredTemporaryApisForClient(clientKey);
    const items = await listActiveTemporaryApisByClient(clientKey);
    const data = items.map((item) => ({
      publicId: item.publicId,
      name: item.name,
      url: temporaryPublicUrl(request, item.publicId),
      createdAt: item.createdAt.toISOString(),
      expiresAt: item.expiresAt.toISOString(),
    }));
    const response = jsonSuccess(data);
    if (setCookie) appendTmpClientCookie(response, clientKey);
    return response;
  } catch (error) {
    console.error("GET /api/temporary failed:", error);
    return internalError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const createLimit = checkTemporaryCreateLimit(
      ip,
      TEMPORARY_LIMITS.maxCreatesPerIpPerHour,
    );
    if (!createLimit.ok) {
      return jsonError(
        "RATE_LIMITED",
        `Too many temporary APIs created. Try again in ${createLimit.retryAfterSec}s.`,
        429,
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("VALIDATION_ERROR", "Invalid JSON body", 400);
    }

    const parsed = createTemporaryApiSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const { name, json, duration } = parsed.data;
    const validated = validateTemporaryJson(json);
    if (!validated.ok) {
      return jsonError("INVALID_JSON", "Invalid JSON", 400, {
        issues: validated.issues,
        fixedText: validated.fixedText,
      });
    }

    // Require client to accept auto-fix explicitly when fixed
    if (validated.fixed && body && typeof body === "object") {
      const acceptFix = (body as { acceptFix?: unknown }).acceptFix === true;
      if (!acceptFix) {
        return jsonError("JSON_NEEDS_FIX", "JSON needs review", 400, {
          issues: validated.issues,
          fixedText: validated.fixedText,
          fixedData: validated.data,
        });
      }
    }

    const { clientKey, setCookie } = ensureTmpClientKey(request);
    await purgeExpiredTemporaryApisForClient(clientKey);
    const active = await countActiveTemporaryApisByClient(clientKey);
    if (active >= TEMPORARY_LIMITS.maxActivePerClient) {
      return jsonError(
        "LIMIT_REACHED",
        `You have reached the maximum of ${TEMPORARY_LIMITS.maxActivePerClient} active APIs. Delete one or wait for an API to expire.`,
        403,
        { max: TEMPORARY_LIMITS.maxActivePerClient, active },
      );
    }

    const manageToken = generateManageToken();
    let publicId = generatePublicId();
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const expiresAt = new Date(
          Date.now() + TEMPORARY_DURATION_MS[duration],
        );
        const displayName =
          name ??
          (Array.isArray(validated.data)
            ? "Collection API"
            : "Document API");

        const row = await createTemporaryApi({
          publicId,
          manageTokenHash: hashManageToken(manageToken),
          clientKey,
          name: displayName,
          payload: validated.data,
          expiresAt,
        });

        const payload = {
          publicId: row.publicId,
          name: row.name,
          url: temporaryPublicUrl(request, row.publicId),
          createdAt: row.createdAt.toISOString(),
          expiresAt: row.expiresAt.toISOString(),
          manageToken,
        };

        const response = jsonSuccess(payload, { status: 201 });
        if (setCookie) appendTmpClientCookie(response, clientKey);
        return response;
      } catch (err) {
        // Unique violation on public_id — retry with new id
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes("temporary_apis_public_id") || message.includes("unique")) {
          publicId = generatePublicId();
          continue;
        }
        throw err;
      }
    }

    return jsonError("INTERNAL_ERROR", "Could not allocate API id", 500);
  } catch (error) {
    console.error("POST /api/temporary failed:", error);
    return internalError();
  }
}
