import { NextRequest } from "next/server";
import { createAlbum, listAlbums } from "@/db/queries/albums";
import { applyMockControls, applyParsedMockControls } from "@/lib/api/mock-controls";
import {
  internalError,
  jsonError,
  jsonLocalizedSuccess,
  validationError,
} from "@/lib/api/response";
import {
  albumListQuerySchema,
  createAlbumSchema,
} from "@/lib/validations/albums";

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = albumListQuerySchema.safeParse(params);
    if (!parsed.success) return validationError(parsed.error);

    const { delay, status, ...query } = parsed.data;
    const forced = await applyParsedMockControls({ delay, status });
    if (forced) return forced;

    const result = await listAlbums(query);
    return jsonLocalizedSuccess(request, "albums", result.items, { pagination: result.pagination });
  } catch (error) {
    console.error("GET /api/albums failed:", error);
    return internalError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("VALIDATION_ERROR", "Invalid JSON body", 400);
    }

    const parsed = createAlbumSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const album = await createAlbum(parsed.data);
    return jsonLocalizedSuccess(request, "albums", album, { status: 201 });
  } catch (error) {
    console.error("POST /api/albums failed:", error);
    return internalError();
  }
}
