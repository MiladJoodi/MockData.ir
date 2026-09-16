"use client";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import type { ReactNode } from "react";

export function PreviewShell({
  title,
  basePath,
  crumbs,
  children,
}: {
  title: string;
  docsHref?: string;
  playgroundHref?: string;
  basePath: string;
  crumbs: { name: string; href?: string; path: string }[];
  children: ReactNode;
}) {
  const { dict } = useUiLocale();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 space-y-3">
        <Breadcrumbs items={crumbs} />
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-xl text-[14px] leading-6 text-muted-foreground">
            {dict.preview.blurb}{" "}
            <code
              className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] ltr-tech"
              dir="ltr"
            >
              {basePath}
            </code>
          </p>
        </div>
      </header>
      {children}
    </div>
  );
}
