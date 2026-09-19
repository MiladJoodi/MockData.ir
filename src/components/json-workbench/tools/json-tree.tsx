"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CopyButton } from "@/components/docs/copy-button";
import {
  jsonValueType,
  type JsonValueType,
} from "@/lib/json-workbench/parse";
import { cn } from "@/lib/utils";

export type TreeExpandMode = "expand" | "collapse";

type Props = {
  value: unknown;
  expandMode: TreeExpandMode;
  copyPathLabel: string;
  copyValueLabel: string;
  typeLabels: Record<JsonValueType, string>;
};

export function JsonTree({
  value,
  expandMode,
  copyPathLabel,
  copyValueLabel,
  typeLabels,
}: Props) {
  const expandable = useMemo(() => collectExpandablePaths(value, "$"), [value]);
  const [open, setOpen] = useState<Set<string>>(() => new Set(["$"]));

  useEffect(() => {
    if (expandMode === "expand") {
      setOpen(new Set(expandable));
    } else {
      setOpen(new Set(["$"]));
    }
  }, [expandMode, expandable]);

  function toggle(path: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  return (
    <div className="code-pane max-h-[min(36rem,65vh)] overflow-auto rounded-md border border-border bg-[var(--vscode-bg)] p-2 font-mono text-[12.5px] leading-6 sm:p-3">
      <div dir="ltr" role="tree">
        <TreeNode
          name={null}
          value={value}
          path="$"
          depth={0}
          open={open}
          onToggle={toggle}
          copyPathLabel={copyPathLabel}
          copyValueLabel={copyValueLabel}
          typeLabels={typeLabels}
        />
      </div>
    </div>
  );
}

function TreeNode({
  name,
  value,
  path,
  depth,
  open,
  onToggle,
  copyPathLabel,
  copyValueLabel,
  typeLabels,
}: {
  name: string | null;
  value: unknown;
  path: string;
  depth: number;
  open: Set<string>;
  onToggle: (path: string) => void;
  copyPathLabel: string;
  copyValueLabel: string;
  typeLabels: Record<JsonValueType, string>;
}) {
  const type = jsonValueType(value);
  const isContainer = type === "object" || type === "array";
  const entries = isContainer ? getEntries(value) : [];
  const isOpen = open.has(path);
  const preview =
    type === "object"
      ? `{${entries.length}}`
      : type === "array"
        ? `[${entries.length}]`
        : null;

  return (
    <div
      role="treeitem"
      aria-selected={false}
      aria-expanded={isContainer ? isOpen : undefined}
    >
      <div
        className="group flex items-start gap-1 rounded-sm pe-1 hover:bg-white/5"
        style={{ paddingInlineStart: depth * 14 }}
      >
        {isContainer ? (
          <button
            type="button"
            className="mt-0.5 grid size-5 shrink-0 place-items-center rounded text-[var(--vscode-fg)]/70 hover:bg-white/10 hover:text-[var(--vscode-fg)]"
            aria-label={isOpen ? "Collapse" : "Expand"}
            onClick={() => onToggle(path)}
          >
            {isOpen ? (
              <ChevronDown className="size-3.5" aria-hidden />
            ) : (
              <ChevronRight className="size-3.5" aria-hidden />
            )}
          </button>
        ) : (
          <span className="inline-block size-5 shrink-0" aria-hidden />
        )}

        <div className="min-w-0 flex-1 break-all">
          {name != null ? (
            <span className="text-[var(--vscode-property)]">{name}</span>
          ) : (
            <span className="text-[var(--vscode-fg)]/55">root</span>
          )}
          <span className="text-[var(--vscode-fg)]/45">: </span>
          {isContainer ? (
            <span className="text-[var(--vscode-fg)]/55">
              {preview}
              <span className="ms-1.5 text-[10.5px] uppercase tracking-wide opacity-70">
                {typeLabels[type]}
              </span>
            </span>
          ) : (
            <>
              <PrimitiveValue value={value} type={type} />
              <span className="ms-1.5 text-[10.5px] uppercase tracking-wide text-[var(--vscode-fg)]/45">
                {typeLabels[type]}
              </span>
            </>
          )}
        </div>

        <div className="flex shrink-0 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
          <CopyButton value={path} label={copyPathLabel} className="size-6" />
          <CopyButton
            value={stringifyForCopy(value)}
            label={copyValueLabel}
            className="size-6"
          />
        </div>
      </div>

      {isContainer && isOpen
        ? entries.map(([childName, childValue]) => {
            const childPath = childPathFor(path, childName, type === "array");
            return (
              <TreeNode
                key={childPath}
                name={childName}
                value={childValue}
                path={childPath}
                depth={depth + 1}
                open={open}
                onToggle={onToggle}
                copyPathLabel={copyPathLabel}
                copyValueLabel={copyValueLabel}
                typeLabels={typeLabels}
              />
            );
          })
        : null}
    </div>
  );
}

function PrimitiveValue({
  value,
  type,
}: {
  value: unknown;
  type: JsonValueType;
}) {
  if (type === "string") {
    return (
      <span className="text-[var(--vscode-string)]">
        {JSON.stringify(value)}
      </span>
    );
  }
  if (type === "number") {
    return (
      <span className="text-[var(--vscode-number)]">{String(value)}</span>
    );
  }
  if (type === "boolean") {
    return (
      <span className="text-[var(--vscode-keyword)]">{String(value)}</span>
    );
  }
  return <span className="text-[var(--vscode-keyword)]">null</span>;
}

function getEntries(value: unknown): [string, unknown][] {
  if (Array.isArray(value)) {
    return value.map((item, i) => [String(i), item]);
  }
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>);
  }
  return [];
}

function childPathFor(parent: string, name: string, isArray: boolean): string {
  if (isArray) return `${parent}[${name}]`;
  if (/^[A-Za-z_$][\w$]*$/.test(name)) {
    return parent === "$" ? `$.${name}` : `${parent}.${name}`;
  }
  return `${parent}[${JSON.stringify(name)}]`;
}

function collectExpandablePaths(value: unknown, path: string): string[] {
  const type = jsonValueType(value);
  if (type !== "object" && type !== "array") return [];
  const paths = [path];
  for (const [name, child] of getEntries(value)) {
    paths.push(
      ...collectExpandablePaths(
        child,
        childPathFor(path, name, type === "array"),
      ),
    );
  }
  return paths;
}

function stringifyForCopy(value: unknown): string {
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2) ?? "null";
}
