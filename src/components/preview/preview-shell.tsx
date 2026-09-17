"use client";

import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PreviewShell({
  title,
  basePath,
  resourceHref,
  children,
}: {
  title: string;
  docsHref?: string;
  playgroundHref?: string;
  resourceHref: string;
  basePath: string;
  children: ReactNode;
}) {
  const { dict, locale } = useUiLocale();
  const isFa = locale === "fa";
  const backLabel = dict.preview.backToResource.replace("{name}", title);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 space-y-3">
        <Link
          href={resourceHref}
          className={cn(
            "inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground",
            isFa && "font-fa-label",
          )}
        >
          <ArrowLeft
            className={cn("size-3.5 shrink-0", isFa && "rotate-180")}
            strokeWidth={1.75}
            aria-hidden
          />
          {backLabel}
        </Link>
        <div className="space-y-2">
          <h1 className="inline-flex items-center gap-2.5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            <Eye
              className="size-6 shrink-0 text-muted-foreground sm:size-7"
              strokeWidth={1.75}
              aria-label={dict.common.preview}
            />
            <span className={cn(isFa && "font-fa-label")}>{title}</span>
          </h1>
          <p
            className={cn(
              "max-w-xl text-[14px] leading-6 text-muted-foreground",
              isFa && "font-fa-label",
            )}
          >
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
