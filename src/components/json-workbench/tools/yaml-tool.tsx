"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CopyButton } from "@/components/docs/copy-button";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { jsonTextToYaml, yamlTextToJson } from "@/lib/json-workbench/yaml";
import { cn } from "@/lib/utils";
import { CodeOutputPane } from "../shared/code-output-pane";
import { DirectionToggle } from "../shared/direction-toggle";
import { EmptyState } from "../shared/empty-state";
import { ParseError } from "../shared/parse-error";
import { TextPane } from "../shared/text-pane";
import { useWorkbench } from "../workbench-context";

type Mode = "json-to-yaml" | "yaml-to-json";

const SAMPLE_YAML = `name: MockData
active: true
count: 3
`;

export function YamlTool() {
  const { dict, locale } = useUiLocale();
  const t = dict.jsonWorkbench;
  const isFa = locale === "fa";
  const { source, secondary, setSecondary, useAsSource } = useWorkbench();
  const outputId = useId();
  const altId = useId();
  const last = useRef("");
  const lastApplied = useRef("");
  const [mode, setMode] = useState<Mode>("json-to-yaml");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  function run(nextMode: Mode = mode) {
    if (nextMode === "json-to-yaml") {
      setApplied(false);
      const result = jsonTextToYaml(source);
      if (!result.ok) {
        setError(
          result.message === "Empty input" ? t.errors.empty : result.message,
        );
        setOutput("");
        return;
      }
      setError(null);
      setOutput(result.output);
      return;
    }

    // YAML → JSON writes into Your JSON
    const result = yamlTextToJson(secondary);
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
      mode === "json-to-yaml" ? "yaml-to-json" : "json-to-yaml";
    if (next === "yaml-to-json" && !secondary.trim()) {
      setSecondary(output || SAMPLE_YAML);
    }
    setApplied(false);
    setMode(next);
  }

  return (
    <div className="space-y-3">
      <DirectionToggle
        fromLabel={mode === "json-to-yaml" ? "JSON" : "YAML"}
        toLabel={mode === "json-to-yaml" ? "YAML" : "JSON"}
        onSwap={swapMode}
        swapLabel={t.actions.swapDirection}
      />

      {mode === "yaml-to-json" ? (
        <TextPane
          id={altId}
          label="YAML"
          tone="input"
          value={secondary}
          onChange={setSecondary}
          rows={14}
        />
      ) : null}

      {error ? <ParseError message={error} /> : null}

      {mode === "yaml-to-json" && applied && !error ? (
        <p
          role="status"
          className={cn(
            "rounded-md border border-[var(--response)]/35 bg-[var(--response)]/10 px-3 py-2.5 text-[13px] text-foreground",
            isFa && "font-fa-label",
          )}
        >
          {t.transform.yamlApplied}
        </p>
      ) : null}

      {mode === "json-to-yaml" && output ? (
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

      {mode === "json-to-yaml" && !output ? (
        <EmptyState
          title={t.transform.yamlIdleTitle}
          body={
            !source.trim() ? t.source.needJson : t.transform.yamlIdleBody
          }
        />
      ) : null}

      {mode === "yaml-to-json" && !applied && !error ? (
        <EmptyState
          title={t.transform.yamlIdleTitle}
          body={t.transform.yamlToJsonIdle}
        />
      ) : null}
    </div>
  );
}
