"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { CopyButton } from "@/components/docs/copy-button";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { extractEntries } from "@/lib/json-workbench/extract";
import { formatJson } from "@/lib/json-workbench/parse";
import { cn } from "@/lib/utils";
import {
  WorkbenchCheckChip,
  WorkbenchChipButton,
} from "../shared/workbench-check-chip";
import { EmptyState } from "../shared/empty-state";
import { JsonPane } from "../shared/json-pane";
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
      <p
        className={cn(
          "text-[13px] leading-relaxed text-muted-foreground",
          isFa && "font-fa-label",
        )}
      >
        {t.utilities.extractHint}
      </p>

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
            </span>
            <div className="flex gap-1.5">
              <WorkbenchChipButton
                onClick={() => setSelected(available)}
                disabled={selected.length === available.length}
                className={cn(isFa && "font-fa-label")}
              >
                {t.utilities.fieldsSelectAll}
              </WorkbenchChipButton>
              <WorkbenchChipButton
                onClick={() => setSelected([])}
                disabled={selected.length === 0}
                className={cn(isFa && "font-fa-label")}
              >
                {t.utilities.fieldsClear}
              </WorkbenchChipButton>
            </div>
          </div>

          <ul
            className="flex max-h-48 flex-wrap gap-1.5 overflow-y-auto"
            aria-label={t.utilities.fieldsLabel}
          >
            {available.map((path) => {
              const on = selected.includes(path);
              return (
                <li key={path}>
                  <WorkbenchCheckChip
                    checked={on}
                    onClick={() => toggle(path)}
                  >
                    <code
                      className={cn(
                        "truncate font-mono text-[12px]",
                        on ? "text-foreground" : "text-muted-foreground",
                      )}
                      dir="ltr"
                    >
                      {path}
                    </code>
                  </WorkbenchCheckChip>
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
