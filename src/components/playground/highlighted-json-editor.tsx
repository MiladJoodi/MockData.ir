"use client";

import { useRef, useState, type UIEvent } from "react";
import { highlightCode } from "@/lib/syntax";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  /** No outer border/radius — for embedding in a larger chrome. */
  bare?: boolean;
  /** Extra end padding so a corner control does not cover text. */
  padEnd?: boolean;
  /** Use Vazirmatn for JSON string tokens (Persian sample data). */
  persianStrings?: boolean;
};

/** Editable JSON with VS Code–style colors via a mirrored highlight layer. */
export function HighlightedJsonEditor({
  id,
  value,
  onChange,
  rows = 8,
  bare = false,
  padEnd = false,
  persianStrings = false,
}: Props) {
  const preRef = useRef<HTMLPreElement>(null);
  const [selecting, setSelecting] = useState(false);
  const display = value.length ? value : " ";

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

  const padClass = padEnd ? "pe-11" : null;
  const faFont = persianStrings
    ? "[font-family:var(--font-jetbrains),var(--font-vazirmatn),ui-monospace,monospace]"
    : "font-mono";

  return (
    <div
      className={cn(
        "code-pane relative overflow-hidden bg-[var(--vscode-bg)]",
        bare
          ? "rounded-none border-0"
          : "rounded-md border border-border focus-within:border-[var(--request)]/50",
      )}
    >
      <pre
        ref={preRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 m-0 overflow-auto p-3 text-[12px] leading-5",
          "code-scroll transition-opacity",
          selecting && "opacity-0",
          padClass,
          faFont,
        )}
        dir="ltr"
      >
        <code className="block min-w-0 whitespace-pre-wrap break-all">
          {display.split("\n").map((line, index, arr) => (
            <span key={index}>
              {highlightCode(line.length ? line : " ", "json", {
                persianStrings,
              })}
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
        onSelect={(e) => refreshSelecting(e.currentTarget)}
        onKeyUp={(e) => refreshSelecting(e.currentTarget)}
        onMouseUp={(e) => refreshSelecting(e.currentTarget)}
        onBlur={() => setSelecting(false)}
        spellCheck={false}
        rows={rows}
        dir="ltr"
        className={cn(
          "relative z-10 w-full resize-none bg-transparent p-3 text-[12px] leading-5",
          "caret-[#d4d4d4] outline-none",
          "selection:bg-[#264f78] selection:text-[#f3f3f3]",
          "code-scroll ltr-tech whitespace-pre-wrap break-all",
          selecting ? "text-[#d4d4d4]" : "text-transparent",
          padClass,
          faFont,
        )}
      />
    </div>
  );
}
