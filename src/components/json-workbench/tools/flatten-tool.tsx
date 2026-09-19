"use client";

import { useId, useMemo } from "react";
import { CopyButton } from "@/components/docs/copy-button";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { flattenJson } from "@/lib/json-workbench/flatten";
import { formatJson } from "@/lib/json-workbench/parse";
import { cn } from "@/lib/utils";
import { EmptyState } from "../shared/empty-state";
import { JsonPane } from "../shared/json-pane";
import { useWorkbench } from "../workbench-context";

export function FlattenTool() {
  const { dict, locale } = useUiLocale();
  const t = dict.jsonWorkbench;
  const isFa = locale === "fa";
  const { source, parsed } = useWorkbench();
  const outputId = useId();

  const output = useMemo(() => {
    if (!parsed.ok) return "";
    return formatJson(flattenJson(parsed.value));
  }, [parsed]);

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-[var(--request)]/25 bg-[var(--request-fill)]/10 px-3 py-2.5">
        <p
          className={cn(
            "text-[13px] font-medium text-foreground",
            isFa && "font-fa-label",
          )}
        >
          {t.utilities.flattenHint}
        </p>
        <p
          className={cn(
            "mt-1 text-[12.5px] leading-relaxed text-muted-foreground",
            isFa && "font-fa-label",
          )}
        >
          {t.utilities.flattenUse}
        </p>
      </div>

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
          title={t.utilities.flattenIdleTitle}
          body={
            !source.trim()
              ? t.source.needJson
              : !parsed.ok
                ? t.source.fixFirst
                : t.utilities.flattenIdleBody
          }
        />
      )}
    </div>
  );
}
