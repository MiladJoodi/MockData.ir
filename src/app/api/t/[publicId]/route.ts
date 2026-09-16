import { NextRequest } from "next/server";
import { updateTemporaryApiPayload } from "@/db/queries/temporary-apis";
import {
  internalError,
  jsonError,
  jsonSuccess,
  notFoundError,
} from "@/lib/api/response";
import {
  TemporaryExpiredError,
  TemporaryNotFoundError,
  loadActiveTemporaryApi,
} from "@/lib/temporary/load";
import { deepMerge, ensureItemId } from "@/lib/temporary/payload-ops";
import { TEMPORARY_LIMITS } from "@/lib/temporary/limits";
import { validateTemporaryJson } from "@/lib/temporary/validate-json";

type RouteContext = {
  params: Promise<{ publicId: string }>;
};

async function readBody(request: NextRequest): Promise<
  | { ok: true; data: unknown }
  | { ok: false; response: Response }
> {
  const text = await request.text();
  if (!text.trim()) {
    return {
      ok: false,
      response: jsonError("VALIDATION_ERROR", "Request body is required", 400),
    };
  }
  const byteLength = new TextEncoder().encode(text).length;
  if (byteLength > TEMPORARY_LIMITS.maxBytes) {
    return {
      ok: false,
      response: jsonError(
        "TOO_LARGE",
        `Body is too large (max ${Math.round(TEMPORARY_LIMITS.maxBytes / 1024)} KB).`,
        413,
      ),
    };
  }
  try {
    return { ok: true, data: JSON.parse(text) as unknown };
  } catch {
    return {
      ok: false,
      response: jsonError("VALIDATION_ERROR", "Invalid JSON body", 400),
    };
  }
}

function mapLoadError(error: unknown) {
  if (error instanceof TemporaryExpiredError) {
    return jsonError("EXPIRED", "This temporary API has expired.", 410);
  }
  if (error instanceof TemporaryNotFoundError) {
    return notFoundError("Temporary API not found");
  }
  throw error;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { publicId } = await context.params;
    const row = await loadActiveTemporaryApi(publicId);
    return jsonSuccess(row.payload);
  } catch (error) {
    try {
      return mapLoadError(error);
    } catch (err) {
      console.error("GET /api/t/[publicId] failed:", err);
      return internalError();
    }
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { publicId } = await context.params;
    const row = await loadActiveTemporaryApi(publicId);
    const body = await readBody(request);
    if (!body.ok) return body.response;

    const asText = JSON.stringify(body.data);
    const validated = validateTemporaryJson(asText);
    if (!validated.ok) {
      return jsonError(
        "INVALID_JSON",
        "Invalid JSON",
        400,
        { issues: validated.issues },
      );
    }

    // Root type must stay consistent with original shape family
    const wasArray = Array.isArray(row.payload);
    const isArray = Array.isArray(validated.data);
    if (wasArray !== isArray) {
      return jsonError(
        "TYPE_MISMATCH",
        wasArray
          ? "This API stores an array. Send an array body."
          : "This API stores an object. Send an object body.",
        400,
      );
    }

    const updated = await updateTemporaryApiPayload(publicId, validated.data);
    return jsonSuccess(updated?.payload ?? validated.data);
  } catch (error) {
    try {
      return mapLoadError(error);
    } catch (err) {
      console.error("PUT /api/t/[publicId] failed:", err);
      return internalError();
    }
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { publicId } = await context.params;
    const row = await loadActiveTemporaryApi(publicId);
    const body = await readBody(request);
    if (!body.ok) return body.response;

    if (Array.isArray(row.payload)) {
      return jsonError(
        "METHOD_NOT_ALLOWED",
        "PATCH on a collection root is not supported. Use /api/t/{id}/{itemId} or PUT to replace the array.",
        405,
      );
    }

    if (
      !body.data ||
      typeof body.data !== "object" ||
      Array.isArray(body.data)
    ) {
      return jsonError(
        "VALIDATION_ERROR",
        "PATCH body must be a JSON object.",
        400,
      );
    }

    const merged = deepMerge(
      row.payload as Record<string, unknown>,
      body.data as Record<string, unknown>,
    );
    const validated = validateTemporaryJson(JSON.stringify(merged));
    if (!validated.ok) {
      return jsonError(
        "INVALID_JSON",
        "Invalid JSON",
        400,
        { issues: validated.issues },
      );
    }

    const updated = await updateTemporaryApiPayload(publicId, validated.data);
    return jsonSuccess(updated?.payload ?? validated.data);
  } catch (error) {
    try {
      return mapLoadError(error);
    } catch (err) {
      console.error("PATCH /api/t/[publicId] failed:", err);
      return internalError();
    }
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { publicId } = await context.params;
    const row = await loadActiveTemporaryApi(publicId);
    const body = await readBody(request);
    if (!body.ok) return body.response;

    if (Array.isArray(row.payload)) {
      const next = [...row.payload, ensureItemId(body.data)];
      const validated = validateTemporaryJson(JSON.stringify(next));
      if (!validated.ok) {
        return jsonError(
          "INVALID_JSON",
          "Invalid JSON",
          400,
          { issues: validated.issues },
        );
      }
      const updated = await updateTemporaryApiPayload(publicId, validated.data);
      const arr = (updated?.payload ?? validated.data) as unknown[];
      return jsonSuccess(arr[arr.length - 1], { status: 201 });
    }

    if (
      !body.data ||
      typeof body.data !== "object" ||
      Array.isArray(body.data)
    ) {
      return jsonError(
        "VALIDATION_ERROR",
        "POST body must be a JSON object for document APIs.",
        400,
      );
    }

    const merged = deepMerge(
      row.payload as Record<string, unknown>,
      body.data as Record<string, unknown>,
    );
    const validated = validateTemporaryJson(JSON.stringify(merged));
    if (!validated.ok) {
      return jsonError(
        "INVALID_JSON",
        "Invalid JSON",
        400,
        { issues: validated.issues },
      );
    }
    const updated = await updateTemporaryApiPayload(publicId, validated.data);
    return jsonSuccess(updated?.payload ?? validated.data, { status: 201 });
  } catch (error) {
    try {
      return mapLoadError(error);
    } catch (err) {
      console.error("POST /api/t/[publicId] failed:", err);
      return internalError();
    }
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { publicId } = await context.params;
    const row = await loadActiveTemporaryApi(publicId);

    if (Array.isArray(row.payload)) {
      return jsonError(
        "METHOD_NOT_ALLOWED",
        "DELETE on a collection root is not supported. Use /api/t/{id}/{itemId} to remove an item.",
        405,
      );
    }

    const updated = await updateTemporaryApiPayload(publicId, {});
    return jsonSuccess(updated?.payload ?? {});
  } catch (error) {
    try {
      return mapLoadError(error);
    } catch (err) {
      console.error("DELETE /api/t/[publicId] failed:", err);
      return internalError();
    }
  }
}
