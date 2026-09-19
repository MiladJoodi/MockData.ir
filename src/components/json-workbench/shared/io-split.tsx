"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  input: ReactNode;
  output: ReactNode;
  className?: string;
};

/** Two panes with a flow arrow pointing toward output (flips in RTL). */
export function IoSplit({ input, output, className }: Props) {
  return (
    <div
      className={cn(
        "grid items-stretch gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-2",
        className,
      )}
    >
      <div className="min-w-0">{input}</div>
      <div
        className="flex items-center justify-center py-1 lg:px-1"
        aria-hidden
      >
        <div className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
          <ArrowRight className="size-4 rtl:rotate-180" />
        </div>
      </div>
      <div className="min-w-0">{output}</div>
    </div>
  );
}
