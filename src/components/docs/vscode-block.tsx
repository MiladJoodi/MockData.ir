"use client";

import { highlightCode } from "@/lib/syntax";
import { CopyButton } from "@/components/docs/copy-button";
import { cn } from "@/lib/utils";

type VsCodeBlockProps = {
  code: string;
  filename?: string;
  language?: "json" | "javascript" | "bash" | "html" | "css";
  className?: string;
  showLineNumbers?: boolean;
};

export function VsCodeBlock({
  code,
  filename,
  language = "javascript",
  className,
  showLineNumbers = true,
}: VsCodeBlockProps) {
  const lines = code.split("\n");

  return (
    <div
      dir="ltr"
      className={cn(
        "code-pane ltr-tech min-w-0 overflow-hidden rounded-lg border border-[var(--vscode-border)] bg-[var(--vscode-bg)] shadow-[0_12px_40px_-20px_rgb(0_0_0_/_0.8)]",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-[var(--vscode-border)] bg-[var(--vscode-bg-elevated)] px-3 py-2">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f56]" />
          <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="size-2.5 rounded-full bg-[#27c93f]" />
        </div>
        {filename ? (
          <div className="min-w-0 flex-1">
            <span className="inline-flex max-w-full truncate rounded-t border border-b-0 border-[var(--vscode-border)] bg-[var(--vscode-bg)] px-3 py-1 font-mono text-[11px] text-[var(--vscode-fg)]">
              {filename}
            </span>
          </div>
        ) : (
          <div className="min-w-0 flex-1" />
        )}
        <CopyButton
          value={code}
          className="text-[var(--vscode-fg)]/55 hover:bg-white/10 hover:text-[var(--vscode-fg)]"
        />
      </div>

      <div className="code-scroll max-w-full overflow-x-auto">
        <pre className="m-0 min-w-0 max-w-full p-0 font-mono text-[12.5px] leading-6">
          <code className="grid min-w-0">
            {lines.map((line, index) => (
              <span key={index} className="flex min-w-0">
                {showLineNumbers ? (
                  <span className="sticky left-0 w-10 shrink-0 select-none bg-[var(--vscode-bg)] pr-3 text-right text-[var(--vscode-line)]">
                    {index + 1}
                  </span>
                ) : null}
                <span className="min-w-0 flex-1 break-all pr-4 whitespace-pre-wrap">
                  {highlightCode(line.length ? line : " ", language)}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
