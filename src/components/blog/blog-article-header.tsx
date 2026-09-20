"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { formatUiDate } from "@/lib/i18n/format";
import type { UiLocale } from "@/lib/i18n/constants";
import { cn } from "@/lib/utils";

export type BlogArticleHeaderProps = {
  date: string;
  /** Content locale matching the rendered MDX body (server cookie). */
  contentLocale: UiLocale;
  title: string;
  description: string;
};

export function BlogArticleHeader({
  date,
  contentLocale,
  title,
  description,
}: BlogArticleHeaderProps) {
  const { locale, dict } = useUiLocale();
  const isFaChrome = locale === "fa";
  const isFaContent = contentLocale === "fa";

  return (
    <header className="space-y-3 sm:space-y-4">
      <div className="flex min-w-0 items-start gap-2.5">
        <Link
          href="/blog"
          aria-label={dict.blog.backToBlog}
          title={dict.blog.backToBlog}
          className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft
            className={cn("size-5 sm:size-6", isFaChrome && "rotate-180")}
            strokeWidth={1.75}
            aria-hidden
          />
        </Link>

        <div
          className="flex min-w-0 flex-1 flex-col gap-1.5 pt-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3"
          lang={contentLocale}
          dir={isFaContent ? "rtl" : "ltr"}
        >
          <h1
            className={cn(
              "min-w-0 text-balance text-lg font-semibold leading-snug tracking-[-0.02em] text-foreground sm:flex-1 sm:text-2xl sm:leading-snug sm:tracking-[-0.03em]",
              isFaContent && "font-fa-label tracking-normal",
            )}
          >
            {title}
          </h1>

          <time
            dateTime={date}
            dir={isFaContent ? "rtl" : "ltr"}
            className={cn(
              "inline-flex w-fit shrink-0 rounded-md bg-muted/60 px-2 py-0.5 text-[11px] leading-4 text-muted-foreground tabular-nums sm:mt-1",
              isFaChrome && "font-fa-label",
            )}
          >
            {formatUiDate(date, contentLocale)}
          </time>
        </div>
      </div>

      <p
        lang={contentLocale}
        dir={isFaContent ? "rtl" : "ltr"}
        className={cn(
          "max-w-2xl text-sm leading-6 text-muted-foreground sm:ps-11 sm:text-[15px] sm:leading-7",
          isFaContent && "font-fa-label",
        )}
      >
        {description}
      </p>
    </header>
  );
}
