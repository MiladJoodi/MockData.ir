"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { CopyButton } from "@/components/docs/copy-button";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { extractEntries } from "@/lib/json-workbench/extract";
import { formatJson } from "@/lib/json-workbench/parse";
import { cn } from "@/lib/utils";
import { EmptyState } from "../shared/empty-state";
import { JsonPane } from "../shared/json-pane";
import { workbenchGhostBtn } from "../shared/workbench-toolbar";
import { useWorkbench } from "../workbench-context";

export function ExtractTool() {
  const { dict, locale } = useUiLocale();
  const t = dict.jsonWorkbench;
  const isFa = locale === "fa";
  const { source, parsed } = useWorkbench();
  const outputId = useId();
  const [selected, setSelected] = useState<string[]>([]);

  const entries = useMemo(
    () => (parsed.ok ? extractEntries(parsed.value) : []),
    [parsed],
  );
  const available = useMemo(() => entries.map((e) => e.path), [entries]);
  const availableKey = available.join("\0");

  useEffect(() => {
    setSelected((prev) => {
      if (prev.length === 0) return prev;
      const keep = new Set(available);
      const next = prev.filter((p) => keep.has(p));
      return next.length === prev.length ? prev : next;
    });
  }, [availableKey, available]);

  const output = useMemo(() => {
    if (!parsed.ok || selected.length === 0) return "";
    const keep = new Set(selected);
    return formatJson(entries.filter((e) => keep.has(e.path)));
  }, [parsed, selected, entries]);

  function toggle(path: string) {
    setSelected((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path],
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-[var(--request)]/25 bg-[var(--request-fill)]/10 px-3 py-2.5">
        <p
          className={cn(
            "text-[13px] font-medium text-foreground",
            isFa && "font-fa-label",
          )}
        >
          {t.utilities.extractHint}
        </p>
        <p
          className={cn(
            "mt-1 text-[12.5px] leading-relaxed text-muted-foreground",
            isFa && "font-fa-label",
          )}
        >
          {t.utilities.fieldsClickHint}
        </p>
      </div>

      {parsed.ok && available.length > 0 ? (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={cn(
                "text-[12px] font-medium text-muted-foreground",
                isFa && "font-fa-label",
              )}
            >
              {t.utilities.fieldsLabel}
              <span className="ms-1.5 font-normal tabular-nums">
                ({selected.length}/{available.length})
              </span>
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                className={cn(workbenchGhostBtn, "h-8 px-2.5 text-[12px]")}
                onClick={() => setSelected(available)}
                disabled={selected.length === available.length}
              >
                {t.utilities.fieldsSelectAll}
              </button>
              <button
                type="button"
                className={cn(workbenchGhostBtn, "h-8 px-2.5 text-[12px]")}
                onClick={() => setSelected([])}
                disabled={selected.length === 0}
              >
                {t.utilities.fieldsClear}
              </button>
            </div>
          </div>

          <ul
            className="flex max-h-48 flex-wrap gap-1.5 overflow-y-auto rounded-md border border-border bg-background/60 p-2"
            aria-label={t.utilities.fieldsLabel}
          >
            {available.map((path) => {
              const on = selected.includes(path);
              return (
                <li key={path}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    onClick={() => toggle(path)}
                    className={cn(
                      "inline-flex max-w-full items-center gap-1.5 rounded-md border px-2 py-1 text-start transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--request)]/45",
                      on
                        ? "border-[var(--request)]/45 bg-[var(--request-fill)]/15"
                        : "border-border bg-card hover:bg-[var(--surface-hover)]",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-4 shrink-0 place-items-center rounded-full border",
                        on
                          ? "border-[var(--request)] bg-[var(--request)] text-white"
                          : "border-border bg-background text-transparent",
                      )}
                      aria-hidden
                    >
                      <Check className="size-2.5" strokeWidth={3} />
                    </span>
                    <code
                      className={cn(
                        "truncate font-mono text-[12px]",
                        on ? "text-foreground" : "text-muted-foreground",
                      )}
                      dir="ltr"
                    >
                      {path}
                    </code>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {output ? (
        <JsonPane
          id={outputId}
          label={t.labels.output}
          tone="output"
          value={output}
          onChange={() => {}}
          readOnly
          headerAction={
            <CopyButton value={output} label={dict.common.copy} />
          }
        />
      ) : (
        <EmptyState
          title={t.utilities.extractIdleTitle}
          body={
            !source.trim()
              ? t.source.needJson
              : !parsed.ok
                ? t.source.fixFirst
                : available.length === 0
                  ? t.utilities.fieldsEmpty
                  : t.utilities.extractIdleBody
          }
        />
      )}
    </div>
  );
}
