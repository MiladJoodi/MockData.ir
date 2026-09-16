"use client";

import { ApiPlayground } from "@/components/playground/api-playground";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import type { PlaygroundResourceId } from "@/lib/playground";

export function PlaygroundPageContent({
  initialResource,
}: {
  initialResource: PlaygroundResourceId;
}) {
  const { dict } = useUiLocale();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 space-y-3">
        <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          {dict.playground.title}
        </h1>
        <p className="max-w-xl text-[14px] leading-6 text-muted-foreground">
          {dict.playground.blurb}
        </p>
      </header>

      <ApiPlayground key={initialResource} initialResource={initialResource} />
    </div>
  );
}
