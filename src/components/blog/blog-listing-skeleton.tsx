"use client";

import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { cn } from "@/lib/utils";

export function BlogListingSkeleton() {
  const { locale, dict } = useUiLocale();
  const isFa = locale === "fa";

  return (
    <div
      className="mx-auto min-w-0 max-w-3xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14"
      aria-busy
      aria-label={dict.common.loading}
    >
      <div className="mb-8 flex items-center gap-2.5 sm:mb-10">
        <div className="size-9 shrink-0 rounded-lg bg-muted animate-pulse" />
        <div
          className={cn(
            "h-9 w-36 max-w-full rounded-lg bg-muted animate-pulse",
            isFa && "ms-auto",
          )}
        />
      </div>
      <div className="h-4 w-full max-w-md rounded bg-muted/70 animate-pulse" />
      <div className="mt-8 flex gap-3 border-b border-border/70 pb-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-5 w-16 shrink-0 rounded bg-muted animate-pulse"
          />
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="space-y-2.5 rounded-2xl border border-border/40 bg-card/60 p-4 sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="h-5 w-3/4 max-w-sm rounded bg-muted animate-pulse" />
              <div className="flex gap-1.5">
                <div className="h-5 w-14 rounded-md bg-muted/60 animate-pulse" />
                <div className="h-5 w-20 rounded-md bg-muted/60 animate-pulse" />
              </div>
            </div>
            <div className="h-4 w-full rounded bg-muted/70 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-muted/60 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
