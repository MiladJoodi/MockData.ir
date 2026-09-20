"use client";

import { useEffect, useId, useMemo, useState } from "react";
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
import { WorkbenchChipButton } from "../shared/workbench-check-chip";
import { useWorkbench } from "../workbench-context";

export function RepairTool() {
  const { dict, locale } = useUiLocale();
  const t = dict.jsonWorkbench;
  const isFa = locale === "fa";
  const { source, useAsSource } = useWorkbench();
  const outputId = useId();
  const [justApplied, setJustApplied] = useState(false);

  const result = useMemo<RepairResult | null>(() => {
    if (!source.trim()) return null;
    return repairJson(source);
  }, [source]);

  useEffect(() => {
    setJustApplied(false);
  }, [source]);

  const output = result?.ok ? result.text : "";
  const alreadyValid = result?.ok === true && result.alreadyValid;
  const repaired = result?.ok === true && !result.alreadyValid;
  const failed = result != null && !result.ok;

  function applyToSource() {
    if (!output) return;
    useAsSource(output);
    setJustApplied(true);
  }

  return (
    <div className="space-y-3">
      <p
        className={cn(
          "text-[13px] leading-relaxed text-muted-foreground",
          isFa && "font-fa-label",
        )}
      >
        {t.utilities.repairHint}
      </p>

      {!source.trim() ? (
        <EmptyState
          title={t.utilities.repairIdleTitle}
          body={t.source.needJson}
        />
      ) : null}

      {failed ? (
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
            />
          ) : null}
        </div>
      ) : null}

      {repaired ? (
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <p
              role="status"
              className={cn(
                "text-[13px] text-[var(--response)]",
                isFa && "font-fa-label",
              )}
            >
              {t.utilities.repairApplied}
            </p>
            <WorkbenchChipButton
              onClick={applyToSource}
              className={cn(
                "border-[var(--response)]/35 text-foreground",
                isFa && "font-fa-label",
              )}
            >
              {t.source.useResult}
            </WorkbenchChipButton>
          </div>
          <FixChips
            fixes={result.fixes}
            labels={t.utilities.repairFixes}
            isFa={isFa}
          />
        </div>
      ) : null}

      {alreadyValid ? (
        <p
          role="status"
          className={cn(
            "text-[13px] text-muted-foreground",
            isFa && "font-fa-label",
          )}
        >
          {justApplied
            ? t.utilities.repairAppliedToSource
            : t.utilities.repairAlreadyValid}
        </p>
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
}: {
  fixes: RepairFixId[];
  labels: Record<RepairFixId, string>;
  isFa: boolean;
}) {
  if (fixes.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {fixes.map((id) => (
        <li
          key={id}
          className={cn(
            "rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[11.5px] text-muted-foreground",
            isFa && "font-fa-label",
          )}
        >
          {labels[id] ?? id}
        </li>
      ))}
    </ul>
  );
}
