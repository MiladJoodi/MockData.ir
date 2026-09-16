import { NextRequest } from "next/server";
import { createComment, listComments } from "@/db/queries/comments";
import { applyMockControls, applyParsedMockControls } from "@/lib/api/mock-controls";
import {
  internalError,
  jsonError,
  jsonLocalizedSuccess,
  validationError,
} from "@/lib/api/response";
import { applyLocalizedCreate } from "@/lib/api/locale-write";
import {
  commentListQuerySchema,
  createCommentSchema,
} from "@/lib/validations/comments";

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = commentListQuerySchema.safeParse(params);
    if (!parsed.success) return validationError(parsed.error);

    const { delay, status, ...query } = parsed.data;
    const forced = await applyParsedMockControls({ delay, status });
    if (forced) return forced;

    const result = await listComments(query);
    return jsonLocalizedSuccess(request, "comments", result.items, { pagination: result.pagination });
  } catch (error) {
    console.error("GET /api/comments failed:", error);
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

    const parsed = createCommentSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const comment = await createComment(parsed.data);
    applyLocalizedCreate(
      request,
      "comments",
      comment.id,
      parsed.data as Record<string, unknown>,
    );
    return jsonLocalizedSuccess(request, "comments", comment, { status: 201 });
  } catch (error) {
    console.error("POST /api/comments failed:", error);
    return internalError();
  }
}
