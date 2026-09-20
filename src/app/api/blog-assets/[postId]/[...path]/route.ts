import { promises as fs } from "node:fs";

import {
  blogAssetContentType,
  isSafeBlogPostId,
  resolveBlogAssetFilePath,
} from "@/lib/blog/assets";
import { BlogContentError } from "@/lib/blog/errors";
import { listPublishedPostIds } from "@/lib/blog/posts";

type RouteParams = {
  params: Promise<{ postId: string; path: string[] }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { postId, path: pathSegments } = await params;

  if (!isSafeBlogPostId(postId) || !pathSegments?.length) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const publishedIds = await listPublishedPostIds();
    if (!publishedIds.includes(postId)) {
      return new Response("Not found", { status: 404 });
    }

    const relativePath = pathSegments.map(decodeURIComponent).join("/");
    const absolute = resolveBlogAssetFilePath(postId, relativePath);
    const data = await fs.readFile(absolute);

    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": blogAssetContentType(absolute),
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    if (error instanceof BlogContentError) {
      return new Response("Not found", { status: 404 });
    }
    const code =
      error && typeof error === "object" && "code" in error
        ? (error as { code?: string }).code
        : undefined;
    if (code === "ENOENT") {
      return new Response("Not found", { status: 404 });
    }
    throw error;
  }
}
