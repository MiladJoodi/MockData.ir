"use client";

import { useId, useMemo } from "react";
import { CopyButton } from "@/components/docs/copy-button";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { formatJson } from "@/lib/json-workbench/parse";
import { cn } from "@/lib/utils";
import { EmptyState } from "../shared/empty-state";
import { JsonPane } from "../shared/json-pane";
import { useWorkbench } from "../workbench-context";

type Mode = "format" | "minify";

type FormatModeToggleProps = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

export function FormatModeToggle({ mode, onChange }: FormatModeToggleProps) {
  const { dict, locale } = useUiLocale();
  const t = dict.jsonWorkbench;
  const isFa = locale === "fa";

  return (
    <div
      className={cn(
        "inline-flex shrink-0 rounded-md border border-border p-0.5",
        isFa && "font-fa-label",
      )}
    >
      {(
        [
          ["format", t.actions.format],
          ["minify", t.actions.minify],
        ] as const
      ).map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            "h-7 rounded px-2.5 text-[12px] transition-colors",
            mode === id
              ? "bg-[var(--request-fill)]/20 font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

type FormatToolProps = {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
};

export function FormatTool({ mode, onModeChange }: FormatToolProps) {
  const { dict } = useUiLocale();
  const t = dict.jsonWorkbench;
  const { source, parsed } = useWorkbench();
  const outputId = useId();

  const output = useMemo(() => {
    if (!parsed.ok) return "";
    return mode === "minify"
      ? JSON.stringify(parsed.value)
      : formatJson(parsed.value);
  }, [parsed, mode]);

  if (!output) {
    return (
      <EmptyState
        title={t.empty.formatTitle}
        body={
          !source.trim()
            ? t.source.needJson
            : !parsed.ok
              ? t.source.fixFirst
              : t.empty.formatBody
        }
      />
    );
  }

  return (
    <JsonPane
      id={outputId}
      label={t.labels.output}
      tone="output"
      value={output}
      onChange={() => {}}
      readOnly
      headerAction={<CopyButton value={output} label={dict.common.copy} />}
    />
  );
}
