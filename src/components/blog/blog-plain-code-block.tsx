"use client";

import { CopyButton } from "@/components/docs/copy-button";
import { cn } from "@/lib/utils";

/** LTR fallback for fenced code languages VsCodeBlock does not highlight. */
export function BlogPlainCodeBlock({
  code,
  language,
  className,
}: {
  code: string;
  language?: string;
  className?: string;
}) {
  return (
    <div
      dir="ltr"
      className={cn(
        "ltr-tech my-6 min-w-0 overflow-hidden rounded-lg border border-[var(--vscode-border)] bg-[var(--vscode-bg)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--vscode-border)] bg-[var(--vscode-bg-elevated)] px-3 py-2">
        <span className="font-mono text-[11px] text-[var(--vscode-fg)]/60">
          {language || "text"}
        </span>
        <CopyButton
          value={code}
          className="text-[var(--vscode-fg)]/55 hover:bg-white/10 hover:text-[var(--vscode-fg)]"
        />
      </div>
      <pre className="code-scroll m-0 max-w-full overflow-x-auto p-4 font-mono text-[12.5px] leading-6 text-[var(--vscode-fg)]">
        <code className="whitespace-pre-wrap break-all">{code}</code>
      </pre>
    </div>
  );
}
