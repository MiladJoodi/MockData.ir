"use client";

import type { ReactNode } from "react";
import { highlightCode } from "@/lib/syntax";
import { cn } from "@/lib/utils";
import { CodeCornerAction } from "./code-corner-action";

type HighlightLang = "json" | "javascript" | "types" | "plain";

type Props = {
  id: string;
  label: string;
  value: string;
  language?: HighlightLang;
  className?: string;
  /** Copy (or other) control — rendered top-end inside the dark code frame. */
  headerAction?: ReactNode;
  tone?: "input" | "output" | "neutral";
};

export function CodeOutputPane({
  id,
  label,
  value,
  language = "json",
  className,
  headerAction,
  tone = "output",
}: Props) {
  const display = value.length ? value : " ";
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
      <div
        className={cn(
          "code-pane relative overflow-hidden rounded-md border border-border bg-[var(--vscode-bg)]",
          frame,
        )}
      >
        {headerAction ? (
          <CodeCornerAction>{headerAction}</CodeCornerAction>
        ) : null}
        <pre
          id={id}
          className={cn(
            "code-scroll m-0 max-h-[min(28rem,50vh)] overflow-auto p-3 font-mono text-[12px] leading-5 text-[var(--vscode-string)]",
            headerAction && "pe-11",
          )}
          dir="ltr"
          tabIndex={0}
          aria-label={label}
        >
          <code className="block min-w-0 whitespace-pre-wrap break-all text-[var(--vscode-fg)]">
            {display.split("\n").map((line, index, arr) => (
              <span
                key={index}
                className={
                  language === "plain"
                    ? "text-[var(--vscode-string)]"
                    : undefined
                }
              >
                {language === "plain"
                  ? line.length
                    ? line
                    : " "
                  : language === "types"
                    ? highlightCode(line.length ? line : " ", "types")
                    : highlightCode(line.length ? line : " ", language)}
                {index < arr.length - 1 ? "\n" : null}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
