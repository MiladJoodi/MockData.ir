"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CopyButton } from "@/components/docs/copy-button";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { csvToJson, jsonToCsv } from "@/lib/json-workbench/csv";
import { parseJson } from "@/lib/json-workbench/parse";
import { cn } from "@/lib/utils";
import { CodeOutputPane } from "../shared/code-output-pane";
import { DirectionToggle } from "../shared/direction-toggle";
import { EmptyState } from "../shared/empty-state";
import { ParseError } from "../shared/parse-error";
import { TextPane } from "../shared/text-pane";
import { useWorkbench } from "../workbench-context";

type Mode = "json-to-csv" | "csv-to-json";

const SAMPLE_CSV = `name,age
Milad,32
Ali,28
`;

export function CsvTool() {
  const { dict, locale } = useUiLocale();
  const t = dict.jsonWorkbench;
  const isFa = locale === "fa";
  const { source, secondary, setSecondary, useAsSource } = useWorkbench();
  const outputId = useId();
  const altId = useId();
  const last = useRef("");
  const lastApplied = useRef("");
  const [mode, setMode] = useState<Mode>("json-to-csv");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  function run(nextMode: Mode = mode) {
    if (nextMode === "json-to-csv") {
      setApplied(false);
      const parsed = parseJson(source);
      if (!parsed.ok) {
        setError(
          parsed.message === "Empty input" ? t.errors.empty : parsed.message,
        );
        setOutput("");
        return;
      }
      const result = jsonToCsv(parsed.value);
      if (!result.ok) {
        setError(t.transform.csvUnsupported);
        setOutput("");
        return;
      }
      setError(null);
      setOutput(result.output);
      return;
    }

    const result = csvToJson(secondary);
    if (!result.ok) {
      setError(
        result.message === "Empty input" ? t.errors.empty : result.message,
      );
      setOutput("");
      setApplied(false);
      return;
    }
    setError(null);
    setOutput("");
    if (lastApplied.current !== result.output) {
      lastApplied.current = result.output;
      useAsSource(result.output);
    }
    setApplied(true);
  }

  useEffect(() => {
    const key = `${mode}::${source}::${secondary}`;
    if (last.current === key) return;
    last.current = key;
    run(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, source, secondary]);

  function swapMode() {
    const next: Mode =
      mode === "json-to-csv" ? "csv-to-json" : "json-to-csv";
    if (next === "csv-to-json" && !secondary.trim()) {
      setSecondary(output || SAMPLE_CSV);
    }
    setApplied(false);
    setMode(next);
  }

  return (
    <div className="space-y-3">
      <DirectionToggle
        fromLabel={mode === "json-to-csv" ? "JSON" : "CSV"}
        toLabel={mode === "json-to-csv" ? "CSV" : "JSON"}
        onSwap={swapMode}
        swapLabel={t.actions.swapDirection}
      />

      {mode === "csv-to-json" ? (
        <TextPane
          id={altId}
          label="CSV"
          tone="input"
          value={secondary}
          onChange={setSecondary}
          rows={14}
        />
      ) : null}

      {error ? <ParseError message={error} /> : null}

      {mode === "csv-to-json" && applied && !error ? (
        <p
          role="status"
          className={cn(
            "rounded-md border border-[var(--response)]/35 bg-[var(--response)]/10 px-3 py-2.5 text-[13px] text-foreground",
            isFa && "font-fa-label",
          )}
        >
          {t.transform.csvApplied}
        </p>
      ) : null}

      {mode === "json-to-csv" && output ? (
        <CodeOutputPane
          id={outputId}
          label={t.labels.output}
          tone="output"
          value={output}
          language="plain"
          headerAction={
            <CopyButton value={output} label={dict.common.copy} />
          }
        />
      ) : null}

      {mode === "json-to-csv" && !output && !error ? (
        <EmptyState
          title={t.transform.csvIdleTitle}
          body={
            !source.trim()
              ? t.source.needJson
              : t.transform.csvIdleBodyJson
          }
        />
      ) : null}

      {mode === "csv-to-json" && !applied && !error ? (
        <EmptyState
          title={t.transform.csvIdleTitle}
          body={t.transform.csvToJsonIdle}
        />
      ) : null}
    </div>
  );
}
