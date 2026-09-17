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
      <header className="mb-8 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h1 className="inline-flex min-w-0 items-center gap-2.5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            <Link
              href={resourceHref}
              aria-label={backLabel}
              title={backLabel}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft
                className={cn("size-5 sm:size-6", isFa && "rotate-180")}
                strokeWidth={1.75}
                aria-hidden
              />
            </Link>
            <span className={cn("truncate", isFa && "font-fa-label")}>{title}</span>
          </h1>
          <Eye
            className="size-6 shrink-0 text-muted-foreground sm:size-7"
            strokeWidth={1.75}
            aria-label={dict.common.preview}
          />
        </div>
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
      </header>
      {children}
    </div>
  );
}
