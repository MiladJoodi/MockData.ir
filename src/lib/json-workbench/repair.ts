import { JSONRepairError, jsonrepair } from "jsonrepair";
import { formatJson, parseJson } from "./parse";

/** Categories of issues the repair engine can address. */
export type RepairFixId =
  | "trailing-commas"
  | "single-quotes"
  | "smart-quotes"
  | "unquoted-keys"
  | "missing-commas"
  | "missing-brackets"
  | "comments"
  | "code-fence"
  | "python-literals"
  | "js-undefined"
  | "jsonp"
  | "escaped-string"
  | "mongodb"
  | "ndjson"
  | "ellipsis"
  | "string-concat"
  | "whitespace"
  | "truncated"
  | "mid-edit-junk";

export type RepairResult =
  | {
      ok: true;
      value: unknown;
      text: string;
      fixes: RepairFixId[];
      alreadyValid: boolean;
    }
  | {
      ok: false;
      message: string;
      position?: number;
      line?: number;
      column?: number;
      fixes: RepairFixId[];
    };

/**
 * Repair invalid JSON using `jsonrepair` plus salvage strategies for
 * mid-edit / truncated / junk-in-the-middle documents.
 */
export function repairJson(raw: string): RepairResult {
  const trimmed = raw.replace(/^\uFEFF/, "").trim();
  if (!trimmed) {
    return { ok: false, message: "Empty input", fixes: [] };
  }

  const direct = parseJson(trimmed);
  if (direct.ok) {
    return {
      ok: true,
      value: direct.value,
      text: formatJson(direct.value),
      fixes: [],
      alreadyValid: true,
    };
  }

  const suspected = detectIssues(trimmed);
  const attempts = buildAttempts(trimmed);

  let lastError: {
    message: string;
    position?: number;
  } = { message: "Could not repair JSON" };

  for (const attempt of attempts) {
    const repairedRaw = tryJsonRepair(attempt.text);
    if (repairedRaw == null) {
      const err = lastJsonRepairError(attempt.text);
      if (err) lastError = err;
      continue;
    }
    const parsed = parseJson(repairedRaw);
    if (!parsed.ok) {
      lastError = { message: parsed.message };
      continue;
    }

    const fixes = mergeFixes(
      refineFixes(trimmed, repairedRaw, suspected),
      attempt.extraFixes,
    );

    return {
      ok: true,
      value: parsed.value,
      text: formatJson(parsed.value),
      fixes,
      alreadyValid: false,
    };
  }

  // Last chance: salvage truncated prefix at the failure position
  const pos = lastError.position;
  if (pos != null && pos > 0) {
    for (const candidate of salvageAround(trimmed, pos)) {
      const repairedRaw = tryJsonRepair(candidate);
      if (repairedRaw == null) continue;
      const parsed = parseJson(repairedRaw);
      if (!parsed.ok) continue;
      return {
        ok: true,
        value: parsed.value,
        text: formatJson(parsed.value),
        fixes: mergeFixes(suspected, ["truncated", "missing-brackets"]),
        alreadyValid: false,
      };
    }
  }

  return {
    ok: false,
    message: lastError.message,
    position: lastError.position,
    fixes: suspected,
    ...locFromPosition(trimmed, lastError.position),
  };
}

type Attempt = { text: string; extraFixes: RepairFixId[] };

function buildAttempts(text: string): Attempt[] {
  const normalized = normalizeInput(text);
  const balanced = closeOpenStructures(normalized);
  const noTrailing = stripTrailingIncomplete(normalized);
  const junkCleaned = stripMidEditJunk(normalized);

  const attempts: Attempt[] = [
    { text: normalized, extraFixes: [] },
    { text: balanced, extraFixes: ["missing-brackets"] },
    { text: noTrailing, extraFixes: ["truncated"] },
    { text: closeOpenStructures(noTrailing), extraFixes: ["truncated", "missing-brackets"] },
  ];

  if (junkCleaned !== normalized) {
    attempts.push(
      { text: junkCleaned, extraFixes: ["mid-edit-junk"] },
      {
        text: closeOpenStructures(junkCleaned),
        extraFixes: ["mid-edit-junk", "missing-brackets"],
      },
    );
  }

  const extracted = extractLikelyJson(normalized);
  if (extracted && extracted !== normalized) {
    attempts.push(
      { text: extracted, extraFixes: ["truncated"] },
      {
        text: closeOpenStructures(extracted),
        extraFixes: ["truncated", "missing-brackets"],
      },
    );
  }

  // Deduplicate identical texts while preserving order
  const seen = new Set<string>();
  return attempts.filter((a) => {
    if (seen.has(a.text) || !a.text.trim()) return false;
    seen.add(a.text);
    return true;
  });
}

function tryJsonRepair(text: string): string | null {
  try {
    return jsonrepair(text);
  } catch {
    return null;
  }
}

function lastJsonRepairError(
  text: string,
): { message: string; position?: number } | null {
  try {
    jsonrepair(text);
    return null;
  } catch (e) {
    if (e instanceof JSONRepairError) {
      return { message: e.message, position: e.position };
    }
    if (e instanceof Error) return { message: e.message };
    return { message: "Could not repair JSON" };
  }
}

function normalizeInput(text: string): string {
  let s = text.replace(/^\uFEFF/, "");
  // Fancy / special spaces → regular space
  s = s.replace(/[\u00A0\u2000-\u200B\u2028\u2029\uFEFF]/g, " ");
  // Strip markdown fences (keep inner)
  s = s.replace(/^```(?:json|JSON)?\s*\r?\n?/, "").replace(/\r?\n?```\s*$/, "");
  return s.trim();
}

/** Close unclosed strings and brackets so truncated mid-edit JSON can parse. */
export function closeOpenStructures(text: string): string {
  let inString = false;
  let escape = false;
  const stack: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === "\\") {
        escape = true;
        continue;
      }
      if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{") stack.push("}");
    else if (ch === "[") stack.push("]");
    else if (ch === "}" || ch === "]") {
      if (stack.length && stack[stack.length - 1] === ch) stack.pop();
    }
  }

  let out = text;
  if (inString) out += '"';
  // Drop dangling separators before closing
  out = out.replace(/[\s,]+$/u, "");
  while (stack.length) out += stack.pop();
  return out;
}

/** Remove incomplete trailing key/value fragments like `"name":` or `, "a"`. */
function stripTrailingIncomplete(text: string): string {
  let s = text.trimEnd();
  // Trailing colon / comma / incomplete key
  s = s.replace(/,\s*"[^"\\]*(?:\\.[^"\\]*)*"?\s*:?\s*$/u, "");
  s = s.replace(/,\s*[A-Za-z_$][\w$]*\s*:?\s*$/u, "");
  s = s.replace(/:\s*$/u, "");
  s = s.replace(/,\s*$/u, "");
  return s;
}

/**
 * Remove obvious mid-edit junk: a bare word/token sitting where a key or
 * value should be (e.g. typed letters between two properties).
 */
function stripMidEditJunk(text: string): string {
  // `, junk ,` or `, junk\n  "key"` → `,`
  let s = text.replace(
    /,\s*[A-Za-z_$][\w$]*\s*(?=,|\n\s*")/g,
    ",",
  );
  // `{ junk "key"` → `{ "key"`
  s = s.replace(/([{,]\s*)[A-Za-z_$][\w$]*\s+(?=")/g, "$1");
  // Between values without comma: `} junk {` already rare; skip
  return s;
}

function extractLikelyJson(text: string): string | null {
  const startObj = text.indexOf("{");
  const startArr = text.indexOf("[");
  let start = -1;
  if (startObj >= 0 && startArr >= 0) start = Math.min(startObj, startArr);
  else start = Math.max(startObj, startArr);
  if (start < 0) return null;

  const slice = text.slice(start);
  // Prefer longest balanced prefix
  const balanced = longestBalancedPrefix(slice);
  return balanced || slice;
}

function longestBalancedPrefix(text: string): string | null {
  let inString = false;
  let escape = false;
  const stack: string[] = [];
  let lastBalanced = -1;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === "\\") {
        escape = true;
        continue;
      }
      if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{" || ch === "[") {
      stack.push(ch === "{" ? "}" : "]");
    } else if (ch === "}" || ch === "]") {
      if (!stack.length || stack[stack.length - 1] !== ch) break;
      stack.pop();
      if (stack.length === 0) lastBalanced = i;
    }
  }

  if (lastBalanced >= 0) return text.slice(0, lastBalanced + 1);
  return null;
}

function salvageAround(text: string, position: number): string[] {
  const pos = Math.min(Math.max(position, 0), text.length);
  const prefix = text.slice(0, pos);
  const withoutChar = text.slice(0, pos) + text.slice(pos + 1);
  const skipToken = text.slice(0, pos) + text.slice(pos).replace(/^[^\s,:\[\]{}"]+/, "");

  return [
    closeOpenStructures(stripTrailingIncomplete(prefix)),
    closeOpenStructures(prefix),
    closeOpenStructures(stripTrailingIncomplete(withoutChar)),
    closeOpenStructures(stripMidEditJunk(withoutChar)),
    closeOpenStructures(stripTrailingIncomplete(skipToken)),
  ].filter((s, i, arr) => s.trim() && arr.indexOf(s) === i);
}

function mergeFixes(base: RepairFixId[], extra: RepairFixId[]): RepairFixId[] {
  const set = new Set([...base, ...extra]);
  return [...set];
}

/** Heuristic scan of common JSON defects (for status chips). */
export function detectIssues(text: string): RepairFixId[] {
  const found = new Set<RepairFixId>();

  if (/^```/m.test(text) || /```\s*$/m.test(text)) {
    found.add("code-fence");
  }
  if (/\/\*[\s\S]*?\*\/|\/\/[^\n\r]*/.test(text)) {
    found.add("comments");
  }
  if (/,\s*[}\]]/.test(text)) {
    found.add("trailing-commas");
  }
  if (/(^|[^\\])'/.test(text)) {
    found.add("single-quotes");
  }
  if (/[\u201C\u201D\u2018\u2019\u00AB\u00BB]/.test(text)) {
    found.add("smart-quotes");
  }
  if (/([{,]\s*)([A-Za-z_$][\w$]*)(\s*:)/.test(text)) {
    found.add("unquoted-keys");
  }
  if (/\b(None|True|False)\b/.test(text)) {
    found.add("python-literals");
  }
  if (/\bundefined\b/.test(text)) {
    found.add("js-undefined");
  }
  if (/^\s*[A-Za-z_$][\w$]*\s*\(/.test(text)) {
    found.add("jsonp");
  }
  if (
    /^\\?"/.test(text.trimStart()) &&
    /\\["\\/bfnrtu]/.test(text) &&
    !text.trimStart().startsWith("{") &&
    !text.trimStart().startsWith("[")
  ) {
    found.add("escaped-string");
  }
  if (
    /\b(NumberLong|NumberInt|NumberDecimal|ISODate|ObjectId|Binary)\s*\(/.test(
      text,
    )
  ) {
    found.add("mongodb");
  }
  if (/\.\.\./.test(text)) {
    found.add("ellipsis");
  }
  if (/"\s*\+\s*"/.test(text)) {
    found.add("string-concat");
  }
  if (/[\u00A0\u2000-\u200B\u2028\u2029\uFEFF]/.test(text)) {
    found.add("whitespace");
  }

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (
    lines.length >= 2 &&
    lines.every(
      (l) =>
        (l.startsWith("{") && l.endsWith("}")) ||
        (l.startsWith("[") && l.endsWith("]")),
    )
  ) {
    found.add("ndjson");
  }

  const open = (text.match(/[{[]/g) ?? []).length;
  const close = (text.match(/[}\]]/g) ?? []).length;
  if (open !== close) {
    found.add("missing-brackets");
  }
  if (/[}\]"'\d]\s*\n\s*[{\["'\w]/.test(text) && !found.has("ndjson")) {
    found.add("missing-commas");
  }

  return [...found];
}

function refineFixes(
  original: string,
  repaired: string,
  suspected: RepairFixId[],
): RepairFixId[] {
  if (suspected.length > 0) return suspected;

  const openO = (original.match(/[{[]/g) ?? []).length;
  const closeO = (original.match(/[}\]]/g) ?? []).length;
  const openR = (repaired.match(/[{[]/g) ?? []).length;
  const closeR = (repaired.match(/[}\]]/g) ?? []).length;
  if (openO !== closeO && openR === closeR) {
    return ["missing-brackets"];
  }
  if (original.replace(/\s+/g, "") !== repaired.replace(/\s+/g, "")) {
    return ["missing-commas"];
  }
  return ["whitespace"];
}

function locFromPosition(
  text: string,
  position: number | undefined,
): { line?: number; column?: number } {
  if (position == null || position < 0) return {};
  let line = 1;
  let column = 1;
  const end = Math.min(position, text.length);
  for (let i = 0; i < end; i++) {
    if (text[i] === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }
  return { line, column };
}
