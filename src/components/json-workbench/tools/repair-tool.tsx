"use client";

import { useId, useMemo } from "react";
import { CopyButton } from "@/components/docs/copy-button";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import {
  repairJson,
  type RepairFixId,
  type RepairResult,
} from "@/lib/json-workbench/repair";
import { cn } from "@/lib/utils";
import { EmptyState } from "../shared/empty-state";
import { JsonPane } from "../shared/json-pane";
import { ParseError } from "../shared/parse-error";
import { useWorkbench } from "../workbench-context";

export function RepairTool() {
  const { dict, locale } = useUiLocale();
  const t = dict.jsonWorkbench;
  const isFa = locale === "fa";
  const { source } = useWorkbench();
  const outputId = useId();

  const result = useMemo<RepairResult | null>(() => {
    if (!source.trim()) return null;
    return repairJson(source);
  }, [source]);

  const output = result?.ok ? result.text : "";
  const alreadyValid = result?.ok === true && result.alreadyValid;
  const repaired = result?.ok === true && !result.alreadyValid;

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-[var(--request)]/25 bg-[var(--request-fill)]/10 px-3 py-2.5">
        <p
          className={cn(
            "text-[13px] font-medium text-foreground",
            isFa && "font-fa-label",
          )}
        >
          {t.utilities.repairHint}
        </p>
        <p
          className={cn(
            "mt-1 text-[12.5px] leading-relaxed text-muted-foreground",
            isFa && "font-fa-label",
          )}
        >
          {t.utilities.repairUse}
        </p>
      </div>

      {!source.trim() ? (
        <EmptyState
          title={t.utilities.repairIdleTitle}
          body={t.source.needJson}
        />
      ) : null}

      {result && !result.ok ? (
        <div className="space-y-2">
          <p
            className={cn(
              "text-[13px] font-medium text-destructive",
              isFa && "font-fa-label",
            )}
          >
            {t.utilities.repairFailedTitle}
          </p>
          <ParseError
            message={result.message}
            line={result.line}
            column={result.column}
            position={result.position}
          />
          {result.fixes.length > 0 ? (
            <FixChips
              fixes={result.fixes}
              labels={t.utilities.repairFixes}
              isFa={isFa}
              tone="muted"
            />
          ) : null}
        </div>
      ) : null}

      {alreadyValid ? (
        <p
          role="status"
          className={cn(
            "rounded-md border border-border bg-muted/40 px-3 py-2.5 text-[13px] text-foreground",
            isFa && "font-fa-label",
          )}
        >
          {t.utilities.repairAlreadyValid}
        </p>
      ) : null}

      {repaired ? (
        <div className="space-y-2">
          <p
            role="status"
            className={cn(
              "rounded-md border border-border bg-muted/40 px-3 py-2.5 text-[13px] text-foreground",
              isFa && "font-fa-label",
            )}
          >
            {t.utilities.repairApplied}
          </p>
          <FixChips
            fixes={result.fixes}
            labels={t.utilities.repairFixes}
            isFa={isFa}
            tone="accent"
          />
        </div>
      ) : null}

      {output ? (
        <JsonPane
          id={outputId}
          label={
            repaired ? t.utilities.repairPreview : t.labels.output
          }
          tone="output"
          value={output}
          onChange={() => {}}
          readOnly
          headerAction={
            <CopyButton value={output} label={dict.common.copy} />
          }
        />
      ) : null}
    </div>
  );
}

function FixChips({
  fixes,
  labels,
  isFa,
  tone,
}: {
  fixes: RepairFixId[];
  labels: Record<RepairFixId, string>;
  isFa: boolean;
  tone: "accent" | "muted";
}) {
  if (fixes.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {fixes.map((id) => (
        <li
          key={id}
          className={cn(
            "rounded-md border px-2 py-0.5 text-[11.5px] font-medium",
            isFa && "font-fa-label",
            tone === "accent"
              ? "border-[var(--request)]/30 bg-[var(--request-fill)]/20 text-foreground"
              : "border-border bg-muted/40 text-muted-foreground",
          )}
        >
          {labels[id] ?? id}
        </li>
      ))}
    </ul>
  );
}
