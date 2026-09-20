"use client";

import { useUiLocale } from "@/components/providers/ui-locale-provider";
import {
  toolsByCategory,
  type ToolId,
  type ToolMeta,
} from "@/lib/json-workbench/types";
import { cn } from "@/lib/utils";

type Props = {
  activeId: ToolId;
  onSelect: (id: ToolId) => void;
};

export function ToolNav({ activeId, onSelect }: Props) {
  const { dict, locale } = useUiLocale();
  const t = dict.jsonWorkbench;
  const isFa = locale === "fa";
  const core = toolsByCategory("core");
  const rest = [
    ...toolsByCategory("transform"),
    ...toolsByCategory("utility"),
  ];

  return (
    <nav className="space-y-2" aria-label={t.toolNavLabel}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <p
          className={cn(
            "shrink-0 text-[13px] font-semibold text-foreground",
            isFa && "font-fa-label",
          )}
        >
          {t.source.pickAction}
        </p>
        <ul className="flex flex-wrap justify-start gap-1.5">
          {core.map((tool) => (
            <ToolChip
              key={tool.id}
              tool={tool}
              active={tool.id === activeId}
              onSelect={onSelect}
              label={
                t.tools[tool.labelKey as keyof typeof t.tools] ?? tool.labelKey
              }
              isFa={isFa}
            />
          ))}
        </ul>
      </div>

      {rest.length > 0 ? (
        <ul className="flex flex-wrap justify-start gap-1.5">
          {rest.map((tool) => (
            <ToolChip
              key={tool.id}
              tool={tool}
              active={tool.id === activeId}
              onSelect={onSelect}
              label={
                t.tools[tool.labelKey as keyof typeof t.tools] ?? tool.labelKey
              }
              isFa={isFa}
            />
          ))}
        </ul>
      ) : null}
    </nav>
  );
}

function ToolChip({
  tool,
  active,
  onSelect,
  label,
  isFa,
}: {
  tool: ToolMeta;
  active: boolean;
  onSelect: (id: ToolId) => void;
  label: string;
  isFa: boolean;
}) {
  return (
    <li>
      <button
        type="button"
        aria-current={active ? "true" : undefined}
        aria-pressed={active}
        onClick={() => onSelect(tool.id)}
        className={cn(
          "inline-flex h-8 items-center rounded-full px-3 text-[12.5px] transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--request)]/45",
          isFa && "font-fa-label",
          active
            ? "border border-[var(--request)]/40 bg-[var(--request)]/15 font-medium text-foreground"
            : "border border-border bg-card text-foreground hover:border-[var(--request)]/40 hover:bg-[var(--surface-hover)]",
        )}
      >
        {label}
      </button>
    </li>
  );
}
