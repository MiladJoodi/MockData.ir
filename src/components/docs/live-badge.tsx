"use client";

import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { cn } from "@/lib/utils";

export function LiveBadge() {
  const { locale, dict } = useUiLocale();
  const isFa = locale === "fa";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] text-[var(--get)]",
        isFa ? "font-fa-label font-medium" : "font-mono",
      )}
      title={dict.common.live}
    >
      <span className="relative flex size-1.5" aria-hidden>
        <span className="absolute inset-0 animate-ping rounded-full bg-[var(--get)] opacity-45" />
        <span className="relative size-1.5 rounded-full bg-[var(--get)]" />
      </span>
      {isFa ? dict.common.live : dict.common.live.toUpperCase()}
    </span>
  );
}
