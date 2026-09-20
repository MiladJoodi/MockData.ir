import path from "node:path";

import { BLOG_CONTENT_DIR } from "@/lib/blog/config";
import { BlogContentError } from "@/lib/blog/errors";

const POST_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

export function isSafeBlogPostId(postId: string): boolean {
  return POST_ID_RE.test(postId) && postId.length <= 120;
}

/** Public URL for a file living under `content/blog/<postId>/`. */
export function blogAssetUrl(postId: string, relativePath: string): string {
  const segments = normalizeRelativeAssetPath(relativePath).split("/");
  return `/api/blog-assets/${encodeURIComponent(postId)}/${segments
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

/**
 * Resolve an MDX `img`/`a` path that may be relative to the post folder.
 * Absolute site paths and http(s)/data/blob URLs are left unchanged.
 */
export function resolveBlogMediaSrc(
  postId: string,
  src: string | undefined,
): string | undefined {
  if (!src) return src;
  if (/^(https?:|data:|blob:)/i.test(src) || src.startsWith("//")) {
    return src;
  }
  if (src.startsWith("/")) {
    return src;
  }
  return blogAssetUrl(postId, src);
}

export function normalizeRelativeAssetPath(relativePath: string): string {
  const cleaned = relativePath
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .replace(/^\/+/, "");

  if (!cleaned || cleaned.includes("\0")) {
    throw new BlogContentError(`Invalid blog asset path: ${relativePath}`);
  }

  const segments = cleaned.split("/").filter(Boolean);
  if (
    segments.length === 0 ||
    segments.some((segment) => segment === "." || segment === "..")
  ) {
    throw new BlogContentError(`Unsafe blog asset path: ${relativePath}`);
  }

  return segments.join("/");
}

/**
 * Resolve a post-folder asset to an absolute filesystem path.
 * Rejects path traversal and serving `.mdx` sources.
 */
export function resolveBlogAssetFilePath(
  postId: string,
  relativePath: string,
): string {
  if (!isSafeBlogPostId(postId)) {
    throw new BlogContentError(`Invalid blog post id: ${postId}`, { postId });
  }

  const normalized = normalizeRelativeAssetPath(relativePath);
  const lower = normalized.toLowerCase();
  if (lower.endsWith(".mdx") || lower.endsWith(".md")) {
    throw new BlogContentError(
      `Refusing to serve MDX/Markdown as a blog asset: ${normalized}`,
      { postId },
    );
  }

  const postRoot = path.resolve(
    process.cwd(),
    BLOG_CONTENT_DIR,
    postId,
  );
  const absolute = path.resolve(postRoot, normalized);

  if (absolute !== postRoot && !absolute.startsWith(postRoot + path.sep)) {
    throw new BlogContentError(`Path traversal blocked for blog asset`, {
      postId,
      filePath: absolute,
    });
  }

  return absolute;
}

const EXT_CONTENT_TYPE: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
};

export function blogAssetContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return EXT_CONTENT_TYPE[ext] ?? "application/octet-stream";
}
