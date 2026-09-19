export type ParseOk = {
  ok: true;
  value: unknown;
};

export type ParseErr = {
  ok: false;
  message: string;
  line?: number;
  column?: number;
  position?: number;
};

export type ParseResult = ParseOk | ParseErr;

/** Parse JSON with optional line/column from SyntaxError message. */
export function parseJson(raw: string): ParseResult {
  const text = raw.replace(/^\uFEFF/, "").trim();
  if (!text) {
    return { ok: false, message: "Empty input" };
  }
  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid JSON";
    const loc = extractJsonErrorLocation(message, text);
    return { ok: false, message, ...loc };
  }
}

export function formatJson(value: unknown, spaces = 2): string {
  return `${JSON.stringify(value, null, spaces)}\n`;
}

/** Compact JSON with no extra whitespace. */
export function minifyJson(value: unknown): string {
  return JSON.stringify(value);
}

export type JsonValueType =
  | "object"
  | "array"
  | "string"
  | "number"
  | "boolean"
  | "null";

export function jsonValueType(value: unknown): JsonValueType {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean") return t;
  return "object";
}

function extractJsonErrorLocation(
  message: string,
  source: string,
): {
  line?: number;
  column?: number;
  position?: number;
} {
  const posMatch = message.match(/position\s+(\d+)/i);
  const position = posMatch ? Number(posMatch[1]) : undefined;
  const lineCol = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (lineCol) {
    return {
      line: Number(lineCol[1]),
      column: Number(lineCol[2]),
      position: Number.isFinite(position) ? position : undefined,
    };
  }
  if (Number.isFinite(position) && position != null) {
    const fromPos = lineColumnFromPosition(source, position);
    return { position, ...fromPos };
  }
  return {};
}

function lineColumnFromPosition(
  source: string,
  position: number,
): { line: number; column: number } {
  let line = 1;
  let column = 1;
  const end = Math.min(position, source.length);
  for (let i = 0; i < end; i++) {
    if (source[i] === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }
  return { line, column };
}
