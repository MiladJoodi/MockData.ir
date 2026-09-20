"use client";

import Link from "next/link";
import type { MouseEvent } from "react";

import { blogControlFocus } from "@/components/blog/blog-focus";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { BLOG_CATEGORIES, type BlogCategory } from "@/lib/blog/categories";
import { blogListingHref } from "@/lib/blog/paths";
import { cn } from "@/lib/utils";

export function BlogCategoryNav({
  activeCategory,
  onSelect,
}: {
  activeCategory: BlogCategory | null;
  onSelect?: (category: BlogCategory | null) => void;
}) {
  const { locale, dict } = useUiLocale();
  const isFa = locale === "fa";
  const labels = dict.blog.categories;

  const chipClass = (active: boolean) =>
    cn(
      "relative inline-flex min-h-11 shrink-0 items-center px-3 text-sm font-medium transition-colors duration-200",
      blogControlFocus,
      isFa && "font-fa-label",
      active
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground",
      "after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-[var(--request)] after:transition-opacity after:duration-200",
      active ? "after:opacity-100" : "after:opacity-0",
    );

  function handleSelect(
    event: MouseEvent<HTMLAnchorElement>,
    category: BlogCategory | null,
  ) {
    if (!onSelect) return;
    event.preventDefault();
    onSelect(category);
  }

  return (
    <nav aria-label={dict.blog.categoriesNav} className="min-w-0">
      <div className="-mx-4 flex gap-0.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:gap-1 sm:overflow-visible sm:px-0">
        <Link
          href={blogListingHref(1, null)}
          className={chipClass(activeCategory === null)}
          aria-current={activeCategory === null ? "page" : undefined}
          data-soft-nav={onSelect ? "" : undefined}
          onClick={(event) => handleSelect(event, null)}
        >
          {dict.blog.all}
        </Link>
        {BLOG_CATEGORIES.map((category) => {
          const active = activeCategory === category;
          return (
            <Link
              key={category}
              href={blogListingHref(1, category)}
              className={chipClass(active)}
              aria-current={active ? "page" : undefined}
              data-soft-nav={onSelect ? "" : undefined}
              onClick={(event) => handleSelect(event, category)}
            >
              {labels[category]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
