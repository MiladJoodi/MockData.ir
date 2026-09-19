"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CopyButton } from "@/components/docs/copy-button";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { queryJsonPath } from "@/lib/json-workbench/jsonpath";
import { formatJson } from "@/lib/json-workbench/parse";
import { cn } from "@/lib/utils";
import { EmptyState } from "../shared/empty-state";
import { JsonPane } from "../shared/json-pane";
import { useWorkbench } from "../workbench-context";

const EXAMPLES = [
  "$.name",
  "$.skills[*]",
  "$.address.city",
  "$",
] as const;

type ResultState =
  | { status: "idle" }
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "ready"; output: string; count: number };

export function JsonPathTool() {
  const { dict } = useUiLocale();
  const t = dict.jsonWorkbench;
  const { source, parsed } = useWorkbench();
  const pathId = useId();
  const outputId = useId();
  const last = useRef("");

  const [path, setPath] = useState("$.name");
  const [result, setResult] = useState<ResultState>({ status: "idle" });

  function runQuery(nextPath = path) {
    if (!parsed.ok) {
      setResult({ status: "idle" });
      return;
    }
    const queried = queryJsonPath(parsed.value, nextPath);
    if (!queried.ok) {
      setResult({
        status: "error",
        message:
          queried.message === "Empty JSONPath expression"
            ? t.jsonpath.emptyPath
            : queried.message,
      });
      return;
    }
    if (!queried.values.length) {
      setResult({ status: "empty" });
      return;
    }
    const output =
      queried.values.length === 1
        ? formatJson(queried.values[0])
        : formatJson(queried.values);
    setResult({
      status: "ready",
      output,
      count: queried.values.length,
    });
  }

  useEffect(() => {
    const key = `${source}::${path}`;
    if (last.current === key) return;
    last.current = key;
    if (parsed.ok) runQuery(path);
    else setResult({ status: "idle" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, parsed.ok, path]);

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-border bg-muted/40 px-3 py-2.5">
        <p className="mb-1 text-[12px] font-medium text-foreground">
          {t.jsonpath.hintTitle}
        </p>
        <p className="mb-2 text-[12.5px] leading-relaxed text-muted-foreground">
          {t.jsonpath.whatIs}
        </p>
        <div className="flex flex-wrap justify-start gap-1.5" dir="ltr">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setPath(ex)}
              className={cn(
                "rounded-md border px-2 py-1 text-start font-mono text-[11.5px] transition-colors",
                path === ex
                  ? "border-[var(--request)] bg-[var(--request-fill)]/15 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-[12px] font-medium text-muted-foreground">
          {t.labels.jsonpath}
        </span>
        <input
          id={pathId}
          value={path}
          onChange={(e) => setPath(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") runQuery();
          }}
          className="h-9 w-full rounded-md border border-border bg-background px-2.5 font-mono text-[13px] outline-none focus-visible:border-[var(--request)]/50"
          dir="ltr"
          spellCheck={false}
        />
      </label>

      {result.status === "error" ? (
        <p className="text-[13px] text-destructive">{result.message}</p>
      ) : null}
      {result.status === "empty" ? (
        <p className="text-[13px] text-muted-foreground">
          {t.jsonpath.noResults}
        </p>
      ) : null}

      {result.status === "ready" ? (
        <JsonPane
          id={outputId}
          label={t.labels.result.replace("{count}", String(result.count))}
          tone="output"
          value={result.output}
          onChange={() => {}}
          readOnly
          headerAction={
            <CopyButton value={result.output} label={dict.common.copy} />
          }
        />
      ) : (
        <EmptyState
          title={t.jsonpath.idleTitle}
          body={
            !source.trim()
              ? t.source.needJson
              : !parsed.ok
                ? t.source.fixFirst
                : t.jsonpath.idleBody
          }
        />
      )}
    </div>
  );
}
