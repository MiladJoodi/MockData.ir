"use client";

import { VsCodeBlock } from "@/components/docs/vscode-block";

/** Back-compat wrapper used by docs pages */
export function CodeBlock({
  code,
  label = "example.js",
  language = "javascript",
}: {
  code: string;
  label?: string;
  language?: "json" | "javascript" | "bash";
}) {
  const lang =
    label.includes("json") || label.toLowerCase().includes("error")
      ? "json"
      : language;
  return <VsCodeBlock code={code} language={lang} />;
}
