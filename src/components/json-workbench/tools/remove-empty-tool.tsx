"use client";

import { useId, useMemo, useState } from "react";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { formatJson } from "@/lib/json-workbench/parse";
import {
  removeEmpty,
  type RemoveEmptyOptions,
} from "@/lib/json-workbench/remove-empty";
import { cn } from "@/lib/utils";
import { EmptyState } from "../shared/empty-state";
import { JsonPane } from "../shared/json-pane";
import { WorkbenchCheckChip } from "../shared/workbench-check-chip";
import { useWorkbench } from "../workbench-context";
import { CopyButton } from "@/components/docs/copy-button";

type OptKey = keyof RemoveEmptyOptions;

export function RemoveEmptyTool() {
  const { dict, locale } = useUiLocale();
  const t = dict.jsonWorkbench;
  const isFa = locale === "fa";
  const { source, parsed } = useWorkbench();
  const outputId = useId();

  const [opts, setOpts] = useState<Required<RemoveEmptyOptions>>({
    nulls: true,
    emptyStrings: true,
    emptyArrays: true,
    emptyObjects: true,
  });

  function toggle(key: OptKey) {
    setOpts((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const checks: {
    key: OptKey;
    code: string;
    label: string;
  }[] = [
    { key: "nulls", code: "null", label: t.utilities.removeNullLabel },
    {
      key: "emptyStrings",
      code: '""',
      label: t.utilities.removeEmptyStringLabel,
    },
    {
      key: "emptyArrays",
      code: "[]",
      label: t.utilities.removeEmptyArrayLabel,
    },
    {
      key: "emptyObjects",
      code: "{}",
      label: t.utilities.removeEmptyObjectLabel,
    },
  ];

  const output = useMemo(() => {
    if (!parsed.ok) return "";
    return formatJson(removeEmpty(parsed.value, opts));
  }, [parsed, opts]);

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <ul
          className="flex flex-wrap gap-1.5"
          aria-label={t.utilities.removeOptions}
        >
          {checks.map(({ key, code, label }) => {
            const on = opts[key];
            return (
              <li key={key}>
                <WorkbenchCheckChip
                  checked={on}
                  onClick={() => toggle(key)}
                  title={label}
                  className={cn(isFa && "font-fa-label")}
                >
                  <code
                    className={cn(
                      "font-mono text-[12px]",
                      on ? "text-foreground" : "text-muted-foreground",
                    )}
                    dir="ltr"
                  >
                    {code}
                  </code>
                  <span
                    className={cn(
                      "text-[12px]",
                      on ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                </WorkbenchCheckChip>
              </li>
            );
          })}
        </ul>
        <p
          className={cn(
            "text-[12px] text-muted-foreground",
            isFa && "font-fa-label",
          )}
        >
          {t.utilities.removePreserveHint}
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
          title={t.utilities.removeIdleTitle}
          body={
            !source.trim()
              ? t.source.needJson
              : !parsed.ok
                ? t.source.fixFirst
                : t.utilities.removeIdleBody
          }
        />
      )}
    </div>
  );
}
