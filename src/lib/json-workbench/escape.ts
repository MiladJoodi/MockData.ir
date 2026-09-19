import { formatJson, parseJson } from "./parse";

/** Escape JSON into a JSON string literal content (without surrounding quotes). */
export function escapeJson(value: unknown): string {
  // JSON.stringify on a string produces quoted+escaped; strip outer quotes
  const asString = JSON.stringify(formatJson(value).trimEnd());
  return asString.slice(1, -1);
}

export type UnescapeResult =
  | { ok: true; value: unknown; text: string }
  | { ok: false; message: string };

/**
 * Unescape an escaped JSON string back to formatted JSON.
 * Accepts with or without surrounding quotes.
 */
export function unescapeJson(raw: string): UnescapeResult {
  const trimmed = raw.replace(/^\uFEFF/, "").trim();
  if (!trimmed) return { ok: false, message: "Empty input" };

  // Try as a JSON string value first
  const asQuoted =
    trimmed.startsWith('"') && trimmed.endsWith('"')
      ? trimmed
      : `"${trimmed}"`;

  try {
    const decoded = JSON.parse(asQuoted) as unknown;
    if (typeof decoded !== "string") {
      return {
        ok: false,
        message: "Input must be an escaped JSON string.",
      };
    }
    const parsed = parseJson(decoded);
    if (!parsed.ok) {
      return {
        ok: false,
        message: `Unescaped text is not valid JSON: ${parsed.message}`,
      };
    }
    return { ok: true, value: parsed.value, text: formatJson(parsed.value) };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Could not unescape",
    };
  }
}
