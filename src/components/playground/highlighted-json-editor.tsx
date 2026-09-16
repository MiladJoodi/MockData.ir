"use client";

import { useRef, type UIEvent } from "react";
import { highlightCode } from "@/lib/syntax";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
};

/** Editable JSON with VS Code–style colors via a mirrored highlight layer. */
export function HighlightedJsonEditor({
  id,
  value,
  onChange,
  rows = 8,
}: Props) {
  const preRef = useRef<HTMLPreElement>(null);
  const display = value.length ? value : " ";

  function syncScroll(e: UIEvent<HTMLTextAreaElement>) {
    const pre = preRef.current;
    if (!pre) return;
    pre.scrollTop = e.currentTarget.scrollTop;
    pre.scrollLeft = e.currentTarget.scrollLeft;
  }

  return (
    <div className="code-pane relative overflow-hidden rounded-md border border-border bg-[var(--vscode-bg)] focus-within:border-[var(--request)]/50">
      <pre
        ref={preRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 m-0 overflow-auto p-3 font-mono text-[12px] leading-5",
          "code-scroll",
        )}
        dir="ltr"
      >
        <code className="block min-w-0 whitespace-pre-wrap break-all">
          {display.split("\n").map((line, index, arr) => (
            <span key={index}>
              {highlightCode(line.length ? line : " ", "json")}
              {index < arr.length - 1 ? "\n" : null}
            </span>
          ))}
        </code>
      </pre>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        spellCheck={false}
        rows={rows}
        dir="ltr"
        className={cn(
          "relative z-10 w-full resize-y bg-transparent p-3 font-mono text-[12px] leading-5",
          "text-transparent caret-[#d4d4d4] outline-none selection:bg-[#264f78] selection:text-transparent",
          "code-scroll ltr-tech whitespace-pre-wrap break-all",
        )}
      />
    </div>
  );
}
