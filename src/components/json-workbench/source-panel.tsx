"use client";

import { useId, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { WORKBENCH_SAMPLE_JSON } from "@/lib/json-workbench/sample";
import { cn } from "@/lib/utils";
import { JsonPane } from "./shared/json-pane";
import { ParseError } from "./shared/parse-error";
import { useWorkbench } from "./workbench-context";

type Props = {
  className?: string;
  compact?: boolean;
};

export function SourcePanel({ className, compact }: Props) {
  const { dict } = useUiLocale();
  const t = dict.jsonWorkbench;
  const { source, setSource, parsed, loadSample } = useWorkbench();
  const inputId = useId();

  const canResetSample = useMemo(
    () => source.trim() !== WORKBENCH_SAMPLE_JSON.trim(),
    [source],
  );

  return (
    <div className={cn("flex min-h-0 flex-col gap-2", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="min-w-0 text-[13px] font-semibold text-[var(--request)]">
          {t.source.title}
        </p>
        <button
          type="button"
          onClick={loadSample}
          disabled={!canResetSample}
          aria-label={t.source.sample}
          title={t.source.sample}
          className={cn(
            "inline-flex size-7 shrink-0 items-center justify-center rounded-md transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--request)]/45",
            canResetSample
              ? "text-[var(--request)] hover:bg-[var(--request-fill)]/15"
              : "cursor-default text-muted-foreground/35",
          )}
        >
          <RefreshCw className="size-3.5" aria-hidden />
        </button>
      </div>

      <JsonPane
        id={inputId}
        label={t.labels.input}
        tone="input"
        value={source}
        onChange={setSource}
        rows={compact ? 10 : 18}
      />

      {!parsed.ok && source.trim() ? (
        <ParseError
          message={
            parsed.message === "Empty input" ? t.errors.empty : parsed.message
          }
          line={parsed.line}
          column={parsed.column}
          position={parsed.position}
        />
      ) : null}

      {parsed.ok ? (
        <p className="text-[12px] text-[var(--response)]" role="status">
          {t.source.valid}
        </p>
      ) : null}
    </div>
  );
}
