"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Positions a control (usually Copy) at the top-end of a dark code frame. */
export function CodeCornerAction({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "absolute top-1.5 right-1.5 z-10",
        "[&_button]:text-[var(--vscode-fg)]/55",
        "[&_button]:hover:bg-white/10 [&_button]:hover:text-[var(--vscode-fg)]",
      )}
    >
      {children}
    </div>
  );
}
