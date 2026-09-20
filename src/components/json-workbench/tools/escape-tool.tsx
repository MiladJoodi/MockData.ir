"use client";

import { useId, useMemo } from "react";
import { CopyButton } from "@/components/docs/copy-button";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { escapeJson } from "@/lib/json-workbench/escape";
import { cn } from "@/lib/utils";
import { CodeOutputPane } from "../shared/code-output-pane";
import { EmptyState } from "../shared/empty-state";
import { useWorkbench } from "../workbench-context";

export function EscapeTool() {
  const { dict, locale } = useUiLocale();
  const t = dict.jsonWorkbench;
  const isFa = locale === "fa";
  const { source, parsed } = useWorkbench();
  const outputId = useId();

  const output = useMemo(() => {
    if (!parsed.ok) return "";
    return escapeJson(parsed.value);
  }, [parsed]);

  return (
    <div className="space-y-3">
      <p
        className={cn(
          "text-[13px] leading-relaxed text-muted-foreground",
          isFa && "font-fa-label",
        )}
      >
        {t.utilities.escapeHint}
      </p>

      {output ? (
        <CodeOutputPane
          id={outputId}
          label={t.labels.output}
          tone="output"
          value={output}
          language="plain"
          headerAction={
            <CopyButton value={output} label={dict.common.copy} />
          }
        />
      ) : (
        <EmptyState
          title={t.utilities.escapeIdleTitle}
          body={
            !source.trim()
              ? t.source.needJson
              : !parsed.ok
                ? t.source.fixFirst
                : t.utilities.escapeIdleBody
          }
        />
      )}
    </div>
  );
}
