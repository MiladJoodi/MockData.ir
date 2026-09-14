import { NextRequest } from "next/server";
import {
  deleteComment,
  getCommentById,
  updateComment,
} from "@/db/queries/comments";
import { applyMockControls } from "@/lib/api/mock-controls";
import {
  internalError,
  jsonError,
  jsonSuccess,
  jsonLocalizedSuccess,
  notFoundError,
  validationError,
} from "@/lib/api/response";
import {
  commentIdSchema,
  updateCommentSchema,
} from "@/lib/validations/comments";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = commentIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    const comment = await getCommentById(parsedId.data);
    if (!comment) return notFoundError("Comment not found");
    return jsonLocalizedSuccess(request, "comments", comment);
  } catch (error) {
    console.error("GET /api/comments/[id] failed:", error);
    return internalError();
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = commentIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("VALIDATION_ERROR", "Invalid JSON body", 400);
    }

    const parsed = updateCommentSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const comment = await updateComment(parsedId.data, parsed.data);
    if (!comment) return notFoundError("Comment not found");
    return jsonLocalizedSuccess(request, "comments", comment);
  } catch (error) {
    console.error("PATCH /api/comments/[id] failed:", error);
    return internalError();
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = commentIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    const comment = await deleteComment(parsedId.data);
    if (!comment) return notFoundError("Comment not found");
    return jsonSuccess({ id: comment.id });
  } catch (error) {
    console.error("DELETE /api/comments/[id] failed:", error);
    return internalError();
  }
}
