import { childPath, formatJsonPreview } from "./path";

export type SearchMatchKind = "key" | "value";

export type SearchMatch = {
  id: string;
  path: string;
  kind: SearchMatchKind;
  matchedText: string;
  preview: string;
};

export type SearchOptions = {
  /** Default true */
  caseInsensitive?: boolean;
};

function includesQuery(
  haystack: string,
  query: string,
  caseInsensitive: boolean,
): boolean {
  if (!query) return false;
  if (caseInsensitive) {
    return haystack.toLowerCase().includes(query.toLowerCase());
  }
  return haystack.includes(query);
}

/** Structural search over keys and values. */
export function searchJson(
  value: unknown,
  query: string,
  options: SearchOptions = {},
): SearchMatch[] {
  const q = query.trim();
  if (!q) return [];
  const caseInsensitive = options.caseInsensitive !== false;
  const matches: SearchMatch[] = [];
  walk(value, "$", q, caseInsensitive, matches);
  return matches;
}

function walk(
  value: unknown,
  path: string,
  query: string,
  caseInsensitive: boolean,
  out: SearchMatch[],
): void {
  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      walk(item, childPath(path, String(i), true), query, caseInsensitive, out);
    });
    return;
  }

  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(
      value as Record<string, unknown>,
    )) {
      const keyPath = childPath(path, key, false);
      if (includesQuery(key, query, caseInsensitive)) {
        out.push({
          id: `${keyPath}#key`,
          path: keyPath,
          kind: "key",
          matchedText: key,
          preview: key,
        });
      }
      walk(child, keyPath, query, caseInsensitive, out);
    }
    return;
  }

  const text =
    value === null
      ? "null"
      : typeof value === "string"
        ? value
        : String(value);

  if (includesQuery(text, query, caseInsensitive)) {
    out.push({
      id: `${path}#value`,
      path,
      kind: "value",
      matchedText: text,
      preview: formatJsonPreview(value),
    });
  }
}

export type ReplaceOptions = SearchOptions & {
  /** Replace in object keys too (default true). */
  replaceKeys?: boolean;
  /** Replace all occurrences (default true for replaceAll; false for single). */
  all?: boolean;
};

/**
 * Replace query in string values and object keys.
 * Returns a deep-cloned tree; does not mutate input.
 */
export function replaceInJson(
  value: unknown,
  query: string,
  replacement: string,
  options: ReplaceOptions = {},
): { value: unknown; count: number } {
  const q = query.trim();
  if (!q) return { value, count: 0 };

  const caseInsensitive = options.caseInsensitive !== false;
  const replaceKeys = options.replaceKeys !== false;
  const all = options.all !== false;
  let remaining = all ? Number.POSITIVE_INFINITY : 1;
  let count = 0;

  function replaceInString(text: string): string {
    if (remaining <= 0) return text;
    if (!includesQuery(text, q, caseInsensitive)) return text;

    if (caseInsensitive) {
      const flags = all ? "gi" : "i";
      const re = new RegExp(escapeRegExp(q), flags);
      return text.replace(re, (m) => {
        if (remaining <= 0) return m;
        remaining -= 1;
        count += 1;
        return replacement;
      });
    }

    if (all) {
      const parts = text.split(q);
      const hits = parts.length - 1;
      const use = Math.min(hits, remaining);
      remaining -= use;
      count += use;
      if (use === hits) return parts.join(replacement);
      let out = "";
      for (let i = 0; i < parts.length; i++) {
        out += parts[i];
        if (i < use) out += replacement;
        else if (i < hits) out += q;
      }
      return out;
    }

    const idx = text.indexOf(q);
    if (idx === -1) return text;
    remaining -= 1;
    count += 1;
    return text.slice(0, idx) + replacement + text.slice(idx + q.length);
  }

  function transform(node: unknown): unknown {
    if (remaining <= 0) return node;

    if (Array.isArray(node)) {
      return node.map((item) => transform(item));
    }

    if (node && typeof node === "object") {
      const out: Record<string, unknown> = {};
      for (const [key, child] of Object.entries(
        node as Record<string, unknown>,
      )) {
        const nextKey =
          replaceKeys && remaining > 0 ? replaceInString(key) : key;
        out[nextKey] = transform(child);
      }
      return out;
    }

    if (typeof node === "string") {
      return replaceInString(node);
    }

    return node;
  }

  return { value: transform(value), count };
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
