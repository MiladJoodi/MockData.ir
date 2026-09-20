"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CopyButton } from "@/components/docs/copy-button";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { generateFromSchema } from "@/lib/json-workbench/from-schema";
import { formatJson, parseJson } from "@/lib/json-workbench/parse";
import { jsonToJsonSchema } from "@/lib/json-workbench/to-schema";
import { cn } from "@/lib/utils";
import { CodeOutputPane } from "../shared/code-output-pane";
import { DirectionToggle } from "../shared/direction-toggle";
import { EmptyState } from "../shared/empty-state";
import { JsonPane } from "../shared/json-pane";
import { ParseError } from "../shared/parse-error";
import { useWorkbench } from "../workbench-context";

type Mode = "json-to-schema" | "schema-to-example";

const SAMPLE_SCHEMA = `{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "number" },
    "active": { "type": "boolean" }
  },
  "required": ["name", "age", "active"]
}`;

export function ToSchemaTool() {
  const { dict, locale } = useUiLocale();
  const t = dict.jsonWorkbench;
  const isFa = locale === "fa";
  const { source, parsed, secondary, setSecondary } = useWorkbench();
  const outputId = useId();
  const schemaId = useId();
  const last = useRef("");
  const [mode, setMode] = useState<Mode>("json-to-schema");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function run(nextMode: Mode = mode) {
    if (nextMode === "json-to-schema") {
      if (!parsed.ok) {
        setError(null);
        setOutput("");
        return;
      }
      setError(null);
      setOutput(jsonToJsonSchema(parsed.value));
      return;
    }

    const schemaParsed = parseJson(secondary);
    if (!schemaParsed.ok) {
      setError(
        schemaParsed.message === "Empty input"
          ? t.errors.empty
          : schemaParsed.message,
      );
      setOutput("");
      return;
    }
    const result = generateFromSchema(schemaParsed.value);
    if (!result.ok) {
      setError(result.message);
      setOutput("");
      return;
    }
    setError(null);
    setOutput(formatJson(result.value));
  }

  useEffect(() => {
    const key = `${mode}::${source}::${secondary}::${parsed.ok}`;
    if (last.current === key) return;
    last.current = key;
    run(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, source, secondary, parsed.ok]);

  function swapMode() {
    const next: Mode =
      mode === "json-to-schema" ? "schema-to-example" : "json-to-schema";
    if (next === "schema-to-example" && !secondary.trim()) {
      setSecondary(output || SAMPLE_SCHEMA);
    }
    setMode(next);
  }

  return (
    <div className="space-y-3">
      <DirectionToggle
        fromLabel={mode === "json-to-schema" ? "JSON" : "Schema"}
        toLabel={mode === "json-to-schema" ? "Schema" : "JSON"}
        onSwap={swapMode}
        swapLabel={t.actions.swapDirection}
      />

      <p
        className={cn(
          "text-[13px] leading-relaxed text-muted-foreground",
          isFa && "font-fa-label",
        )}
      >
        {mode === "json-to-schema"
          ? t.transform.schemaExplain
          : t.utilities.fromSchemaHint}
      </p>

      {mode === "schema-to-example" ? (
        <JsonPane
          id={schemaId}
          label={t.source.schemaInput}
          tone="input"
          value={secondary}
          onChange={setSecondary}
          rows={12}
        />
      ) : null}

      {error ? <ParseError message={error} /> : null}

      {output ? (
        mode === "json-to-schema" ? (
          <CodeOutputPane
            id={outputId}
            label={t.labels.output}
            tone="output"
            value={output}
            language="json"
            headerAction={
              <CopyButton value={output} label={dict.common.copy} />
            }
          />
        ) : (
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
        )
      ) : (
        <EmptyState
          title={
            mode === "json-to-schema"
              ? t.transform.schemaIdleTitle
              : t.utilities.fromSchemaIdleTitle
          }
          body={
            mode === "json-to-schema"
              ? !source.trim()
                ? t.source.needJson
                : !parsed.ok
                  ? t.source.fixFirst
                  : t.transform.schemaIdleBody
              : t.utilities.fromSchemaIdleBody
          }
        />
      )}
    </div>
  );
}
