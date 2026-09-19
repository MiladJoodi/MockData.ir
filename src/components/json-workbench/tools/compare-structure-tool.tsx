"use client";

import { useEffect, useId, useMemo, useRef, useState, type UIEvent } from "react";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import {
  compareStructure,
  prettyPrintWithPaths,
  type LineHighlight,
} from "@/lib/json-workbench/compare-structure";
import { parseJson } from "@/lib/json-workbench/parse";
import { highlightCode } from "@/lib/syntax";
import { cn } from "@/lib/utils";
import { ParseError } from "../shared/parse-error";
import { useWorkbench } from "../workbench-context";

const SAMPLE_A = `{
  "name": "MockData",
  "count": 3,
  "active": true,
  "address": {
    "city": "Tehran"
  }
}`;

const SAMPLE_B = `{
  "name": "MockData",
  "count": 3,
  "role": "admin",
  "address": {
    "city": "Tehran",
    "zip": "123"
  }
}`;

function prettyText(raw: string): string | null {
  const parsed = parseJson(raw);
  if (!parsed.ok) return null;
  return prettyPrintWithPaths(parsed.value).lines.join("\n");
}

export function CompareStructureTool() {
  const { dict, locale } = useUiLocale();
  const t = dict.jsonWorkbench;
  const isFa = locale === "fa";
  const { source, setSource, secondary, setSecondary } = useWorkbench();
  const aId = useId();
  const bId = useId();
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    const a = prettyText(source.trim() ? source : SAMPLE_A) ?? SAMPLE_A;
    const b = prettyText(secondary.trim() ? secondary : SAMPLE_B) ?? SAMPLE_B;
    setSource(a);
    setSecondary(b);
  }, [source, secondary, setSource, setSecondary]);

  const parsedA = useMemo(() => parseJson(source), [source]);
  const parsedB = useMemo(() => parseJson(secondary), [secondary]);

  const result = useMemo(() => {
    if (!parsedA.ok || !parsedB.ok) return null;
    return compareStructure(parsedA.value, parsedB.value);
  }, [parsedA, parsedB]);

  const errorSide =
    source.trim() && !parsedA.ok
      ? ("a" as const)
      : secondary.trim() && !parsedB.ok
        ? ("b" as const)
        : null;
  const errorParsed =
    errorSide === "a" ? parsedA : errorSide === "b" ? parsedB : null;

  const marksA =
    result && !result.identical && source === result.sideA.text
      ? result.sideA.marks
      : null;
  const marksB =
    result && !result.identical && secondary === result.sideB.text
      ? result.sideB.marks
      : null;

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "flex flex-wrap gap-3 text-[11.5px]",
          isFa && "font-fa-label",
        )}
      >
        <Legend swatch="missing" label={t.utilities.compareMissing} />
        <Legend swatch="extra" label={t.utilities.compareExtra} />
        <Legend swatch="type-mismatch" label={t.utilities.compareType} />
      </div>

      <div className="grid min-h-[min(36rem,70vh)] min-w-0 gap-4 lg:grid-cols-2">
        <ComparePane
          id={aId}
          label={t.labels.jsonA}
          value={source}
          marks={marksA}
          onChange={setSource}
          tone="a"
        />
        <ComparePane
          id={bId}
          label={t.labels.jsonB}
          value={secondary}
          marks={marksB}
          onChange={setSecondary}
          tone="b"
        />
      </div>

      {errorParsed && !errorParsed.ok ? (
        <ParseError
          message={
            errorParsed.message === "Empty input"
              ? errorSide === "a"
                ? t.diff.emptyA
                : t.diff.emptyB
              : errorParsed.message
          }
          line={errorParsed.line}
          column={errorParsed.column}
          position={errorParsed.position}
          sideLabel={
            errorParsed.message === "Empty input"
              ? undefined
              : errorSide === "a"
                ? t.labels.jsonA
                : t.labels.jsonB
          }
        />
      ) : null}

      {result?.identical ? (
        <p
          role="status"
          className={cn(
            "rounded-md border border-border bg-muted/40 px-3 py-2.5 text-[13px] text-foreground",
            isFa && "font-fa-label",
          )}
        >
          {t.utilities.compareIdentical}
        </p>
      ) : null}
    </div>
  );
}

function ComparePane({
  id,
  label,
  value,
  marks,
  onChange,
  tone,
}: {
  id: string;
  label: string;
  value: string;
  marks: (LineHighlight | null)[] | null;
  onChange: (v: string) => void;
  tone: "a" | "b";
}) {
  const preRef = useRef<HTMLPreElement>(null);
  const [selecting, setSelecting] = useState(false);
  const lines = (value.length ? value : " ").split("\n");

  function syncScroll(e: UIEvent<HTMLTextAreaElement>) {
    const pre = preRef.current;
    if (!pre) return;
    pre.scrollTop = e.currentTarget.scrollTop;
    pre.scrollLeft = e.currentTarget.scrollLeft;
  }

  function refreshSelecting(el: HTMLTextAreaElement) {
    const next = el.selectionStart !== el.selectionEnd;
    setSelecting((prev) => (prev === next ? prev : next));
  }

  function prettyOnBlur() {
    setSelecting(false);
    const pretty = prettyText(value);
    if (pretty && pretty !== value) onChange(pretty);
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-col gap-1.5">
      <label
        htmlFor={id}
        className={cn(
          "text-[12px] font-medium",
          tone === "a" ? "text-[var(--request)]" : "text-[var(--response)]",
        )}
      >
        {label}
      </label>
      <div
        className={cn(
          "code-pane relative min-h-0 flex-1 overflow-hidden rounded-md border bg-[var(--vscode-bg)]",
          tone === "a"
            ? "border-[var(--request)]/40 ring-1 ring-[var(--request)]/20"
            : "border-[var(--response)]/40 ring-1 ring-[var(--response)]/20",
        )}
      >
        <pre
          ref={preRef}
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 m-0 overflow-auto p-3 font-mono text-[12.5px] leading-6 transition-opacity",
            selecting && "opacity-0",
          )}
          dir="ltr"
        >
          <code className="block min-w-0 whitespace-pre-wrap break-all">
            {lines.map((line, index) => {
              const mark = marks?.[index] ?? null;
              return (
                <span
                  key={index}
                  className={cn(
                    mark === "missing" && "bg-red-500/30",
                    mark === "extra" && "bg-emerald-500/30",
                    mark === "type-mismatch" && "bg-amber-500/30",
                  )}
                >
                  {highlightCode(line.length ? line : " ", "json")}
                  {index < lines.length - 1 ? "\n" : null}
                </span>
              );
            })}
          </code>
        </pre>
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          onSelect={(e) => refreshSelecting(e.currentTarget)}
          onKeyUp={(e) => refreshSelecting(e.currentTarget)}
          onMouseUp={(e) => refreshSelecting(e.currentTarget)}
          onBlur={prettyOnBlur}
          spellCheck={false}
          dir="ltr"
          className={cn(
            "relative z-10 h-full min-h-[min(28rem,60vh)] w-full resize-none bg-transparent p-3 font-mono text-[12.5px] leading-6",
            "caret-[#d4d4d4] outline-none",
            "selection:bg-[#264f78] selection:text-[#f3f3f3]",
            "code-scroll ltr-tech whitespace-pre-wrap break-all",
            selecting ? "text-[#d4d4d4]" : "text-transparent",
          )}
        />
      </div>
    </div>
  );
}

function Legend({
  swatch,
  label,
}: {
  swatch: LineHighlight;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span
        className={cn(
          "size-2.5 rounded-sm",
          swatch === "missing" && "bg-red-500/80",
          swatch === "extra" && "bg-emerald-500/80",
          swatch === "type-mismatch" && "bg-amber-500/80",
        )}
        aria-hidden
      />
      {label}
    </span>
  );
}
