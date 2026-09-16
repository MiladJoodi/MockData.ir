"use client";

import { Eye } from "lucide-react";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import type { ReactNode } from "react";

export function PreviewShell({
  title,
  basePath,
  children,
}: {
  title: string;
  docsHref?: string;
  playgroundHref?: string;
  basePath: string;
  children: ReactNode;
}) {
  const { dict } = useUiLocale();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 space-y-3">
        <div className="space-y-2">
          <h1 className="inline-flex items-center gap-2.5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            <Eye
              className="size-6 shrink-0 text-muted-foreground sm:size-7"
              strokeWidth={1.75}
              aria-label={dict.common.preview}
            />
            <span>{title}</span>
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
