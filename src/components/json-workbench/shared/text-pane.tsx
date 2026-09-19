"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CodeCornerAction } from "./code-corner-action";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  className?: string;
  /** Copy (or other) control — rendered top-end inside the dark code frame. */
  headerAction?: ReactNode;
  placeholder?: string;
  tone?: "input" | "output" | "neutral";
};

/** Plain multiline editor for YAML / CSV (not JSON-highlighted). */
export function TextPane({
  id,
  label,
  value,
  onChange,
  rows = 14,
  className,
  headerAction,
  placeholder,
  tone = "neutral",
}: Props) {
  const frame =
    tone === "input"
      ? "ring-1 ring-[var(--request)]/35 border-[var(--request)]/40"
      : tone === "output"
        ? "ring-1 ring-[var(--response)]/30 border-[var(--response)]/35"
        : "";

  return (
    <div className={cn("flex min-h-0 flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className={cn(
          "text-[12px] font-medium",
          tone === "input"
            ? "text-[var(--request)]"
            : tone === "output"
              ? "text-[var(--response)]"
              : "text-muted-foreground",
        )}
      >
        {label}
      </label>
      <div className="relative">
        {headerAction ? (
          <CodeCornerAction>{headerAction}</CodeCornerAction>
        ) : null}
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          dir="ltr"
          className={cn(
            "code-pane code-scroll w-full resize-y rounded-md border border-border bg-[var(--vscode-bg)] p-3 font-mono text-[12px] leading-5 text-[var(--vscode-fg)] outline-none",
            "focus-visible:border-[var(--request)]/50 focus-visible:ring-2 focus-visible:ring-[var(--request)]/30",
            headerAction && "pe-11",
            frame,
          )}
        />
      </div>
    </div>
  );
}
