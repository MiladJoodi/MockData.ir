"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ApiPlayground } from "@/components/playground/api-playground";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import type { PlaygroundResourceId } from "@/lib/playground";
import { cn } from "@/lib/utils";

export function PlaygroundPageContent({
  initialResource,
}: {
  initialResource: PlaygroundResourceId;
}) {
  const { dict, locale } = useUiLocale();
  const isFa = locale === "fa";
  const backLabel = dict.resourceDocs.backToResources;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 space-y-3">
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
          <span className={cn("truncate", isFa && "font-fa-label")}>
            {dict.playground.title}
          </span>
        </h1>
        <p
          className={cn(
            "max-w-xl text-[14px] leading-6 text-muted-foreground",
            isFa && "font-fa-label",
          )}
        >
          {dict.playground.blurb}
        </p>
      </header>

      <ApiPlayground initialResource={initialResource} />
    </div>
  );
}
