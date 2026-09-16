"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { ApiBasePath } from "@/components/docs/api-base-path";
import { LiveBadge } from "@/components/docs/live-badge";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { useUiLocale } from "@/components/providers/ui-locale-provider";

export function ResourceDocsHeader({
  resourceId,
  basePath,
  href,
}: {
  resourceId: string;
  basePath: string;
  href: string;
}) {
  const { dict } = useUiLocale();
  const cat = dict.catalog[resourceId];
  const title = cat?.title ?? resourceId;
  const blurb = cat?.summary ?? "";

  return (
    <header className="mb-10 space-y-4 border-b border-border pb-8">
      <Breadcrumbs
        items={[
          { name: dict.common.home, href: "/", path: "/" },
          { name: dict.common.docs, href: "/docs", path: "/docs" },
          { name: title, path: href },
        ]}
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              {title}
            </h1>
            <LiveBadge />
          </div>
          {blurb ? (
            <p className="mt-3 max-w-xl text-[14px] leading-6 text-muted-foreground">
              {blurb}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ApiBasePath path={basePath} />
          <Link
            href={`/preview/${resourceId === "auth" ? "auth" : resourceId}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-[12px] hover:border-[var(--request)]/40"
          >
            <Eye className="size-3.5" strokeWidth={1.75} aria-hidden />
            {dict.resourceDocs.preview}
          </Link>
          <Link
            href={`/playground?resource=${resourceId}`}
            className="rounded-md border border-border bg-muted/40 px-3 py-1.5 text-[12px] hover:border-[var(--request)]/40"
          >
            {dict.resourceDocs.playground}
          </Link>
        </div>
      </div>
    </header>
  );
}
