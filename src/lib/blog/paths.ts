import { isBlogCategory, type BlogCategory } from "@/lib/blog/categories";

/** Canonical listing URL for All or a category at a given page (page 1 has no `/page/1`). */
export function blogListingHref(
  page: number,
  category?: BlogCategory | null,
): string {
  const safePage = Number.isInteger(page) && page > 1 ? page : 1;

  if (category) {
    return safePage === 1
      ? `/blog/category/${category}`
      : `/blog/category/${category}/page/${safePage}`;
  }

  return safePage === 1 ? "/blog" : `/blog/page/${safePage}`;
}

export function parseBlogPageParam(raw: string | undefined): number | null {
  if (raw === undefined) return 1;
  if (!/^\d+$/.test(raw)) return null;
  const page = Number(raw);
  if (!Number.isInteger(page) || page < 1) return null;
  return page;
}

/** Parse listing pathname into category + page (client soft-nav / popstate). */
export function parseBlogListingPath(pathname: string): {
  category: BlogCategory | null;
  page: number;
} | null {
  if (pathname === "/blog" || pathname === "/blog/") {
    return { category: null, page: 1 };
  }

  const categoryPaged = pathname.match(
    /^\/blog\/category\/([^/]+)\/page\/(\d+)\/?$/,
  );
  if (categoryPaged) {
    const [, rawCategory, rawPage] = categoryPaged;
    const page = parseBlogPageParam(rawPage);
    if (!isBlogCategory(rawCategory) || page === null || page < 2) return null;
    return { category: rawCategory, page };
  }

  const categoryOnly = pathname.match(/^\/blog\/category\/([^/]+)\/?$/);
  if (categoryOnly) {
    const rawCategory = categoryOnly[1];
    if (!isBlogCategory(rawCategory)) return null;
    return { category: rawCategory, page: 1 };
  }

  const allPaged = pathname.match(/^\/blog\/page\/(\d+)\/?$/);
  if (allPaged) {
    const page = parseBlogPageParam(allPaged[1]);
    if (page === null || page < 2) return null;
    return { category: null, page };
  }

  return null;
}
