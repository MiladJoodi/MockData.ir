import { createElement, type ReactNode } from "react";

type Token =
  | { type: "plain"; value: string }
  | { type: "string"; value: string }
  | { type: "number"; value: string }
  | { type: "keyword"; value: string }
  | { type: "property"; value: string }
  | { type: "function"; value: string }
  | { type: "comment"; value: string }
  | { type: "punctuation"; value: string };

const tokenClass: Record<Token["type"], string> = {
  plain: "text-[var(--vscode-fg)]",
  string: "text-[var(--vscode-string)]",
  number: "text-[var(--vscode-number)]",
  keyword: "text-[var(--vscode-keyword)]",
  property: "text-[var(--vscode-property)]",
  function: "text-[var(--vscode-function)]",
  comment: "text-[var(--vscode-comment)]",
  punctuation: "text-[var(--vscode-punctuation)]",
};

function tokenizeJson(code: string): Token[] {
  const tokens: Token[] = [];
  const re =
    /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|(\btrue\b|\bfalse\b|\bnull\b)|(\/\/[^\n]*)|([{}\[\]:,])/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(code))) {
    if (match.index > last) {
      tokens.push({ type: "plain", value: code.slice(last, match.index) });
    }
    if (match[1] !== undefined) {
      if (match[2]) {
        tokens.push({ type: "property", value: match[1] });
        tokens.push({ type: "punctuation", value: match[2] });
      } else {
        tokens.push({ type: "string", value: match[1] });
      }
    } else if (match[3] !== undefined) {
      tokens.push({ type: "number", value: match[3] });
    } else if (match[4] !== undefined) {
      tokens.push({ type: "keyword", value: match[4] });
    } else if (match[5] !== undefined) {
      tokens.push({ type: "comment", value: match[5] });
    } else if (match[6] !== undefined) {
      tokens.push({ type: "punctuation", value: match[6] });
    }
    last = match.index + match[0].length;
  }

  if (last < code.length) {
    tokens.push({ type: "plain", value: code.slice(last) });
  }
  return tokens;
}

function tokenizeJs(code: string): Token[] {
  const tokens: Token[] = [];
  const re =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b(?:const|let|var|function|return|await|async|if|else|then|catch|throw|new|import|from|export|default)\b)|(\b(?:true|false|null|undefined)\b)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][\w$]*(?=\s*\())|([(){}\[\].,;:=<>!&|?+\-*/%])/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(code))) {
    if (match.index > last) {
      tokens.push({ type: "plain", value: code.slice(last, match.index) });
    }
    if (match[1]) tokens.push({ type: "comment", value: match[1] });
    else if (match[2]) tokens.push({ type: "string", value: match[2] });
    else if (match[3]) tokens.push({ type: "keyword", value: match[3] });
    else if (match[4]) tokens.push({ type: "keyword", value: match[4] });
    else if (match[5]) tokens.push({ type: "number", value: match[5] });
    else if (match[6]) tokens.push({ type: "function", value: match[6] });
    else if (match[7]) tokens.push({ type: "punctuation", value: match[7] });
    last = match.index + match[0].length;
  }

  if (last < code.length) {
    tokens.push({ type: "plain", value: code.slice(last) });
  }
  return tokens;
}

function tokenizeTypes(code: string): Token[] {
  const tokens: Token[] = [];
  const re =
    /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|(\b(?:string|number|integer|boolean|null|unknown|Array)\b)|(\b[A-Za-z_$][\w$]*\b)(?=\s*\??:)|([{}()\[\]<>|:?,])/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(code))) {
    if (match.index > last) {
      tokens.push({ type: "plain", value: code.slice(last, match.index) });
    }
    if (match[1]) tokens.push({ type: "comment", value: match[1] });
    else if (match[2]) tokens.push({ type: "keyword", value: match[2] });
    else if (match[3]) tokens.push({ type: "property", value: match[3] });
    else if (match[4]) tokens.push({ type: "punctuation", value: match[4] });
    last = match.index + match[0].length;
  }

  if (last < code.length) {
    tokens.push({ type: "plain", value: code.slice(last) });
  }
  return tokens;
}

export function highlightCode(
  code: string,
  language: "json" | "javascript" | "bash" | "types" = "json",
  options?: { persianStrings?: boolean },
): ReactNode {
  const tokens =
    language === "json"
      ? tokenizeJson(code)
      : language === "javascript"
        ? tokenizeJs(code)
        : language === "types"
          ? tokenizeTypes(code)
          : [{ type: "plain" as const, value: code }];

  return tokens.map((token, index) =>
    createElement(
      "span",
      {
        key: `${token.type}-${index}`,
        className:
          options?.persianStrings && token.type === "string"
            ? `${tokenClass[token.type]} font-fa-label`
            : tokenClass[token.type],
      },
      token.value,
    ),
  );
}

export function toSingleLineJson(pretty: string): string {
  try {
    return JSON.stringify(JSON.parse(pretty));
  } catch {
    return pretty.replace(/\s+/g, " ").trim();
  }
}
