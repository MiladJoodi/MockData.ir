"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, CircleAlert, Download, Loader2 } from "lucide-react";
import { CopyButton } from "@/components/docs/copy-button";
import { highlightCode } from "@/lib/syntax";
import { recordToTypeScript } from "@/lib/generator/to-typescript";
import type { TemporaryDuration } from "@/lib/temporary/limits";
import { TEMPORARY_DURATIONS } from "@/lib/temporary/limits";
import { cn } from "@/lib/utils";

export function GeneratedResult({
  count,
  records,
  topicId,
  topicLabel,
  isFa,
  copyLabel,
  downloadLabel,
  createApiLabel,
  creatingLabel,
  createdTitle,
  durationLabel,
  viewJsonLabel,
  viewTypeLabel,
  creating,
  createDisabled,
  createBlockedReason,
  duration,
  onDurationChange,
  durationLabels,
  onDownload,
  onCreateApi,
  createdUrl,
  openTemporaryLabel,
  generatedLabel,
}: {
  count: number;
  records: Record<string, unknown>[];
  topicId: string;
  topicLabel: string;
  isFa: boolean;
  copyLabel: string;
  downloadLabel: string;
  createApiLabel: string;
  creatingLabel: string;
  createdTitle: string;
  durationLabel: string;
  viewJsonLabel: string;
  viewTypeLabel: string;
  creating: boolean;
  createDisabled: boolean;
  createBlockedReason: string | null;
  duration: TemporaryDuration;
  onDurationChange: (d: TemporaryDuration) => void;
  durationLabels: Record<TemporaryDuration, string>;
  onDownload: () => void;
  onCreateApi: () => void;
  createdUrl: string | null;
  openTemporaryLabel: string;
  generatedLabel: string;
}) {
  const [view, setView] = useState<"json" | "type">("json");

  const jsonText = useMemo(
    () => JSON.stringify(records, null, 2),
    [records],
  );

  const typeText = useMemo(() => {
    const sample = records[0];
    if (!sample) return `type ${topicId} = Record<string, unknown>;`;
    return recordToTypeScript(topicId, sample);
  }, [records, topicId]);

  const displayText = view === "json" ? jsonText : typeText;
  const displayLines = useMemo(() => displayText.split("\n"), [displayText]);

  return (
    <section className="space-y-4" aria-live="polite">
      <h2
        className={cn(
          "text-[15px] font-medium text-foreground",
          isFa && "font-fa-label",
        )}
      >
        {generatedLabel}
      </h2>

      {createdUrl ? (
        <div
          key={createdUrl}
          id="generator-tmp-success"
          role="status"
          className={cn(
            "scroll-mt-20 space-y-3 rounded-xl border border-[var(--response)]/30 bg-[var(--response-bg)] px-3.5 py-4",
            "animate-in fade-in-0 slide-in-from-top-2 duration-300",
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--response)] text-white">
              <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
            </span>
            <p
              className={cn(
                "text-[14px] font-medium text-[var(--response)]",
                isFa && "font-fa-label",
              )}
            >
              {createdTitle}
            </p>
          </div>
          <div className="flex items-center justify-center gap-1" dir="ltr">
            <a
              href={createdUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={createdUrl}
              className="max-w-[calc(100%-2.25rem)] truncate text-center font-mono text-[14px] text-[var(--response)] underline-offset-2 hover:underline sm:text-[15px]"
            >
              {createdUrl}
            </a>
            <CopyButton
              value={createdUrl}
              label={copyLabel}
              className="size-8 shrink-0 text-[var(--response)] hover:bg-[var(--response)]/15 hover:text-[var(--response)]"
            />
          </div>
          <div className="flex justify-center">
            <Link
              href="/temporary"
              className={cn(
                "text-[12px] text-muted-foreground underline-offset-2 hover:underline",
                isFa && "font-fa-label",
              )}
            >
              {openTemporaryLabel}
            </Link>
          </div>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label
          htmlFor="generator-tmp-duration"
          className={cn(
            "text-[13px] text-muted-foreground",
            isFa && "font-fa-label",
          )}
        >
          {durationLabel}
        </label>
        <div className="flex items-center gap-2">
          <div className="relative w-[8.5rem] shrink-0 sm:w-[9.5rem]">
            <select
              id="generator-tmp-duration"
              value={duration}
              onChange={(e) =>
                onDurationChange(e.target.value as TemporaryDuration)
              }
              className={cn(
                "h-10 w-full appearance-none rounded-lg border border-border bg-white pe-9 ps-3 text-[14px] outline-none transition-colors focus:border-foreground/35 dark:bg-background",
                isFa && "font-fa-label",
              )}
            >
              {TEMPORARY_DURATIONS.map((d) => (
                <option key={d} value={d}>
                  {durationLabels[d]}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
              aria-hidden
            />
          </div>
          <button
            type="button"
            disabled={createDisabled || creating}
            onClick={onCreateApi}
            className={cn(
              "inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-md bg-[var(--request-fill)] text-[14px] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40",
              isFa && "font-fa-label",
            )}
          >
            {creating ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : null}
            {creating ? creatingLabel : createApiLabel}
          </button>
        </div>
      </div>

      {createBlockedReason ? (
        <div
          role="status"
          className="flex gap-3 rounded-lg border border-border bg-muted/45 px-3.5 py-3"
        >
          <CircleAlert
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
            strokeWidth={1.75}
            aria-hidden
          />
          <p
            className={cn(
              "text-[13px] leading-5 text-muted-foreground",
              isFa && "font-fa-label",
            )}
          >
            {createBlockedReason}
          </p>
        </div>
      ) : null}

      <div
        className="code-pane overflow-hidden rounded-lg border border-[var(--vscode-border)] bg-[var(--vscode-bg)]"
        dir="ltr"
      >
        <div className="flex items-center gap-2 border-b border-[var(--vscode-border)] bg-[var(--vscode-bg-elevated)] px-3 py-2">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-[#ff5f56]" />
            <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="size-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="font-mono text-[11px] font-semibold text-[var(--response-fg)]">
            {view === "type" ? "TS" : "JSON"}
          </span>
          <span className="truncate font-mono text-[10px] text-[var(--vscode-fg)]/45">
            {topicLabel} · {count}
          </span>
          <div
            className="ms-auto flex items-center rounded border border-[var(--vscode-border)] bg-[var(--vscode-bg)] p-0.5"
            role="group"
            aria-label="View"
          >
            <button
              type="button"
              onClick={() => setView("json")}
              className={cn(
                "rounded px-2.5 py-1 font-mono text-[10px] font-medium transition-colors",
                view === "json"
                  ? "bg-[var(--response-fg)]/20 text-[var(--response-fg)]"
                  : "text-[var(--vscode-fg)]/70 hover:text-[var(--vscode-fg)]",
              )}
            >
              {viewJsonLabel}
            </button>
            <button
              type="button"
              onClick={() => setView("type")}
              className={cn(
                "rounded px-2.5 py-1 font-mono text-[10px] font-medium transition-colors",
                view === "type"
                  ? "bg-[var(--response-fg)]/20 text-[var(--response-fg)]"
                  : "text-[var(--vscode-fg)]/70 hover:text-[var(--vscode-fg)]",
              )}
            >
              {viewTypeLabel}
            </button>
          </div>
          <CopyButton
            value={displayText}
            label={copyLabel}
            className="text-[var(--vscode-fg)]/70 hover:bg-white/10 hover:text-[var(--vscode-fg)]"
          />
          {view === "json" ? (
            <button
              type="button"
              onClick={onDownload}
              aria-label={downloadLabel}
              title={downloadLabel}
              className="grid size-7 place-items-center rounded-md text-[var(--vscode-fg)]/70 transition-colors hover:bg-white/10 hover:text-[var(--vscode-fg)]"
            >
              <Download className="size-3.5" aria-hidden />
            </button>
          ) : null}
        </div>
        <pre
          className="code-scroll m-0 h-[28rem] overflow-auto p-0 font-mono text-[12.5px] leading-6"
          dir="ltr"
        >
          <code className="grid min-w-0">
            {displayLines.map((line, index) => (
              <span key={index} className="flex min-w-0">
                <span className="sticky left-0 w-10 shrink-0 select-none bg-[var(--vscode-bg)] pr-3 text-right text-[var(--vscode-line)]">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 break-all pr-4 whitespace-pre-wrap">
                  {highlightCode(line.length ? line : " ", view === "json" ? "json" : "types", {
                    persianStrings: isFa && view === "json",
                  })}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </section>
  );
}
