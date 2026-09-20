import type { UiLocale } from "@/lib/i18n/constants";
import type { BlogCategory } from "@/lib/blog/categories";

/** Parsed YAML frontmatter from a locale MDX file. */
export type BlogFrontmatter = {
  id: string;
  title: string;
  description: string;
  category: BlogCategory;
  /** ISO date string, e.g. `2026-09-19` */
  date: string;
  published: boolean;
};

/** Locale-independent listing fields derived from a post folder. */
export type BlogPostMeta = {
  id: string;
  category: BlogCategory;
  date: string;
  published: boolean;
  /** Locales that have an MDX file on disk. */
  locales: UiLocale[];
};

/** Localized fields for a single language version of a post. */
export type BlogPostLocalized = BlogPostMeta & {
  locale: UiLocale;
  title: string;
  description: string;
  /** Approximate reading time in minutes. */
  readingTimeMinutes: number;
};

/** Full post ready for the article page (body compiled later in the MDX pipeline). */
export type BlogPost = BlogPostLocalized & {
  /** Raw MDX body without frontmatter. */
  body: string;
};

export type BlogPaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
