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

type Attempt = { text: string; extraFixes: RepairFixId[] };

/**
 * Repair invalid JSON using `jsonrepair` plus aggressive multi-pass
 * preprocessing and salvage for truncated / mid-edit / messy documents.
 */
export function repairJson(raw: string): RepairResult {
  const trimmed = raw.replace(/^\uFEFF/, "").trim();
  if (!trimmed) {
    return { ok: false, message: "Empty input", fixes: [] };
  }

  const direct = parseJson(trimmed);
  if (direct.ok) {
    const unwrapped = tryRepairEmbeddedJsonString(direct.value);
    if (unwrapped) return unwrapped;
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

  let lastError: { message: string; position?: number } = {
    message: "Could not repair JSON",
  };

  for (const attempt of attempts) {
    const outcome = tryParseRepaired(attempt.text);
    if (outcome.ok) {
      return {
        ok: true,
        value: outcome.value,
        text: formatJson(outcome.value),
        fixes: mergeFixes(
          refineFixes(trimmed, outcome.repairedRaw, suspected),
          attempt.extraFixes,
        ),
        alreadyValid: false,
      };
    }
    if (outcome.error) lastError = outcome.error;
  }

  // Progressive salvage from the failure position and from the end
  const salvagePool = [
    ...(lastError.position != null && lastError.position > 0
      ? salvageAround(trimmed, lastError.position)
      : []),
    ...progressiveEndSalvage(trimmed),
    ...lineDropSalvage(trimmed),
  ];

  for (const candidate of salvagePool) {
    const outcome = tryParseRepaired(candidate);
    if (!outcome.ok) continue;
    return {
      ok: true,
      value: outcome.value,
      text: formatJson(outcome.value),
      fixes: mergeFixes(suspected, ["truncated", "missing-brackets"]),
      alreadyValid: false,
    };
  }

  return {
    ok: false,
    message: lastError.message,
    position: lastError.position,
    fixes: suspected,
    ...locFromPosition(trimmed, lastError.position),
  };
}

function tryParseRepaired(text: string):
  | { ok: true; value: unknown; repairedRaw: string }
  | { ok: false; error?: { message: string; position?: number } } {
  const repairedRaw = tryJsonRepair(text);
  if (repairedRaw == null) {
    return { ok: false, error: lastJsonRepairError(text) ?? undefined };
  }
  const parsed = parseJson(repairedRaw);
  if (!parsed.ok) {
    return { ok: false, error: { message: parsed.message } };
  }
  return { ok: true, value: parsed.value, repairedRaw };
}

function buildAttempts(text: string): Attempt[] {
  const normalized = normalizeInput(text);
  const pre = preprocessCommon(normalized);
  const bases: Attempt[] = [
    { text: normalized, extraFixes: [] },
    { text: pre.text, extraFixes: pre.fixes },
  ];

  const variants: Attempt[] = [];
  for (const base of bases) {
    const t = base.text;
    const f = base.extraFixes;
    const preferExtract = hasLeadingProse(t);

    const pushCore = (src: string, fixes: RepairFixId[]) => {
      variants.push(
        { text: src, extraFixes: fixes },
        {
          text: closeOpenStructures(src),
          extraFixes: mergeFixes(fixes, ["missing-brackets"]),
        },
        {
          text: stripTrailingIncomplete(src),
          extraFixes: mergeFixes(fixes, ["truncated"]),
        },
        {
          text: closeOpenStructures(stripTrailingIncomplete(src)),
          extraFixes: mergeFixes(fixes, ["truncated", "missing-brackets"]),
        },
      );
    };

    const extracted = extractLikelyJson(t);
    if (preferExtract && extracted && extracted !== t) {
      pushCore(extracted, mergeFixes(f, ["truncated"]));
      const extractedPre = preprocessCommon(extracted);
      if (extractedPre.text !== extracted) {
        pushCore(
          extractedPre.text,
          mergeFixes(f, ["truncated", ...extractedPre.fixes]),
        );
      }
    }

    const junk = stripMidEditJunk(t);
    const preferJunk =
      junk !== t &&
      /[,{]\s*[A-Za-z_$][\w$]*(?:\s+[A-Za-z_$][\w$]*)+\s*"/.test(t);
    if (preferJunk) {
      pushCore(junk, mergeFixes(f, ["mid-edit-junk"]));
    }

    pushCore(t, f);

    if (junk !== t && !preferJunk) {
      pushCore(junk, mergeFixes(f, ["mid-edit-junk"]));
    }

    if (!preferExtract && extracted && extracted !== t) {
      pushCore(extracted, mergeFixes(f, ["truncated"]));
    }

    const ndjson = tryNdjsonArray(t);
    if (ndjson) {
      variants.push({
        text: ndjson,
        extraFixes: mergeFixes(f, ["ndjson"]),
      });
    }

    const unescaped = tryUnwrapEscapedJsonString(t);
    if (unescaped) {
      const innerPre = preprocessCommon(unescaped);
      pushCore(unescaped, mergeFixes(f, ["escaped-string"]));
      if (innerPre.text !== unescaped) {
        pushCore(
          innerPre.text,
          mergeFixes(f, ["escaped-string", ...innerPre.fixes]),
        );
      }
    }

    const singleQuoted = trySingleQuotesToDouble(t);
    if (singleQuoted && singleQuoted !== t) {
      pushCore(singleQuoted, mergeFixes(f, ["single-quotes"]));
    }
  }

  const seen = new Set<string>();
  return variants.filter((a) => {
    if (seen.has(a.text) || !a.text.trim()) return false;
    seen.add(a.text);
    return true;
  });
}

/** Valid JSON that is itself a string wrapping JSON → unwrap & repair. */
function tryRepairEmbeddedJsonString(value: unknown): RepairResult | null {
  if (typeof value !== "string") return null;
  const inner = value.trim();
  if (!(inner.startsWith("{") || inner.startsWith("["))) return null;
  if (inner.length < 2) return null;

  const nested = repairJson(inner);
  if (!nested.ok) return null;
  return {
    ok: true,
    value: nested.value,
    text: nested.text,
    fixes: mergeFixes(["escaped-string"], nested.fixes),
    alreadyValid: false,
  };
}

function hasLeadingProse(text: string): boolean {
  const start = text.search(/[{[]/);
  return start > 0 && /[A-Za-z\u0600-\u06FF]/.test(text.slice(0, start));
}

/** Shared literal / wrapper cleanups before jsonrepair. */
function preprocessCommon(text: string): {
  text: string;
  fixes: RepairFixId[];
} {
  const fixes: RepairFixId[] = [];
  let s = text;

  if (/\/\*[\s\S]*?\*\/|^\s*\/\/|[^:]\s*\/\/[^\n\r]*/m.test(s)) {
    const next = stripComments(s);
    if (next !== s) {
      s = next;
      fixes.push("comments");
    }
  }

  if (/[\u201C\u201D\u2018\u2019\u00AB\u00BB]/.test(s)) {
    s = s
      .replace(/[\u201C\u201D\u00AB\u00BB]/g, '"')
      .replace(/[\u2018\u2019]/g, "'");
    fixes.push("smart-quotes");
  }

  if (/\b(None|True|False)\b/.test(s)) {
    s = s
      .replace(/\bNone\b/g, "null")
      .replace(/\bTrue\b/g, "true")
      .replace(/\bFalse\b/g, "false");
    fixes.push("python-literals");
  }

  if (/\bundefined\b/.test(s)) {
    s = s.replace(/\bundefined\b/g, "null");
    fixes.push("js-undefined");
  }

  if (/\.\.\./.test(s)) {
    s = s
      .replace(/,\s*\.\.\.(\s*,)?/g, ",")
      .replace(/\.\.\.\s*,?/g, "")
      .replace(/,\s*([}\]])/g, "$1");
    fixes.push("ellipsis");
  }

  if (/"\s*\+\s*"/.test(s)) {
    s = s.replace(/"\s*\+\s*"/g, "");
    fixes.push("string-concat");
  }

  if (
    /\b(NumberLong|NumberInt|NumberDecimal|ISODate|ObjectId|Binary)\s*\(/.test(s)
  ) {
    s = s
      .replace(
        /\b(?:NumberLong|NumberInt|NumberDecimal|ObjectId|Binary)\s*\(\s*(["'][^"']*["']|-?\d+(?:\.\d+)?)\s*\)/g,
        "$1",
      )
      .replace(/\bISODate\s*\(\s*(["'][^"']*["'])\s*\)/g, "$1");
    fixes.push("mongodb");
  }

  const jsonp = s.match(/^\s*[A-Za-z_$][\w$]*\s*\(([\s\S]*)\)\s*;?\s*$/);
  if (jsonp?.[1]) {
    s = jsonp[1].trim();
    fixes.push("jsonp");
  }

  // Collapse repeated commas (,,,, → ,) then strip trailing ones
  if (/,{2,}/.test(s) || /,\s*,/.test(s)) {
    s = s.replace(/,(?:\s*,)+/g, ",");
    fixes.push("trailing-commas");
  }
  if (/,\s*[}\]]/.test(s)) {
    s = s.replace(/,(\s*[}\]])/g, "$1");
    if (!fixes.includes("trailing-commas")) fixes.push("trailing-commas");
  }

  return { text: s.trim(), fixes };
}

function stripComments(text: string): string {
  let out = "";
  let inString = false;
  let escape = false;
  let i = 0;
  while (i < text.length) {
    const ch = text[i]!;
    const next = text[i + 1];

    if (inString) {
      out += ch;
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      i += 1;
      continue;
    }

    if (ch === '"') {
      inString = true;
      out += ch;
      i += 1;
      continue;
    }

    if (ch === "/" && next === "/") {
      i += 2;
      while (i < text.length && text[i] !== "\n") i += 1;
      continue;
    }
    if (ch === "/" && next === "*") {
      i += 2;
      while (i + 1 < text.length && !(text[i] === "*" && text[i + 1] === "/")) {
        i += 1;
      }
      i += 2;
      continue;
    }

    out += ch;
    i += 1;
  }
  return out;
}

/** Best-effort single-quote string → double-quote (outside already-double strings). */
function trySingleQuotesToDouble(text: string): string | null {
  if (!/(^|[^\\])'/.test(text)) return null;
  let out = "";
  let inDouble = false;
  let escape = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    if (inDouble) {
      out += ch;
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inDouble = false;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      out += ch;
      continue;
    }
    if (ch === "'") {
      out += '"';
      i += 1;
      while (i < text.length) {
        const c = text[i]!;
        if (c === "\\") {
          out += c;
          i += 1;
          if (i < text.length) out += text[i];
          i += 1;
          continue;
        }
        if (c === "'") {
          out += '"';
          break;
        }
        if (c === '"') {
          out += '\\"';
          i += 1;
          continue;
        }
        out += c;
        i += 1;
      }
      continue;
    }
    out += ch;
  }
  return out;
}

function tryNdjsonArray(text: string): string | null {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return null;
  const ok = lines.every(
    (l) =>
      (l.startsWith("{") && l.endsWith("}")) ||
      (l.startsWith("[") && l.endsWith("]")),
  );
  if (!ok) return null;
  return `[${lines.join(",")}]`;
}

function tryUnwrapEscapedJsonString(text: string): string | null {
  const t = text.trim();
  if (!(t.startsWith('"') && t.endsWith('"'))) return null;
  try {
    const inner = JSON.parse(t);
    if (typeof inner === "string" && /[{[]/.test(inner)) return inner.trim();
  } catch {
    /* ignore */
  }
  return null;
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
  s = s.replace(/[\u00A0\u2000-\u200B\u2028\u2029\uFEFF]/g, " ");
  // Strip one or more markdown fences anywhere at edges
  s = s
    .replace(/^```(?:json|JSON|js|javascript)?\s*\r?\n?/i, "")
    .replace(/\r?\n?```\s*$/i, "");
  // Leading prose before first { or [
  const startObj = s.search(/[{[]/);
  if (startObj > 0 && /[A-Za-z\u0600-\u06FF]/.test(s.slice(0, startObj))) {
    // keep — extractLikelyJson handles this as a variant
  }
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
  out = out.replace(/[\s,]+$/u, "");
  while (stack.length) out += stack.pop();
  return out;
}

function stripTrailingIncomplete(text: string): string {
  let s = text.trimEnd();
  for (let pass = 0; pass < 4; pass++) {
    const next = s
      .replace(/,\s*"[^"\\]*(?:\\.[^"\\]*)*"?\s*:?\s*$/u, "")
      .replace(/,\s*[A-Za-z_$][\w$]*\s*:?\s*$/u, "")
      .replace(/:\s*"[^"\\]*(?:\\.[^"\\]*)*"?\s*$/u, "")
      .replace(/:\s*$/u, "")
      .replace(/,\s*$/u, "")
      .replace(/:\s*(true|false|null|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\s*$/u, "");
    if (next === s) break;
    s = next;
  }
  return s;
}

function stripMidEditJunk(text: string): string {
  // Orphan words between a comma/{ and the next quoted key
  let s = text.replace(
    /([,{]\s*)[A-Za-z_$][\w$]*(?:\s+[A-Za-z_$][\w$]*)*\s*(?=")/g,
    "$1",
  );
  // Orphan token before comma or newline+quote (no colon)
  s = s.replace(/,\s*[A-Za-z_$][\w$]*\s*(?=,|\n\s*")/g, ",");
  // `} junk {` or `] junk [`
  s = s.replace(/([}\]])\s+[A-Za-z_$][\w$]*\s+(?=[{[])/g, "$1");
  // Dangling incomplete key: `"key` or `key:` at end already handled elsewhere
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
  const skipToken =
    text.slice(0, pos) + text.slice(pos).replace(/^[^\s,:\[\]{}"]+/, "");
  const skipToComma =
    text.slice(0, pos) + text.slice(pos).replace(/^[^,}\]]*/, "");

  return [
    closeOpenStructures(stripTrailingIncomplete(prefix)),
    closeOpenStructures(prefix),
    closeOpenStructures(stripTrailingIncomplete(withoutChar)),
    closeOpenStructures(stripMidEditJunk(withoutChar)),
    closeOpenStructures(stripTrailingIncomplete(skipToken)),
    closeOpenStructures(stripTrailingIncomplete(skipToComma)),
    ...preprocessThenClose(prefix),
    ...preprocessThenClose(withoutChar),
  ].filter((s, i, arr) => s.trim() && arr.indexOf(s) === i);
}

function preprocessThenClose(text: string): string[] {
  const pre = preprocessCommon(text);
  return [
    closeOpenStructures(stripTrailingIncomplete(pre.text)),
    closeOpenStructures(pre.text),
  ];
}

/** Walk backward, trimming incomplete tails until a repairable prefix remains. */
function progressiveEndSalvage(text: string): string[] {
  const out: string[] = [];
  let s = text;
  for (let i = 0; i < 12; i++) {
    const cutAt = Math.max(
      s.lastIndexOf(","),
      s.lastIndexOf("\n"),
      Math.floor(s.length * 0.9) - 1,
    );
    if (cutAt < 8) break;
    s = stripTrailingIncomplete(s.slice(0, cutAt));
    const closed = closeOpenStructures(s);
    out.push(closed);
    const pre = preprocessCommon(closed);
    if (pre.text !== closed) out.push(closeOpenStructures(pre.text));
  }
  return out.filter((s, i, arr) => s.trim() && arr.indexOf(s) === i);
}

/** Drop suspicious lines and retry (helps pasted logs with noise). */
function lineDropSalvage(text: string): string[] {
  const lines = text.split(/\r?\n/);
  if (lines.length < 3) return [];
  const out: string[] = [];
  // Drop last non-empty line
  const withoutLast = [...lines];
  for (let i = withoutLast.length - 1; i >= 0; i--) {
    if (withoutLast[i]!.trim()) {
      withoutLast.splice(i, 1);
      break;
    }
  }
  out.push(closeOpenStructures(stripTrailingIncomplete(withoutLast.join("\n"))));

  // Keep only lines that look like JSON structure
  const structural = lines
    .filter((l) => /[{}\[\]":,]/.test(l) || !/[A-Za-z\u0600-\u06FF]{4,}/.test(l))
    .join("\n");
  if (structural.trim() && structural !== text) {
    out.push(closeOpenStructures(stripTrailingIncomplete(structural)));
  }
  return out.filter((s, i, arr) => s.trim() && arr.indexOf(s) === i);
}

function mergeFixes(base: RepairFixId[], extra: RepairFixId[]): RepairFixId[] {
  return [...new Set([...base, ...extra])];
}

/** Heuristic scan of common JSON defects (for status chips). */
export function detectIssues(text: string): RepairFixId[] {
  const found = new Set<RepairFixId>();

  if (/^```/m.test(text) || /```\s*$/m.test(text)) found.add("code-fence");
  if (/\/\*[\s\S]*?\*\/|\/\/[^\n\r]*/.test(text)) found.add("comments");
  if (/,\s*[}\]]/.test(text)) found.add("trailing-commas");
  if (/(^|[^\\])'/.test(text)) found.add("single-quotes");
  if (/[\u201C\u201D\u2018\u2019\u00AB\u00BB]/.test(text)) {
    found.add("smart-quotes");
  }
  if (/([{,]\s*)([A-Za-z_$][\w$]*)(\s*:)/.test(text)) {
    found.add("unquoted-keys");
  }
  if (/\b(None|True|False)\b/.test(text)) found.add("python-literals");
  if (/\bundefined\b/.test(text)) found.add("js-undefined");
  if (/^\s*[A-Za-z_$][\w$]*\s*\(/.test(text)) found.add("jsonp");
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
  if (/\.\.\./.test(text)) found.add("ellipsis");
  if (/"\s*\+\s*"/.test(text)) found.add("string-concat");
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
  if (open !== close) found.add("missing-brackets");
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
  if (openO !== closeO && openR === closeR) return ["missing-brackets"];
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
