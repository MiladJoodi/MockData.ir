"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import {
  removeEmpty,
  type RemoveEmptyOptions,
} from "@/lib/json-workbench/remove-empty";
import { cn } from "@/lib/utils";
import { okJson, SimpleJsonTool } from "../shared/simple-json-tool";

type OptKey = keyof RemoveEmptyOptions;

export function RemoveEmptyTool() {
  const { dict, locale } = useUiLocale();
  const t = dict.jsonWorkbench;
  const isFa = locale === "fa";
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

  const optsKey = `${opts.nulls}-${opts.emptyStrings}-${opts.emptyArrays}-${opts.emptyObjects}`;

  return (
    <SimpleJsonTool
      key={optsKey}
      idleTitle={t.utilities.removeIdleTitle}
      idleBody={t.utilities.removeIdleBody}
      options={
        <div className="space-y-2">
          <ul
            className="flex flex-wrap gap-1.5"
            aria-label={t.utilities.removeOptions}
          >
            {checks.map(({ key, code, label }) => {
              const on = opts[key];
              return (
                <li key={key}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    onClick={() => toggle(key)}
                    title={label}
                    className={cn(
                      "inline-flex max-w-full items-center gap-1.5 rounded-md border px-2 py-1 text-start transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--request)]/45",
                      on
                        ? "border-[var(--request)]/45 bg-[var(--request-fill)]/15"
                        : "border-border bg-transparent hover:bg-[var(--surface-hover)]",
                      isFa && "font-fa-label",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-4 shrink-0 place-items-center rounded-full border",
                        on
                          ? "border-[var(--request)] bg-[var(--request)] text-white"
                          : "border-border bg-transparent text-transparent",
                      )}
                      aria-hidden
                    >
                      <Check className="size-2.5" strokeWidth={3} />
                    </span>
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
                  </button>
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
      }
      transform={(value) => okJson(removeEmpty(value, opts))}
    />
  );
}
