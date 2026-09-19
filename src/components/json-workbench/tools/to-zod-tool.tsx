"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CopyButton } from "@/components/docs/copy-button";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { jsonToZod } from "@/lib/json-workbench/to-zod";
import { CodeOutputPane } from "../shared/code-output-pane";
import { EmptyState } from "../shared/empty-state";
import { useWorkbench } from "../workbench-context";

export function ToZodTool() {
  const { dict } = useUiLocale();
  const t = dict.jsonWorkbench;
  const { source, parsed } = useWorkbench();
  const outputId = useId();
  const last = useRef("");
  const [output, setOutput] = useState("");

  function run() {
    if (!parsed.ok) {
      setOutput("");
      return;
    }
    setOutput(jsonToZod(parsed.value));
  }

  useEffect(() => {
    if (last.current === source) return;
    last.current = source;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, parsed.ok]);

  return (
    <div className="space-y-3">
      {output ? (
        <CodeOutputPane
          id={outputId}
          label={t.labels.output}
          tone="output"
          value={output}
          language="javascript"
          headerAction={
            <CopyButton value={output} label={dict.common.copy} />
          }
        />
      ) : (
        <EmptyState
          title={t.transform.zodIdleTitle}
          body={
            !source.trim()
              ? t.source.needJson
              : !parsed.ok
                ? t.source.fixFirst
                : t.transform.zodIdleBody
          }
        />
      )}
    </div>
  );
}
