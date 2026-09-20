"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { blogControlFocus } from "@/components/blog/blog-focus";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import type { BlogCategory } from "@/lib/blog/categories";
import { blogListingHref } from "@/lib/blog/paths";
import { cn } from "@/lib/utils";

export function BlogPagination({
  page,
  totalPages,
  category,
  onNavigate,
}: {
  page: number;
  totalPages: number;
  category: BlogCategory | null;
  onNavigate?: (page: number) => void;
}) {
  const { locale, dict } = useUiLocale();
  const isFa = locale === "fa";
  const d = dict.blog;
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const PrevIcon = isFa ? ChevronRight : ChevronLeft;
  const NextIcon = isFa ? ChevronLeft : ChevronRight;

  const status = d.pageStatus
    .replace("{page}", String(page))
    .replace("{total}", String(totalPages));

  const controlClass = cn(
    "inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border/60 bg-card px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50 sm:flex-none",
    blogControlFocus,
    isFa && "font-fa-label",
  );

  const disabledClass = cn(
    "inline-flex min-h-11 min-w-0 flex-1 cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-border/50 px-3.5 text-sm font-medium text-muted-foreground opacity-45 sm:flex-none",
    isFa && "font-fa-label",
  );

  function handleNav(event: MouseEvent<HTMLAnchorElement>, nextPage: number) {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(nextPage);
  }

  return (
    <nav
      aria-label={d.paginationNav}
      className="flex flex-col gap-4 border-t border-border/70 pt-8 sm:flex-row sm:items-center sm:justify-between"
    >
      <p
        className={cn(
          "text-sm tabular-nums text-muted-foreground",
          isFa && "font-fa-label",
        )}
      >
        {status}
      </p>

      <div className="flex items-center gap-2">
        {hasPrev ? (
          <Link
            href={blogListingHref(page - 1, category)}
            className={controlClass}
            data-soft-nav={onNavigate ? "" : undefined}
            onClick={(event) => handleNav(event, page - 1)}
          >
            <PrevIcon className="size-4 shrink-0" aria-hidden />
            <span>{d.previousPage}</span>
          </Link>
        ) : (
          <span className={disabledClass} aria-disabled>
            <PrevIcon className="size-4 shrink-0" aria-hidden />
            <span>{d.previousPage}</span>
          </span>
        )}

        {hasNext ? (
          <Link
            href={blogListingHref(page + 1, category)}
            className={controlClass}
            data-soft-nav={onNavigate ? "" : undefined}
            onClick={(event) => handleNav(event, page + 1)}
          >
            <span>{d.nextPage}</span>
            <NextIcon className="size-4 shrink-0" aria-hidden />
          </Link>
        ) : (
          <span className={disabledClass} aria-disabled>
            <span>{d.nextPage}</span>
            <NextIcon className="size-4 shrink-0" aria-hidden />
          </span>
        )}
      </div>
    </nav>
  );
}
