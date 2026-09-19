"use client";

import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { cn } from "@/lib/utils";
import { EmptyState } from "../shared/empty-state";
import { useWorkbench } from "../workbench-context";
import { JsonTree, type TreeExpandMode } from "./json-tree";

type TreeExpandToggleProps = {
  mode: TreeExpandMode;
  onChange: (mode: TreeExpandMode) => void;
};

export function TreeExpandToggle({ mode, onChange }: TreeExpandToggleProps) {
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
          ["expand", t.actions.expandAll],
          ["collapse", t.actions.collapseAll],
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

type TreeToolProps = {
  expandMode: TreeExpandMode;
};

export function TreeTool({ expandMode }: TreeToolProps) {
  const { dict } = useUiLocale();
  const t = dict.jsonWorkbench;
  const { source, parsed } = useWorkbench();

  if (parsed.ok) {
    return (
      <JsonTree
        value={parsed.value}
        expandMode={expandMode}
        copyPathLabel={t.actions.copyPath}
        copyValueLabel={t.actions.copyValue}
        typeLabels={t.types}
      />
    );
  }

  return (
    <EmptyState
      title={t.tree.idleTitle}
      body={
        !source.trim() ? t.source.needJson : t.source.fixFirst
      }
    />
  );
}
