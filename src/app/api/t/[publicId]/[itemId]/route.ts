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
import {
  deepMerge,
  ensureItemId,
  findCollectionIndex,
} from "@/lib/temporary/payload-ops";
import { TEMPORARY_LIMITS } from "@/lib/temporary/limits";
import { validateTemporaryJson } from "@/lib/temporary/validate-json";

type RouteContext = {
  params: Promise<{ publicId: string; itemId: string }>;
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

async function loadCollection(publicId: string) {
  const row = await loadActiveTemporaryApi(publicId);
  if (!Array.isArray(row.payload)) {
    return {
      error: jsonError(
        "NOT_A_COLLECTION",
        "This temporary API is a document, not a collection.",
        400,
      ),
    } as const;
  }
  return { row, items: row.payload as unknown[] } as const;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { publicId, itemId } = await context.params;
    const loaded = await loadCollection(publicId);
    if ("error" in loaded) return loaded.error;
    const index = findCollectionIndex(loaded.items, itemId);
    if (index < 0) return notFoundError("Item not found");
    return jsonSuccess(loaded.items[index]);
  } catch (error) {
    try {
      return mapLoadError(error);
    } catch (err) {
      console.error("GET /api/t/[publicId]/[itemId] failed:", err);
      return internalError();
    }
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { publicId, itemId } = await context.params;
    const loaded = await loadCollection(publicId);
    if ("error" in loaded) return loaded.error;
    const body = await readBody(request);
    if (!body.ok) return body.response;

    const index = findCollectionIndex(loaded.items, itemId);
    if (index < 0) return notFoundError("Item not found");

    let nextItem = ensureItemId(body.data);
    const existing = loaded.items[index];
    if (
      existing &&
      typeof existing === "object" &&
      !Array.isArray(existing) &&
      (existing as { id?: unknown }).id != null
    ) {
      nextItem = { ...nextItem, id: (existing as { id: unknown }).id };
    }

    const next = [...loaded.items];
    next[index] = nextItem;
    const validated = validateTemporaryJson(JSON.stringify(next));
    if (!validated.ok) {
      return jsonError(
        "INVALID_JSON",
        "Invalid JSON",
        400,
        { issues: validated.issues },
      );
    }
    await updateTemporaryApiPayload(publicId, validated.data);
    return jsonSuccess(nextItem);
  } catch (error) {
    try {
      return mapLoadError(error);
    } catch (err) {
      console.error("PUT /api/t/[publicId]/[itemId] failed:", err);
      return internalError();
    }
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { publicId, itemId } = await context.params;
    const loaded = await loadCollection(publicId);
    if ("error" in loaded) return loaded.error;
    const body = await readBody(request);
    if (!body.ok) return body.response;

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

    const index = findCollectionIndex(loaded.items, itemId);
    if (index < 0) return notFoundError("Item not found");

    const existing = loaded.items[index];
    const base =
      existing && typeof existing === "object" && !Array.isArray(existing)
        ? (existing as Record<string, unknown>)
        : { value: existing };
    const merged = deepMerge(base, body.data as Record<string, unknown>);
    if (base.id != null) merged.id = base.id;

    const next = [...loaded.items];
    next[index] = merged;
    const validated = validateTemporaryJson(JSON.stringify(next));
    if (!validated.ok) {
      return jsonError(
        "INVALID_JSON",
        "Invalid JSON",
        400,
        { issues: validated.issues },
      );
    }
    await updateTemporaryApiPayload(publicId, validated.data);
    return jsonSuccess(merged);
  } catch (error) {
    try {
      return mapLoadError(error);
    } catch (err) {
      console.error("PATCH /api/t/[publicId]/[itemId] failed:", err);
      return internalError();
    }
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { publicId, itemId } = await context.params;
    const loaded = await loadCollection(publicId);
    if ("error" in loaded) return loaded.error;

    const index = findCollectionIndex(loaded.items, itemId);
    if (index < 0) return notFoundError("Item not found");

    const removed = loaded.items[index];
    const next = loaded.items.filter((_, i) => i !== index);
    await updateTemporaryApiPayload(publicId, next);
    return jsonSuccess(removed);
  } catch (error) {
    try {
      return mapLoadError(error);
    } catch (err) {
      console.error("DELETE /api/t/[publicId]/[itemId] failed:", err);
      return internalError();
    }
  }
}
