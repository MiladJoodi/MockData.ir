"use client";

import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { LiveBadge } from "@/components/docs/live-badge";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { cn } from "@/lib/utils";

export function ResourceDocsHeader({
  resourceId,
  summary,
}: {
  resourceId: string;
  basePath: string;
  href: string;
  summary?: string;
}) {
  const { dict, locale } = useUiLocale();
  const isFa = locale === "fa";
  const cat = dict.catalog[resourceId];
  const title = cat?.title ?? resourceId;
  const blurb = cat?.summary ?? summary ?? "";
  const backLabel = dict.resourceDocs.backToResources;

  const actionClass = cn(
    "inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-[12px] hover:border-[var(--request)]/40",
    isFa && "font-fa-label",
  );

  const actions = (
    <>
      <Link
        href={`/playground?resource=${resourceId}`}
        className={cn(actionClass, "gap-0")}
      >
        {dict.resourceDocs.playground}
      </Link>
      <Link
        href={`/preview/${resourceId === "auth" ? "auth" : resourceId}`}
        className={actionClass}
      >
        <Eye className="size-3.5" strokeWidth={1.75} aria-hidden />
        {dict.resourceDocs.preview}
      </Link>
    </>
  );

  return (
    <header className="mb-10 space-y-4 border-b border-border pb-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="inline-flex min-w-0 items-center gap-2.5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          <Link
            href="/#resources"
            aria-label={backLabel}
            title={backLabel}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft
              className="size-5 rotate-180 sm:size-6"
              strokeWidth={1.75}
              aria-hidden
            />
          </Link>
          <span className={cn("truncate", isFa && "font-fa-label")}>{title}</span>
          <LiveBadge />
        </h1>
        <div className="hidden shrink-0 flex-nowrap items-center gap-2 sm:flex">
          {actions}
        </div>
      </div>

      {blurb ? (
        <p
          className={cn(
            "max-w-xl text-[14px] leading-6 text-muted-foreground",
            isFa && "font-fa-label",
          )}
        >
          {blurb}
        </p>
      ) : null}

      <div className="flex flex-nowrap items-center gap-2 sm:hidden">
        {actions}
      </div>
    </header>
  );
}
