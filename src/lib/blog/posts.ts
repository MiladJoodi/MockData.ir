import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";

import { isBlogCategory, type BlogCategory } from "@/lib/blog/categories";
import { BLOG_CONTENT_DIR, BLOG_PAGE_SIZE } from "@/lib/blog/config";
import { BlogContentError } from "@/lib/blog/errors";
import { parseBlogMdxSource } from "@/lib/blog/parse-mdx";
import { estimateReadingTimeMinutes } from "@/lib/blog/reading-time";
import type { UiLocale } from "@/lib/i18n/constants";
import type {
  BlogPaginatedResult,
  BlogPost,
  BlogPostLocalized,
  BlogPostMeta,
} from "@/lib/blog/types";

const REQUIRED_LOCALES: readonly UiLocale[] = ["en", "fa"];

type LoadedLocaleVersion = {
  title: string;
  description: string;
  body: string;
  readingTimeMinutes: number;
};

type LoadedPost = {
  id: string;
  category: BlogCategory;
  date: string;
  published: boolean;
  locales: Record<UiLocale, LoadedLocaleVersion>;
};

function contentRoot(): string {
  return path.join(process.cwd(), BLOG_CONTENT_DIR);
}

function postDir(postId: string): string {
  return path.join(contentRoot(), postId);
}

function localeFilePath(postId: string, locale: UiLocale): string {
  return path.join(postDir(postId), `${locale}.mdx`);
}

function assertSharedFrontmatter(
  postId: string,
  versions: Record<UiLocale, ReturnType<typeof parseBlogMdxSource>>,
): void {
  const en = versions.en.frontmatter;
  const fa = versions.fa.frontmatter;

  const sharedKeys = ["id", "category", "date", "published"] as const;
  for (const key of sharedKeys) {
    if (en[key] !== fa[key]) {
      throw new BlogContentError(
        `Frontmatter "${key}" mismatch between en.mdx (${String(en[key])}) and fa.mdx (${String(fa[key])}) for post "${postId}"`,
        { postId },
      );
    }
  }
}

async function loadPostFolder(postId: string): Promise<LoadedPost> {
  const versions = {} as Record<
    UiLocale,
    ReturnType<typeof parseBlogMdxSource>
  >;

  for (const locale of REQUIRED_LOCALES) {
    const filePath = localeFilePath(postId, locale);
    let source: string;
    try {
      source = await fs.readFile(filePath, "utf8");
    } catch (error) {
      const code =
        error && typeof error === "object" && "code" in error
          ? (error as { code?: string }).code
          : undefined;
      if (code === "ENOENT") {
        throw new BlogContentError(
          `Missing required language file ${locale}.mdx for post "${postId}" (expected ${filePath})`,
          { postId, locale, filePath },
        );
      }
      throw error;
    }

    versions[locale] = parseBlogMdxSource(source, {
      postId,
      locale,
      filePath,
    });
  }

  assertSharedFrontmatter(postId, versions);

  const { category, date, published } = versions.en.frontmatter;

  return {
    id: postId,
    category,
    date,
    published,
    locales: {
      en: {
        title: versions.en.frontmatter.title,
        description: versions.en.frontmatter.description,
        body: versions.en.body,
        readingTimeMinutes: estimateReadingTimeMinutes(versions.en.body),
      },
      fa: {
        title: versions.fa.frontmatter.title,
        description: versions.fa.frontmatter.description,
        body: versions.fa.body,
        readingTimeMinutes: estimateReadingTimeMinutes(versions.fa.body),
      },
    },
  };
}

/**
 * Discover every post folder under `content/blog`, parse both locales,
 * and validate frontmatter. Cached per request via React `cache`.
 */
const loadAllPosts = cache(async (): Promise<LoadedPost[]> => {
  const root = contentRoot();

  let entries;
  try {
    entries = await fs.readdir(root, { withFileTypes: true });
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? (error as { code?: string }).code
        : undefined;
    if (code === "ENOENT") {
      throw new BlogContentError(
        `Blog content directory not found: ${root}`,
        { filePath: root },
      );
    }
    throw error;
  }

  const postIds = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const posts = await Promise.all(postIds.map((id) => loadPostFolder(id)));
  return posts;
});

function sortNewestFirst<T extends { date: string; id: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return a.id.localeCompare(b.id);
  });
}

function toMeta(post: LoadedPost): BlogPostMeta {
  return {
    id: post.id,
    category: post.category,
    date: post.date,
    published: post.published,
    locales: [...REQUIRED_LOCALES],
  };
}

function toLocalized(post: LoadedPost, locale: UiLocale): BlogPostLocalized {
  const version = post.locales[locale];
  return {
    ...toMeta(post),
    locale,
    title: version.title,
    description: version.description,
    readingTimeMinutes: version.readingTimeMinutes,
  };
}

function toPost(post: LoadedPost, locale: UiLocale): BlogPost {
  const version = post.locales[locale];
  return {
    ...toLocalized(post, locale),
    body: version.body,
  };
}

async function listPublishedLoaded(): Promise<LoadedPost[]> {
  const all = await loadAllPosts();
  return sortNewestFirst(all.filter((post) => post.published));
}

/** All posts on disk (including unpublished). Prefer public helpers below. */
export async function listAllPostMeta(): Promise<BlogPostMeta[]> {
  const all = await loadAllPosts();
  return sortNewestFirst(all).map(toMeta);
}

/** Localized listing fields for both UI locales (chrome can switch without reload). */
export type BlogPostListItem = {
  id: string;
  category: BlogCategory;
  date: string;
  en: {
    title: string;
    description: string;
    readingTimeMinutes: number;
  };
  fa: {
    title: string;
    description: string;
    readingTimeMinutes: number;
  };
};

function toListItem(post: LoadedPost): BlogPostListItem {
  return {
    id: post.id,
    category: post.category,
    date: post.date,
    en: {
      title: post.locales.en.title,
      description: post.locales.en.description,
      readingTimeMinutes: post.locales.en.readingTimeMinutes,
    },
    fa: {
      title: post.locales.fa.title,
      description: post.locales.fa.description,
      readingTimeMinutes: post.locales.fa.readingTimeMinutes,
    },
  };
}

/** Published posts for listing UIs, newest first, with EN+FA fields. */
export async function listPublishedPostListItems(): Promise<BlogPostListItem[]> {
  const published = await listPublishedLoaded();
  return published.map(toListItem);
}

/** Category-filtered published posts for listing UIs. */
export async function listPublishedPostListItemsByCategory(
  category: BlogCategory,
): Promise<BlogPostListItem[]> {
  if (!isBlogCategory(category)) {
    throw new BlogContentError(`Unknown blog category: ${category}`);
  }
  const published = await listPublishedLoaded();
  return published.filter((post) => post.category === category).map(toListItem);
}

/** Published posts only, newest date first, localized for listings. */
export async function listPublishedPosts(
  locale: UiLocale,
): Promise<BlogPostLocalized[]> {
  const published = await listPublishedLoaded();
  return published.map((post) => toLocalized(post, locale));
}

/** Published posts in a category, newest first. */
export async function listPublishedPostsByCategory(
  locale: UiLocale,
  category: BlogCategory,
): Promise<BlogPostLocalized[]> {
  if (!isBlogCategory(category)) {
    throw new BlogContentError(`Unknown blog category: ${category}`);
  }
  const published = await listPublishedLoaded();
  return published
    .filter((post) => post.category === category)
    .map((post) => toLocalized(post, locale));
}

/** Published post ids (for generateStaticParams / sitemap). */
export async function listPublishedPostIds(): Promise<string[]> {
  const published = await listPublishedLoaded();
  return published.map((post) => post.id);
}

/**
 * Load one published post with body for the given locale.
 * Returns `null` if the id is unknown or unpublished.
 */
export async function getPublishedPost(
  id: string,
  locale: UiLocale,
): Promise<BlogPost | null> {
  const all = await loadAllPosts();
  const post = all.find((item) => item.id === id);
  if (!post || !post.published) return null;
  return toPost(post, locale);
}

/**
 * Same-category published posts, excluding `id`, newest first (max `limit`).
 */
export async function getRelatedPublishedPosts(
  id: string,
  locale: UiLocale,
  limit = 3,
): Promise<BlogPostLocalized[]> {
  const items = await getRelatedPublishedPostListItems(id, limit);
  return items.map((item) => ({
    id: item.id,
    category: item.category,
    date: item.date,
    published: true,
    locales: [...REQUIRED_LOCALES],
    locale,
    title: item[locale].title,
    description: item[locale].description,
    readingTimeMinutes: item[locale].readingTimeMinutes,
  }));
}

/** Related posts as dual-locale list items for article chrome. */
export async function getRelatedPublishedPostListItems(
  id: string,
  limit = 3,
): Promise<BlogPostListItem[]> {
  const published = await listPublishedLoaded();
  const current = published.find((post) => post.id === id);
  if (!current) return [];

  return published
    .filter((post) => post.id !== id && post.category === current.category)
    .slice(0, Math.max(0, limit))
    .map(toListItem);
}

/**
 * Adjacent posts in the global published stream (newest first).
 * `previous` = older (next in list); `next` = newer (earlier in list).
 */
export async function getAdjacentPublishedPosts(
  id: string,
  locale: UiLocale,
): Promise<{
  previous: BlogPostLocalized | null;
  next: BlogPostLocalized | null;
}> {
  const { previous, next } = await getAdjacentPublishedPostListItems(id);
  const toLocalizedItem = (
    item: BlogPostListItem | null,
  ): BlogPostLocalized | null => {
    if (!item) return null;
    return {
      id: item.id,
      category: item.category,
      date: item.date,
      published: true,
      locales: [...REQUIRED_LOCALES],
      locale,
      title: item[locale].title,
      description: item[locale].description,
      readingTimeMinutes: item[locale].readingTimeMinutes,
    };
  };
  return {
    previous: toLocalizedItem(previous),
    next: toLocalizedItem(next),
  };
}

/** Adjacent published posts as dual-locale list items. */
export async function getAdjacentPublishedPostListItems(id: string): Promise<{
  previous: BlogPostListItem | null;
  next: BlogPostListItem | null;
}> {
  const published = await listPublishedLoaded();
  const index = published.findIndex((post) => post.id === id);
  if (index === -1) {
    return { previous: null, next: null };
  }

  const newer = index > 0 ? published[index - 1] : null;
  const older = index < published.length - 1 ? published[index + 1] : null;

  return {
    previous: older ? toListItem(older) : null,
    next: newer ? toListItem(newer) : null,
  };
}

/**
 * Slice a post list into pages. Uses `BLOG_PAGE_SIZE` when `pageSize` is omitted.
 * Empty lists report `totalPages: 1` so page 1 can render an empty state.
 */
export function paginatePosts<T>(
  posts: readonly T[],
  page: number,
  pageSize: number = BLOG_PAGE_SIZE,
): BlogPaginatedResult<T> {
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new BlogContentError(
      `Invalid pageSize: ${pageSize}. Use BLOG_PAGE_SIZE from config.`,
    );
  }

  const total = posts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Number.isInteger(page) ? page : Number.NaN;

  if (!Number.isInteger(safePage) || safePage < 1) {
    return {
      items: [],
      page: safePage,
      pageSize,
      total,
      totalPages,
    };
  }

  const start = (safePage - 1) * pageSize;
  const items = posts.slice(start, start + pageSize);

  return {
    items,
    page: safePage,
    pageSize,
    total,
    totalPages,
  };
}

/** Whether `page` is in range for the given pagination result / totals. */
export function isValidBlogPage(page: number, totalPages: number): boolean {
  return Number.isInteger(page) && page >= 1 && page <= totalPages;
}
