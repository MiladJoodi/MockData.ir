"use client";

import { useUiLocale } from "@/components/providers/ui-locale-provider";
import {
  CONVERT_MODE_LABEL_KEY,
  CONVERT_MODES,
  type ConvertMode,
} from "@/lib/json-workbench/types";
import { cn } from "@/lib/utils";
import { CsvTool } from "./csv-tool";
import { ToSchemaTool } from "./to-schema-tool";
import { ToTypescriptTool } from "./to-typescript-tool";
import { ToZodTool } from "./to-zod-tool";
import { YamlTool } from "./yaml-tool";

type ConvertModeToggleProps = {
  mode: ConvertMode;
  onChange: (mode: ConvertMode) => void;
};

export function ConvertModeToggle({ mode, onChange }: ConvertModeToggleProps) {
  const { dict, locale } = useUiLocale();
  const t = dict.jsonWorkbench;
  const isFa = locale === "fa";

  return (
    <div
      className={cn(
        "inline-flex max-w-[min(100%,22rem)] shrink-0 flex-wrap justify-end rounded-md border border-border p-0.5 sm:max-w-none",
        isFa && "font-fa-label",
      )}
    >
      {CONVERT_MODES.map((id) => {
        const labelKey = CONVERT_MODE_LABEL_KEY[id];
        const label = t.tools[labelKey as keyof typeof t.tools] ?? id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "h-7 rounded px-2 text-[11.5px] transition-colors sm:px-2.5 sm:text-[12px]",
              mode === id
                ? "bg-[var(--request)]/15 font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

type ConvertToolProps = {
  mode: ConvertMode;
};

export function ConvertTool({ mode }: ConvertToolProps) {
  switch (mode) {
    case "to-typescript":
      return <ToTypescriptTool />;
    case "to-zod":
      return <ToZodTool />;
    case "to-schema":
      return <ToSchemaTool />;
    case "yaml":
      return <YamlTool />;
    case "csv":
      return <CsvTool />;
    default:
      return <ToTypescriptTool />;
  }
}
