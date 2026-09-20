import { VsCodeBlock } from "@/components/docs/vscode-block";
import { BlogPlainCodeBlock } from "@/components/blog/blog-plain-code-block";

type VsCodeLanguage = "json" | "javascript" | "bash" | "html" | "css";

function mapToVsCodeLanguage(raw?: string): VsCodeLanguage | null {
  if (!raw) return null;
  const lang = raw.toLowerCase();
  if (lang === "json") return "json";
  if (
    lang === "js" ||
    lang === "javascript" ||
    lang === "jsx" ||
    lang === "ts" ||
    lang === "tsx" ||
    lang === "typescript" ||
    lang === "mjs" ||
    lang === "cjs"
  ) {
    return "javascript";
  }
  if (lang === "bash" || lang === "sh" || lang === "shell" || lang === "zsh") {
    return "bash";
  }
  if (lang === "html" || lang === "xml") return "html";
  if (lang === "css" || lang === "scss") return "css";
  return null;
}

export function BlogCodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const mapped = mapToVsCodeLanguage(language);
  if (mapped) {
    return <VsCodeBlock code={code} language={mapped} className="my-6" />;
  }
  return <BlogPlainCodeBlock code={code} language={language} />;
}
