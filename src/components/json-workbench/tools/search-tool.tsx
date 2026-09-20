"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { formatJson } from "@/lib/json-workbench/parse";
import {
  replaceInJson,
  searchJson,
  type SearchMatch,
} from "@/lib/json-workbench/search";
import { cn } from "@/lib/utils";
import { EmptyState } from "../shared/empty-state";
import { workbenchGhostBtn } from "../shared/workbench-toolbar";
import { useWorkbench } from "../workbench-context";

export function SearchTool() {
  const { dict } = useUiLocale();
  const t = dict.jsonWorkbench;
  const { source, parsed, setSource } = useWorkbench();
  const queryId = useId();
  const replaceId = useId();
  const last = useRef("");

  const [query, setQuery] = useState("Tehran");
  const [replacement, setReplacement] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [matches, setMatches] = useState<SearchMatch[] | null>(null);
  const [replaceNote, setReplaceNote] = useState<string | null>(null);

  const activeMatch = matches && matches.length ? matches[activeIndex] : null;

  const matchSummary = useMemo(() => {
    if (!matches) return null;
    if (!matches.length) return t.search.noMatches;
    return t.search.matchCount
      .replace("{current}", String(activeIndex + 1))
      .replace("{total}", String(matches.length));
  }, [matches, activeIndex, t.search]);

  function runSearch() {
    setReplaceNote(null);
    if (!parsed.ok) {
      setMatches(null);
      return;
    }
    if (!query.trim()) {
      setMatches([]);
      setActiveIndex(0);
      return;
    }
    const found = searchJson(parsed.value, query);
    setMatches(found);
    setActiveIndex(0);
  }

  useEffect(() => {
    const key = `${source}::${query}`;
    if (last.current === key) return;
    last.current = key;
    if (parsed.ok && query.trim()) runSearch();
    else if (!parsed.ok) setMatches(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, parsed.ok, query]);

  function goPrev() {
    if (!matches?.length) return;
    setActiveIndex((i) => (i - 1 + matches.length) % matches.length);
  }

  function goNext() {
    if (!matches?.length) return;
    setActiveIndex((i) => (i + 1) % matches.length);
  }

  function applyReplace(all: boolean) {
    setReplaceNote(null);
    if (!parsed.ok || !query.trim()) return;
    const result = replaceInJson(parsed.value, query, replacement, { all });
    const next = formatJson(result.value);
    setSource(next);
    const found = searchJson(result.value, query);
    setMatches(found);
    setActiveIndex(0);
    setReplaceNote(
      t.search.replacedCount.replace("{count}", String(result.count)),
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-[12px] font-medium text-muted-foreground">
            {t.search.query}
          </span>
          <input
            id={queryId}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runSearch();
            }}
            className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
            dir="auto"
          />
        </label>
        <label className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-[12px] font-medium text-muted-foreground">
            {t.search.replaceWith}
          </span>
          <input
            id={replaceId}
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-[13px] outline-none focus-visible:border-[var(--request)]/50"
            dir="auto"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={workbenchGhostBtn}
            onClick={() => applyReplace(false)}
            disabled={!query.trim() || !parsed.ok}
          >
            {t.actions.replace}
          </button>
          <button
            type="button"
            className={workbenchGhostBtn}
            onClick={() => applyReplace(true)}
            disabled={!query.trim() || !parsed.ok}
          >
            {t.actions.replaceAll}
          </button>
        </div>
      </div>

      {replaceNote ? (
        <p className="text-[13px] text-muted-foreground">{replaceNote}</p>
      ) : null}

      <div className="flex min-h-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[12px] font-medium text-[var(--response)]">
            {t.labels.matches}
          </p>
          {matches && matches.length > 0 ? (
            <div className="flex items-center gap-1">
              <span className="text-[12px] text-muted-foreground">
                {matchSummary}
              </span>
              <button
                type="button"
                className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-[var(--surface-hover)]"
                aria-label={t.actions.prevMatch}
                onClick={goPrev}
              >
                <ChevronUp className="size-3.5" aria-hidden />
              </button>
              <button
                type="button"
                className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-[var(--surface-hover)]"
                aria-label={t.actions.nextMatch}
                onClick={goNext}
              >
                <ChevronDown className="size-3.5" aria-hidden />
              </button>
            </div>
          ) : matches ? (
            <span className="text-[12px] text-muted-foreground">
              {matchSummary}
            </span>
          ) : null}
        </div>

        {!parsed.ok && source.trim() ? (
          <EmptyState title={t.search.errorTitle} body={t.source.fixFirst} />
        ) : matches === null ? (
          <EmptyState
            title={t.search.idleTitle}
            body={!source.trim() ? t.source.needJson : t.search.idleBody}
          />
        ) : matches.length === 0 ? (
          <EmptyState
            title={t.search.noMatches}
            body={t.search.noMatchesBody}
          />
        ) : (
          <ul
            className="max-h-[min(28rem,50vh)] space-y-1 overflow-auto rounded-md border border-border bg-card p-1.5"
            role="listbox"
            aria-label={t.labels.matches}
          >
            {matches.map((m, i) => (
              <li key={m.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === activeIndex}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "flex w-full flex-col gap-0.5 rounded-md px-2.5 py-2 text-start transition-colors",
                    i === activeIndex
                      ? "bg-[var(--request)]/15"
                      : "hover:bg-[var(--surface-hover)]",
                  )}
                >
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={cn(
                        "rounded px-1 py-px text-[10px] font-medium uppercase tracking-wide",
                        m.kind === "key"
                          ? "bg-muted text-muted-foreground"
                          : "bg-[var(--response)]/15 text-[var(--response)]",
                      )}
                    >
                      {m.kind === "key"
                        ? t.search.kindKey
                        : t.search.kindValue}
                    </span>
                    <code
                      className="font-mono text-[12px] text-foreground"
                      dir="ltr"
                    >
                      {m.path}
                    </code>
                  </span>
                  <span
                    className="truncate font-mono text-[12px] text-muted-foreground"
                    dir="ltr"
                  >
                    {m.preview}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {activeMatch ? (
          <p className="text-[12px] text-muted-foreground" dir="ltr">
            {t.search.activeHint
              .replace(
                "{kind}",
                activeMatch.kind === "key"
                  ? t.search.kindKey
                  : t.search.kindValue,
              )
              .replace("{path}", activeMatch.path)}
          </p>
        ) : null}
      </div>
    </div>
  );
}
