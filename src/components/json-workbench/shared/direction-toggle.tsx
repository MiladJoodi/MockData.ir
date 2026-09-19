"use client";

import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  fromLabel: string;
  toLabel: string;
  onSwap: () => void;
  swapLabel: string;
  className?: string;
};

/** Labels with a single swap icon between them (RTL-safe). */
export function DirectionToggle({
  fromLabel,
  toLabel,
  onSwap,
  swapLabel,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2 text-[13px] text-muted-foreground sm:justify-start",
        className,
      )}
    >
      <span className="rounded-md border border-border bg-card px-2.5 py-1.5 font-medium text-foreground">
        {fromLabel}
      </span>
      <button
        type="button"
        onClick={onSwap}
        className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-[var(--surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--request)]/45"
        aria-label={swapLabel}
        title={swapLabel}
      >
        <ArrowLeftRight className="size-4" aria-hidden />
      </button>
      <span className="rounded-md border border-border bg-card px-2.5 py-1.5 font-medium text-foreground">
        {toLabel}
      </span>
    </div>
  );
}
