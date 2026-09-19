"use client";

import type { ReactNode } from "react";
import { HighlightedJsonEditor } from "@/components/playground/highlighted-json-editor";
import { highlightCode } from "@/lib/syntax";
import { cn } from "@/lib/utils";
import { CodeCornerAction } from "./code-corner-action";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  rows?: number;
  className?: string;
  /** Copy (or other) control — rendered top-end inside the dark code frame. */
  headerAction?: ReactNode;
  tone?: "input" | "output" | "neutral";
};

export function JsonPane({
  id,
  label,
  value,
  onChange,
  readOnly = false,
  rows = 14,
  className,
  headerAction,
  tone = "neutral",
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
      {readOnly ? (
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
              "code-scroll m-0 max-h-[min(28rem,50vh)] overflow-auto p-3 font-mono text-[12px] leading-5 text-[var(--vscode-fg)]",
              headerAction && "pe-11",
            )}
            dir="ltr"
            tabIndex={0}
            aria-label={label}
          >
            <code className="block min-w-0 whitespace-pre-wrap break-all">
              {display.split("\n").map((line, index, arr) => (
                <span key={index}>
                  {highlightCode(line.length ? line : " ", "json")}
                  {index < arr.length - 1 ? "\n" : null}
                </span>
              ))}
            </code>
          </pre>
        </div>
      ) : (
        <div className={cn("relative rounded-md", frame)}>
          {headerAction ? (
            <CodeCornerAction>{headerAction}</CodeCornerAction>
          ) : null}
          <HighlightedJsonEditor
            id={id}
            value={value}
            onChange={onChange}
            rows={rows}
            bare={false}
            padEnd={Boolean(headerAction)}
          />
        </div>
      )}
    </div>
  );
}
