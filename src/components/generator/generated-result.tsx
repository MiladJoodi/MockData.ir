"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Download, Link2, Loader2 } from "lucide-react";
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
  statusMessage,
}: {
  count: number;
  records: Record<string, unknown>[];
  topicId: string;
  topicLabel: string;
  isFa: boolean;
  copyLabel: string;
  downloadLabel: string;
  createApiLabel: string;
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
  statusMessage: string | null;
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
    <section className="space-y-3" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2
          className={cn(
            "text-[15px] font-medium text-foreground",
            isFa && "font-fa-label",
          )}
        >
          {generatedLabel}
        </h2>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex flex-wrap gap-1">
            {TEMPORARY_DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={duration === d}
                onClick={() => onDurationChange(d)}
                className={cn(
                  "rounded-md border px-2 py-1 text-[11px] tabular-nums",
                  duration === d
                    ? "border-[var(--request)]/40 bg-[var(--request)]/10 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                  isFa && "font-fa-label",
                )}
              >
                {durationLabels[d]}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={createDisabled || creating}
            onClick={onCreateApi}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-45",
              isFa && "font-fa-label",
            )}
          >
            {creating ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
            ) : (
              <Link2 className="size-3.5" aria-hidden />
            )}
            {createApiLabel}
          </button>
        </div>
      </div>

      {createBlockedReason ? (
        <p
          className={cn(
            "text-[12px] text-amber-700 dark:text-amber-400",
            isFa && "font-fa-label",
          )}
          role="status"
        >
          {createBlockedReason}
        </p>
      ) : null}

      {statusMessage ? (
        <p
          className={cn(
            "text-[12px] text-muted-foreground",
            isFa && "font-fa-label",
          )}
          role="status"
        >
          {statusMessage}
        </p>
      ) : null}

      {createdUrl ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[13px]">
          <Check
            className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
            aria-hidden
          />
          <a
            href={createdUrl}
            className="min-w-0 flex-1 truncate font-medium text-foreground underline-offset-2 hover:underline ltr-tech"
            dir="ltr"
            target="_blank"
            rel="noreferrer"
          >
            {createdUrl}
          </a>
          <CopyButton value={createdUrl} label={copyLabel} />
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
