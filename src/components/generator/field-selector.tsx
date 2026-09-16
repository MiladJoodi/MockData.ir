"use client";

import type { GeneratorFieldDef } from "@/lib/generator/types";
import { cn } from "@/lib/utils";

export function FieldSelector({
  fields,
  selected,
  onToggle,
  fieldLabels,
  legend,
  isFa,
}: {
  fields: GeneratorFieldDef[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  fieldLabels: Record<string, string>;
  legend: string;
  isFa: boolean;
}) {
  return (
    <fieldset>
      <legend
        className={cn(
          "mb-2.5 text-[13px] font-medium text-foreground",
          isFa && "font-fa-label",
        )}
      >
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {fields.map((field) => {
          const checked = selected.has(field.id);
          return (
            <button
              key={field.id}
              type="button"
              aria-pressed={checked}
              onClick={() => onToggle(field.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12px] transition-colors",
                checked
                  ? "border-[var(--request)]/45 bg-[var(--request)]/15 text-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground",
                isFa && "font-fa-label",
              )}
            >
              {fieldLabels[field.id] ?? field.id}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
