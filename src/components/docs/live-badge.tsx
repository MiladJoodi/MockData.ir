"use client";

import { useUiLocale } from "@/components/providers/ui-locale-provider";

export function LiveBadge() {
  const { dict } = useUiLocale();

  return (
    <span
      className="relative inline-flex size-2 shrink-0"
      title={dict.common.live}
      aria-label={dict.common.live}
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[var(--get)] opacity-45" />
      <span className="relative size-2 rounded-full bg-[var(--get)]" />
    </span>
  );
}
