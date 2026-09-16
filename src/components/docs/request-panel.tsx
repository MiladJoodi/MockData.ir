"use client";

import { useState } from "react";
import { ResponseViewer } from "@/components/docs/response-viewer";
import { VsCodeBlock } from "@/components/docs/vscode-block";
import { cn } from "@/lib/utils";

export type RequestExample = {
  id: string;
  label: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  fetchCode: string;
  axiosCode: string;
  curlCode: string;
  /** Sample JSON shown under the request when this example is active. */
  responseJson?: string;
};

type RequestPanelProps = {
  examples: RequestExample[];
};

type Lang = "fetch" | "axios" | "curl";

const methodColor: Record<RequestExample["method"], string> = {
  GET: "text-[var(--get)]",
  POST: "text-[var(--post)]",
  PATCH: "text-[var(--patch)]",
  DELETE: "text-[var(--delete)]",
};

export function RequestPanel({ examples }: RequestPanelProps) {
  const [activeId, setActiveId] = useState(examples[0]?.id ?? "");
  const [lang, setLang] = useState<Lang>("axios");
  const active = examples.find((ex) => ex.id === activeId) ?? examples[0];

  if (!active) return null;

  const code =
    lang === "fetch"
      ? active.fetchCode
      : lang === "axios"
        ? active.axiosCode
        : active.curlCode;

  return (
    <div className="min-w-0 space-y-5">
      <div className="min-w-0 overflow-hidden rounded-lg border border-[var(--request)]/40 bg-[var(--request-bg)] p-1">
        <div className="mb-1 space-y-2 px-2 pt-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-semibold tracking-wide text-[#8f6b09] uppercase dark:text-[#ffb020]">
              Request
            </span>
            <div
              className="flex rounded border border-[var(--request)]/25 bg-[var(--vscode-bg)] p-0.5"
              role="tablist"
              aria-label="Request language"
            >
              {(["fetch", "axios", "curl"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={lang === item}
                  onClick={() => setLang(item)}
                  className={cn(
                    "rounded px-2.5 py-1 font-mono text-[10px] transition-colors",
                    /* Always on dark vscode chrome — use amber, not theme --request */
                    lang === item
                      ? "bg-[#ffb020]/20 text-[#ffb020]"
                      : "text-[#d4d4d4]/70 hover:text-[#ffb020]",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div
            className="flex flex-wrap gap-1"
            role="tablist"
            aria-label="HTTP method"
          >
            {examples.map((ex) => (
              <button
                key={ex.id}
                type="button"
                role="tab"
                aria-selected={active.id === ex.id}
                onClick={() => setActiveId(ex.id)}
                className={cn(
                  "rounded border px-2 py-1 font-mono text-[10px] font-semibold transition-colors",
                  methodColor[ex.method],
                  active.id === ex.id
                    ? "border-[var(--request)]/40 bg-[var(--request)]/15"
                    : "border-transparent hover:bg-[var(--request)]/10",
                )}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        <VsCodeBlock
          code={code}
          language={lang === "curl" ? "bash" : "javascript"}
        />
      </div>

      {active.responseJson ? (
        <ResponseViewer prettyJson={active.responseJson} />
      ) : null}
    </div>
  );
}
