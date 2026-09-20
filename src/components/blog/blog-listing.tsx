"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, FileText } from "lucide-react";

import { BlogCategoryNav } from "@/components/blog/blog-category-nav";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import type { BlogCategory } from "@/lib/blog/categories";
import { BLOG_PAGE_SIZE } from "@/lib/blog/config";
import { blogListingHref, parseBlogListingPath } from "@/lib/blog/paths";
import type { BlogPostListItem } from "@/lib/blog/posts";
import { cancelNavigationProgress } from "@/lib/navigation-progress";
import { cn } from "@/lib/utils";

export type BlogListingProps = {
  allItems: BlogPostListItem[];
  page: number;
  activeCategory: BlogCategory | null;
};

export function BlogListing({
  allItems,
  page,
  activeCategory,
}: BlogListingProps) {
  const { locale, dict } = useUiLocale();
  const isFa = locale === "fa";
  const d = dict.blog;

  const [displayCategory, setDisplayCategory] = useState(activeCategory);
  const [displayPage, setDisplayPage] = useState(page);

  useEffect(() => {
    setDisplayCategory(activeCategory);
    setDisplayPage(page);
  }, [activeCategory, page]);

  useEffect(() => {
    function onPopState() {
      const parsed = parseBlogListingPath(window.location.pathname);
      if (!parsed) return;
      setDisplayCategory(parsed.category);
      setDisplayPage(parsed.page);
      cancelNavigationProgress();
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const filtered = useMemo(() => {
    if (!displayCategory) return allItems;
    return allItems.filter((item) => item.category === displayCategory);
  }, [allItems, displayCategory]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE));
  const safePage = Math.min(displayPage, totalPages);
  const items = filtered.slice(
    (safePage - 1) * BLOG_PAGE_SIZE,
    safePage * BLOG_PAGE_SIZE,
  );
  const isEmpty = total === 0;

  function navigateListing(nextPage: number, category: BlogCategory | null) {
    setDisplayCategory(category);
    setDisplayPage(nextPage);
    const href = blogListingHref(nextPage, category);
    window.history.pushState(window.history.state, "", href);
    cancelNavigationProgress();
  }

  return (
    <div className="mx-auto min-w-0 max-w-3xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20">
      <header className="mb-8 space-y-2 sm:mb-10">
        <h1
          className={cn(
            "inline-flex min-w-0 items-center gap-2.5 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl",
            isFa && "font-fa-label tracking-normal",
          )}
        >
          <Link
            href="/"
            aria-label={dict.common.home}
            title={dict.common.home}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft
              className={cn("size-5 sm:size-6", isFa && "rotate-180")}
              strokeWidth={1.75}
              aria-hidden
            />
          </Link>
          <span className="truncate">{d.title}</span>
        </h1>
        <p
          className={cn(
            "max-w-xl text-sm leading-6 text-muted-foreground sm:text-[15px] sm:leading-7",
            isFa && "font-fa-label",
          )}
        >
          {d.description}
        </p>
      </header>

      <div className="border-b border-border/70">
        <BlogCategoryNav
          activeCategory={displayCategory}
          onSelect={(category) => navigateListing(1, category)}
        />
      </div>

      {isEmpty ? (
        <div
          className={cn(
            "mt-14 flex flex-col items-center gap-3 px-4 py-10 text-center",
            isFa && "font-fa-label",
          )}
        >
          <FileText
            className="size-8 text-muted-foreground/50"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-sm text-muted-foreground">
            {displayCategory ? d.emptyCategoryTitle : d.emptyTitle}
          </p>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-3 sm:mt-10 sm:gap-3">
          {items.map((item) => (
            <li key={item.id}>
              <BlogPostCard item={item} />
            </li>
          ))}
        </ul>
      )}

      {!isEmpty && totalPages > 1 ? (
        <div className="mt-10 sm:mt-12">
          <BlogPagination
            page={safePage}
            totalPages={totalPages}
            category={displayCategory}
            onNavigate={(nextPage) => navigateListing(nextPage, displayCategory)}
          />
        </div>
      ) : null}
    </div>
  );
}
