import { NextRequest } from "next/server";
import {
  deletePhoto,
  getPhotoById,
  updatePhoto,
} from "@/db/queries/photos";
import { applyMockControls } from "@/lib/api/mock-controls";
import {
  internalError,
  jsonError,
  jsonSuccess,
  notFoundError,
  validationError,
} from "@/lib/api/response";
import { photoIdSchema, updatePhotoSchema } from "@/lib/validations/photos";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = photoIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    const photo = await getPhotoById(parsedId.data);
    if (!photo) return notFoundError("Photo not found");
    return jsonSuccess(photo);
  } catch (error) {
    console.error("GET /api/photos/[id] failed:", error);
    return internalError();
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = photoIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("VALIDATION_ERROR", "Invalid JSON body", 400);
    }

    const parsed = updatePhotoSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const photo = await updatePhoto(parsedId.data, parsed.data);
    if (!photo) return notFoundError("Photo not found");
    return jsonSuccess(photo);
  } catch (error) {
    console.error("PATCH /api/photos/[id] failed:", error);
    return internalError();
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = photoIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    const photo = await deletePhoto(parsedId.data);
    if (!photo) return notFoundError("Photo not found");
    return jsonSuccess({ id: photo.id });
  } catch (error) {
    console.error("DELETE /api/photos/[id] failed:", error);
    return internalError();
  }
}
