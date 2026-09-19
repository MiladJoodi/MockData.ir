"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CopyButton } from "@/components/docs/copy-button";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { formatJson, parseJson } from "@/lib/json-workbench/parse";
import { useWorkbench } from "../workbench-context";
import { CodeOutputPane } from "./code-output-pane";
import { EmptyState } from "./empty-state";
import { JsonPane } from "./json-pane";
import { ParseError } from "./parse-error";

type ParseErr = {
  message: string;
  line?: number;
  column?: number;
  position?: number;
};

type Props = {
  idleTitle: string;
  idleBody: string;
  transform?: (
    value: unknown,
  ) => { ok: true; output: string } | { ok: false; message: string };
  /** Use shared source as raw text (no JSON parse) */
  transformRaw?: (
    text: string,
  ) => { ok: true; output: string } | { ok: false; message: string };
  parseInput?: boolean;
  outputMode?: "json" | "plain" | "types" | "javascript";
  options?: ReactNode;
  note?: ReactNode;
  autoRun?: boolean;
  /** Allow pushing result into the shared JSON pane */
  allowApply?: boolean;
};

/** Result-only tool panel — reads the shared workbench JSON. */
export function SimpleJsonTool({
  idleTitle,
  idleBody,
  transform,
  transformRaw,
  parseInput = true,
  outputMode = "json",
  options,
  note,
  autoRun = true,
}: Props) {
  const { dict } = useUiLocale();
  const t = dict.jsonWorkbench;
  const { source, parsed } = useWorkbench();
  const outputId = useId();
  const lastSource = useRef<string | null>(null);

  const [output, setOutput] = useState("");
  const [error, setError] = useState<ParseErr | null>(null);

  function run(text = source) {
    if (!parseInput && transformRaw) {
      const result = transformRaw(text);
      if (!result.ok) {
        setError({
          message:
            result.message === "Empty input" ? t.errors.empty : result.message,
        });
        setOutput("");
        return;
      }
      setError(null);
      setOutput(result.output);
      return;
    }

    const next = parseJson(text);
    if (!next.ok) {
      setError({
        message:
          next.message === "Empty input" ? t.errors.empty : next.message,
        line: next.line,
        column: next.column,
        position: next.position,
      });
      setOutput("");
      return;
    }
    if (!transform) {
      setError({ message: "Missing transform" });
      return;
    }
    const result = transform(next.value);
    if (!result.ok) {
      setError({ message: result.message });
      setOutput("");
      return;
    }
    setError(null);
    setOutput(result.output);
  }

  useEffect(() => {
    if (!autoRun) return;
    if (lastSource.current === source) return;
    lastSource.current = source;
    if (!source.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    run(source);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, autoRun]);

  return (
    <div className="space-y-3">
      {options}
      {note}

      {error ? (
        <ParseError
          message={error.message}
          line={error.line}
          column={error.column}
          position={error.position}
        />
      ) : null}

      {!parsed.ok && source.trim() && parseInput ? (
        <p className="text-[12.5px] text-muted-foreground">
          {t.source.fixFirst}
        </p>
      ) : null}

      {output ? (
        outputMode === "json" ? (
          <JsonPane
            id={outputId}
            label={t.labels.output}
            tone="output"
            value={output}
            onChange={() => {}}
            readOnly
            headerAction={
              <CopyButton value={output} label={dict.common.copy} />
            }
          />
        ) : (
          <CodeOutputPane
            id={outputId}
            label={t.labels.output}
            tone="output"
            value={output}
            language={
              outputMode === "plain"
                ? "plain"
                : outputMode === "types"
                  ? "types"
                  : "javascript"
            }
            headerAction={
              <CopyButton value={output} label={dict.common.copy} />
            }
          />
        )
      ) : (
        <EmptyState title={idleTitle} body={idleBody} />
      )}
    </div>
  );
}

export function okJson(value: unknown): { ok: true; output: string } {
  return { ok: true, output: formatJson(value) };
}
