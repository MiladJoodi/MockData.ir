"use client";

import { useId, useMemo } from "react";
import { CopyButton } from "@/components/docs/copy-button";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { formatJson } from "@/lib/json-workbench/parse";
import {
  sortKeys,
  type SortDirection,
} from "@/lib/json-workbench/sort-keys";
import { cn } from "@/lib/utils";
import { EmptyState } from "../shared/empty-state";
import { JsonPane } from "../shared/json-pane";
import { useWorkbench } from "../workbench-context";

type SortDirectionToggleProps = {
  direction: SortDirection;
  onChange: (direction: SortDirection) => void;
};

export function SortDirectionToggle({
  direction,
  onChange,
}: SortDirectionToggleProps) {
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
          ["asc", t.utilities.sortAsc],
          ["desc", t.utilities.sortDesc],
        ] as const
      ).map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            "h-7 rounded px-2.5 text-[12px] transition-colors",
            direction === id
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

type SortKeysToolProps = {
  direction: SortDirection;
};

export function SortKeysTool({ direction }: SortKeysToolProps) {
  const { dict } = useUiLocale();
  const t = dict.jsonWorkbench;
  const { source, parsed } = useWorkbench();
  const outputId = useId();

  const output = useMemo(() => {
    if (!parsed.ok) return "";
    return formatJson(sortKeys(parsed.value, direction));
  }, [parsed, direction]);

  if (!output) {
    return (
      <EmptyState
        title={t.utilities.sortIdleTitle}
        body={
          !source.trim()
            ? t.source.needJson
            : !parsed.ok
              ? t.source.fixFirst
              : t.utilities.sortIdleBody
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
