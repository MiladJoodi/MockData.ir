import { NextRequest } from "next/server";
import {
  deletePost,
  getPostById,
  updatePost,
} from "@/db/queries/posts";
import { applyMockControls } from "@/lib/api/mock-controls";
import {
  internalError,
  jsonError,
  jsonSuccess,
  notFoundError,
  validationError,
} from "@/lib/api/response";
import { postIdSchema, updatePostSchema } from "@/lib/validations/posts";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = postIdSchema.safeParse(id);
    if (!parsedId.success) {
      return validationError(parsedId.error);
    }

    const post = await getPostById(parsedId.data);
    if (!post) {
      return notFoundError("Post not found");
    }

    return jsonSuccess(post);
  } catch (error) {
    console.error("GET /api/posts/[id] failed:", error);
    return internalError();
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = postIdSchema.safeParse(id);
    if (!parsedId.success) {
      return validationError(parsedId.error);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("VALIDATION_ERROR", "Invalid JSON body", 400);
    }

    const parsed = updatePostSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const post = await updatePost(parsedId.data, parsed.data);
    if (!post) {
      return notFoundError("Post not found");
    }

    return jsonSuccess(post);
  } catch (error) {
    console.error("PATCH /api/posts/[id] failed:", error);
    return internalError();
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = postIdSchema.safeParse(id);
    if (!parsedId.success) {
      return validationError(parsedId.error);
    }

    const post = await deletePost(parsedId.data);
    if (!post) {
      return notFoundError("Post not found");
    }

    return jsonSuccess({ id: post.id });
  } catch (error) {
    console.error("DELETE /api/posts/[id] failed:", error);
    return internalError();
  }
}
