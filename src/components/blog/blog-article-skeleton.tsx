"use client";

import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { cn } from "@/lib/utils";

/** Skeleton for article routes — avoids listing chips on /blog/[slug]. */
export function BlogArticleSkeleton() {
  const { locale, dict } = useUiLocale();
  const isFa = locale === "fa";

  return (
    <div
      className="mx-auto min-w-0 max-w-3xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14"
      aria-busy
      aria-label={dict.common.loading}
    >
      <div className="flex items-start gap-2.5">
        <div className="size-9 shrink-0 rounded-lg bg-muted animate-pulse" />
        <div className="flex min-w-0 flex-1 items-start justify-between gap-3 pt-1">
          <div
            className={cn(
              "h-7 w-3/5 max-w-sm rounded-md bg-muted animate-pulse",
              isFa && "ms-auto",
            )}
          />
          <div className="h-5 w-24 shrink-0 rounded-md bg-muted/60 animate-pulse" />
        </div>
      </div>
      <div className="mt-4 h-4 w-full max-w-lg rounded bg-muted/70 animate-pulse sm:ps-11" />
      <div className="mt-2 h-4 w-2/3 max-w-md rounded bg-muted/60 animate-pulse sm:ps-11" />
      <div className="mt-12 space-y-4 border-t border-border/70 pt-10">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 w-full rounded bg-muted/70 animate-pulse" />
            <div className="h-4 w-11/12 rounded bg-muted/60 animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-muted/50 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
