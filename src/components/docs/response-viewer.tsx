"use client";

import { useMemo, useState } from "react";
import { highlightCode, toSingleLineJson } from "@/lib/syntax";
import { CopyButton } from "@/components/docs/copy-button";
import { cn } from "@/lib/utils";

type ResponseViewerProps = {
  prettyJson: string;
};

export function ResponseViewer({ prettyJson }: ResponseViewerProps) {
  const [mode, setMode] = useState<"pretty" | "line">("pretty");

  const display = useMemo(() => {
    if (mode === "line") return toSingleLineJson(prettyJson);
    return prettyJson;
  }, [mode, prettyJson]);

  const lines = display.split("\n");

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--response)]/35 bg-[var(--vscode-bg)] shadow-[0_12px_40px_-20px_rgb(0_0_0_/_0.8)]">
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--vscode-border)] bg-[var(--response-bg)] px-3 py-2">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f56]" />
          <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="size-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <span className="font-mono text-[11px] text-[var(--response)]">
          Response
        </span>

        <div
          className="ml-auto flex items-center rounded border border-[var(--vscode-border)] bg-[var(--vscode-bg)] p-0.5"
          role="group"
          aria-label="Response format"
        >
          <button
            type="button"
            onClick={() => setMode("pretty")}
            className={cn(
              "rounded px-2.5 py-1 font-mono text-[10px] transition-colors",
              mode === "pretty"
                ? "bg-[var(--response)]/20 text-[var(--response)]"
                : "text-[var(--vscode-fg)]/55 hover:text-[var(--vscode-fg)]",
            )}
          >
            Pretty
          </button>
          <button
            type="button"
            onClick={() => setMode("line")}
            className={cn(
              "rounded px-2.5 py-1 font-mono text-[10px] transition-colors",
              mode === "line"
                ? "bg-[var(--response)]/20 text-[var(--response)]"
                : "text-[var(--vscode-fg)]/55 hover:text-[var(--vscode-fg)]",
            )}
          >
            Line
          </button>
        </div>
        <CopyButton
          value={display}
          className="text-[var(--vscode-fg)]/55 hover:bg-white/10 hover:text-[var(--vscode-fg)]"
        />
      </div>

      <div className="overflow-x-auto">
        <pre className="min-w-full p-0 font-mono text-[12.5px] leading-6">
          <code className="grid">
            {lines.map((line, index) => (
              <span key={index} className="flex min-w-0">
                {mode === "pretty" ? (
                  <span className="sticky left-0 w-10 shrink-0 select-none bg-[var(--vscode-bg)] pr-3 text-right text-[var(--vscode-line)]">
                    {index + 1}
                  </span>
                ) : null}
                <span
                  className={cn(
                    "flex-1 pr-4",
                    mode === "line" ? "px-4 py-3 whitespace-pre-wrap break-all" : "whitespace-pre",
                  )}
                >
                  {highlightCode(line.length ? line : " ", "json")}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
