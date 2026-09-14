import { NextRequest } from "next/server";
import { createPost, listPosts } from "@/db/queries/posts";
import { applyMockControls, applyParsedMockControls } from "@/lib/api/mock-controls";
import {
  jsonError,
  jsonLocalizedSuccess,
  internalError,
  validationError,
} from "@/lib/api/response";
import {
  createPostSchema,
  postListQuerySchema,
} from "@/lib/validations/posts";

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = postListQuerySchema.safeParse(params);

    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const { delay, status, ...query } = parsed.data;
    const forced = await applyParsedMockControls({ delay, status });
    if (forced) return forced;

    const result = await listPosts(query);
    return jsonLocalizedSuccess(request, "posts", result.items, { pagination: result.pagination });
  } catch (error) {
    console.error("GET /api/posts failed:", error);
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

    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const post = await createPost(parsed.data);
    return jsonLocalizedSuccess(request, "posts", post, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts failed:", error);
    return internalError();
  }
}
