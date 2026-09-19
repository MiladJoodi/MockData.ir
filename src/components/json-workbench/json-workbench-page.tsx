"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { ArrowLeft } from "lucide-react";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import {
  DEFAULT_CONVERT_MODE,
  DEFAULT_TOOL_ID,
  getToolMeta,
  resolveConvertMode,
  resolveToolId,
  type ConvertMode,
  type ToolId,
} from "@/lib/json-workbench/types";
import type { SortDirection } from "@/lib/json-workbench/sort-keys";
import { cn } from "@/lib/utils";
import { SourcePanel } from "./source-panel";
import { ToolNav } from "./tool-nav";
import { WorkbenchProvider } from "./workbench-context";
import { CompareStructureTool } from "./tools/compare-structure-tool";
import { ConvertModeToggle, ConvertTool } from "./tools/convert-tool";
import { EscapeTool } from "./tools/escape-tool";
import { ExtractTool } from "./tools/extract-tool";
import { FlattenTool } from "./tools/flatten-tool";
import { FormatModeToggle, FormatTool } from "./tools/format-tool";
import { JsonPathTool } from "./tools/jsonpath-tool";
import { OmitTool, PickTool } from "./tools/pick-omit-tool";
import { RemoveEmptyTool } from "./tools/remove-empty-tool";
import { RepairTool } from "./tools/repair-tool";
import { SearchTool } from "./tools/search-tool";
import { SortDirectionToggle, SortKeysTool } from "./tools/sort-keys-tool";
import { TreeExpandToggle, TreeTool } from "./tools/tree-tool";
import type { TreeExpandMode } from "./tools/json-tree";

type FormatMode = "format" | "minify";

const TOOL_CHANGE_EVENT = "mockdata-workbench-tool";

function readToolFromUrl(): ToolId {
  if (typeof window === "undefined") return DEFAULT_TOOL_ID;
  const raw = new URLSearchParams(window.location.search).get("tool");
  if (!raw) return DEFAULT_TOOL_ID;
  return resolveToolId(raw) ?? DEFAULT_TOOL_ID;
}

function subscribeToolUrl(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener("popstate", handler);
  window.addEventListener(TOOL_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener("popstate", handler);
    window.removeEventListener(TOOL_CHANGE_EVENT, handler);
  };
}

function ActiveWorkspace({
  id,
  formatMode,
  onFormatModeChange,
  convertMode,
  sortDirection,
  treeExpandMode,
}: {
  id: ToolId;
  formatMode: FormatMode;
  onFormatModeChange: (mode: FormatMode) => void;
  convertMode: ConvertMode;
  sortDirection: SortDirection;
  treeExpandMode: TreeExpandMode;
}) {
  switch (id) {
    case "format":
      return (
        <FormatTool mode={formatMode} onModeChange={onFormatModeChange} />
      );
    case "tree":
      return <TreeTool expandMode={treeExpandMode} />;
    case "search":
      return <SearchTool />;
    case "jsonpath":
      return <JsonPathTool />;
    case "convert":
      return <ConvertTool mode={convertMode} />;
    case "sort-keys":
      return <SortKeysTool direction={sortDirection} />;
    case "remove-empty":
      return <RemoveEmptyTool />;
    case "flatten":
      return <FlattenTool />;
    case "escape":
      return <EscapeTool />;
    case "repair":
      return <RepairTool />;
    case "extract":
      return <ExtractTool />;
    case "pick":
      return <PickTool />;
    case "omit":
      return <OmitTool />;
    case "compare-structure":
      return null;
    default:
      return (
        <FormatTool mode={formatMode} onModeChange={onFormatModeChange} />
      );
  }
}

function WorkbenchShell() {
  const { dict, locale } = useUiLocale();
  const t = dict.jsonWorkbench;
  const isFa = locale === "fa";

  const activeId = useSyncExternalStore(
    subscribeToolUrl,
    readToolFromUrl,
    () => DEFAULT_TOOL_ID,
  );
  const [formatMode, setFormatMode] = useState<FormatMode>("format");
  const [convertMode, setConvertMode] =
    useState<ConvertMode>(DEFAULT_CONVERT_MODE);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [treeExpandMode, setTreeExpandMode] =
    useState<TreeExpandMode>("collapse");

  const selectTool = useCallback((id: ToolId) => {
    const url = new URL(window.location.href);
    if (id === DEFAULT_TOOL_ID) {
      url.searchParams.delete("tool");
    } else {
      url.searchParams.set("tool", id);
    }
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
    window.dispatchEvent(new Event(TOOL_CHANGE_EVENT));
  }, []);

  // Rewrite legacy aliases (e.g. ?tool=yaml → ?tool=convert).
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("tool");
    if (!raw) return;
    const convert = resolveConvertMode(raw);
    if (convert) {
      setConvertMode(convert);
    }
    const resolved = resolveToolId(raw);
    if (resolved && resolved !== raw) {
      selectTool(resolved);
    }
  }, [selectTool]);

  const meta = getToolMeta(activeId);
  const workspaceLabel = meta
    ? (t.tools[meta.labelKey as keyof typeof t.tools] ?? meta.id)
    : t.title;
  const isCompare = activeId === "compare-structure";
  const headerTitle = isCompare ? t.tools.compareStructure : t.title;
  const headerBlurb = isCompare ? t.utilities.compareHint : t.blurb;

  return (
    <div
      className={cn(
        "mx-auto w-full min-w-0 px-4 py-8 sm:px-6 sm:py-10",
        isCompare ? "max-w-7xl" : "max-w-6xl",
      )}
    >
      <div className="mb-6 space-y-2">
        <h1
          className={cn(
            "inline-flex min-w-0 items-center gap-2.5 text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-[1.75rem]",
            isFa && "font-fa-label",
          )}
        >
          {isCompare ? (
            <button
              type="button"
              onClick={() => selectTool(DEFAULT_TOOL_ID)}
              aria-label={t.utilities.compareBack}
              title={t.utilities.compareBack}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft
                className={cn("size-5 sm:size-6", isFa && "rotate-180")}
                strokeWidth={1.75}
                aria-hidden
              />
            </button>
          ) : (
            <Link
              href="/"
              aria-label={dict.common.home}
              title={dict.common.home}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft
                className={cn("size-5 sm:size-6", isFa && "rotate-180")}
                strokeWidth={1.75}
                aria-hidden
              />
            </Link>
          )}
          <span className="truncate">{headerTitle}</span>
        </h1>
        <p
          className={cn(
            "max-w-2xl text-[14px] leading-relaxed text-muted-foreground",
            isFa && "font-fa-label",
          )}
        >
          {headerBlurb}
        </p>
      </div>

      {isCompare ? (
        <section
          id="workbench-workspace"
          className="min-w-0 rounded-lg border border-border bg-card p-3 sm:p-5"
          aria-label={workspaceLabel}
        >
          <CompareStructureTool />
        </section>
      ) : (
        <div className="space-y-5">
          <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
            <ToolNav activeId={activeId} onSelect={selectTool} />
          </div>

          <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-6">
            <div className="min-w-0 rounded-lg border border-border bg-card p-3 sm:p-4">
              <SourcePanel />
            </div>

            <section
              id="workbench-workspace"
              className="min-w-0 rounded-lg border border-border bg-card p-3 sm:p-5"
              aria-label={workspaceLabel}
            >
              <div className="mb-3 flex items-center justify-between gap-2 border-b border-border pb-2">
                <h2
                  className={cn(
                    "shrink-0 text-[14px] font-semibold text-foreground",
                    isFa && "font-fa-label",
                  )}
                >
                  {workspaceLabel}
                </h2>
                {activeId === "format" ? (
                  <FormatModeToggle
                    mode={formatMode}
                    onChange={setFormatMode}
                  />
                ) : null}
                {activeId === "tree" ? (
                  <TreeExpandToggle
                    mode={treeExpandMode}
                    onChange={setTreeExpandMode}
                  />
                ) : null}
                {activeId === "convert" ? (
                  <ConvertModeToggle
                    mode={convertMode}
                    onChange={setConvertMode}
                  />
                ) : null}
                {activeId === "sort-keys" ? (
                  <SortDirectionToggle
                    direction={sortDirection}
                    onChange={setSortDirection}
                  />
                ) : null}
              </div>
              <ActiveWorkspace
                key={activeId}
                id={activeId}
                formatMode={formatMode}
                onFormatModeChange={setFormatMode}
                convertMode={convertMode}
                sortDirection={sortDirection}
                treeExpandMode={treeExpandMode}
              />
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export function JsonWorkbenchPageContent() {
  return (
    <WorkbenchProvider>
      <WorkbenchShell />
    </WorkbenchProvider>
  );
}
