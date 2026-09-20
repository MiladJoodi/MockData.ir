"use client";

import Link from "next/link";

import { blogControlFocus } from "@/components/blog/blog-focus";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import type { BlogPostListItem } from "@/lib/blog/posts";
import { formatUiDate } from "@/lib/i18n/format";
import { cn } from "@/lib/utils";

export function BlogPostCard({ item }: { item: BlogPostListItem }) {
  const { locale } = useUiLocale();
  const isFa = locale === "fa";
  const localized = item[locale];

  return (
    <article className="min-w-0">
      <Link
        href={`/blog/${item.id}`}
        className={cn(
          "group block min-w-0 rounded-2xl border border-border bg-card/80 p-4 sm:p-[1.125rem]",
          blogControlFocus,
        )}
      >
        <div className="flex min-w-0 items-start justify-between gap-3">
          <h2
            className={cn(
              "min-w-0 flex-1 text-[15px] font-semibold tracking-[-0.02em] text-foreground transition-colors duration-200 group-hover:text-[var(--request-fill)] sm:text-base sm:leading-snug",
              isFa && "font-fa-label tracking-normal",
            )}
          >
            {localized.title}
          </h2>

          <time
            dateTime={item.date}
            dir={isFa ? "rtl" : "ltr"}
            className={cn(
              "inline-flex shrink-0 rounded-md bg-muted/60 px-2 py-0.5 text-[11px] leading-4 text-muted-foreground tabular-nums",
              isFa && "font-fa-label",
            )}
          >
            {formatUiDate(item.date, locale)}
          </time>
        </div>

        <p
          className={cn(
            "mt-1.5 line-clamp-2 text-[13px] leading-5 text-muted-foreground sm:text-sm sm:leading-6",
            isFa && "font-fa-label",
          )}
        >
          {localized.description}
        </p>
      </Link>
    </article>
  );
}
