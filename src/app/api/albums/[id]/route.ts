import { NextRequest } from "next/server";
import {
  deleteAlbum,
  getAlbumById,
  updateAlbum,
} from "@/db/queries/albums";
import { applyMockControls } from "@/lib/api/mock-controls";
import {
  applyLocalizedDelete,
  applyLocalizedPatch,
} from "@/lib/api/locale-write";
import {
  internalError,
  jsonError,
  jsonSuccess,
  jsonLocalizedSuccess,
  notFoundError,
  validationError,
} from "@/lib/api/response";
import { albumIdSchema, updateAlbumSchema } from "@/lib/validations/albums";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = albumIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    const album = await getAlbumById(parsedId.data);
    if (!album) return notFoundError("Album not found");
    return jsonLocalizedSuccess(request, "albums", album);
  } catch (error) {
    console.error("GET /api/albums/[id] failed:", error);
    return internalError();
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = albumIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("VALIDATION_ERROR", "Invalid JSON body", 400);
    }

    const parsed = updateAlbumSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const album = await applyLocalizedPatch(
      request,
      "albums",
      parsedId.data,
      parsed.data,
      updateAlbum,
      getAlbumById,
    );
    if (!album) return notFoundError("Album not found");
    return jsonLocalizedSuccess(request, "albums", album);
  } catch (error) {
    console.error("PATCH /api/albums/[id] failed:", error);
    return internalError();
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = albumIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    const album = await deleteAlbum(parsedId.data);
    if (!album) return notFoundError("Album not found");
    applyLocalizedDelete("albums", album.id);
    return jsonSuccess({ id: album.id });
  } catch (error) {
    console.error("DELETE /api/albums/[id] failed:", error);
    return internalError();
  }
}
