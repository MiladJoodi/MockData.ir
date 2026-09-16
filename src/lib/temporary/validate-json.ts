import { z } from "zod";
import {
  TEMPORARY_DURATIONS,
  TEMPORARY_LIMITS,
  type TemporaryDuration,
} from "@/lib/temporary/limits";

export type ValidateIssueCode =
  | "EMPTY"
  | "INVALID_JSON"
  | "TOO_LARGE"
  | "NOT_OBJECT_OR_ARRAY"
  | "TOO_DEEP"
  | "ARRAY_TOO_LONG"
  | "TOO_MANY_KEYS"
  | "UNSAFE_KEY"
  | "AUTO_FIXED";

export type ValidateIssue = {
  code: ValidateIssueCode;
  /** Optional template values for localized messages */
  meta?: { max?: number; key?: string };
};

export type ValidateJsonResult =
  | {
      ok: true;
      data: unknown;
      fixed: boolean;
      fixedText?: string;
      issues: ValidateIssue[];
    }
  | {
      ok: false;
      data?: unknown;
      fixed: boolean;
      fixedText?: string;
      fixedData?: unknown;
      issues: ValidateIssue[];
    };

const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function stripBom(text: string) {
  return text.replace(/^\uFEFF/, "");
}

function stripTrailingCommas(text: string) {
  return text.replace(/,(\s*[}\]])/g, "$1");
}

function removeDangerousKeys(value: unknown): {
  value: unknown;
  removed: boolean;
} {
  let removed = false;

  function walk(node: unknown): unknown {
    if (Array.isArray(node)) return node.map(walk);
    if (node && typeof node === "object") {
      const out: Record<string, unknown> = {};
      for (const [key, child] of Object.entries(
        node as Record<string, unknown>,
      )) {
        if (DANGEROUS_KEYS.has(key)) {
          removed = true;
          continue;
        }
        out[key] = walk(child);
      }
      return out;
    }
    return node;
  }

  return { value: walk(value), removed };
}

function measureStructure(value: unknown, depth = 1): ValidateIssue[] {
  const issues: ValidateIssue[] = [];

  if (depth > TEMPORARY_LIMITS.maxDepth) {
    issues.push({
      code: "TOO_DEEP",
      meta: { max: TEMPORARY_LIMITS.maxDepth },
    });
    return issues;
  }

  if (Array.isArray(value)) {
    if (value.length > TEMPORARY_LIMITS.maxArrayLength) {
      issues.push({
        code: "ARRAY_TOO_LONG",
        meta: { max: TEMPORARY_LIMITS.maxArrayLength },
      });
    }
    for (const item of value) {
      issues.push(...measureStructure(item, depth + 1));
      if (issues.length > 8) break;
    }
    return issues;
  }

  if (value && typeof value === "object") {
    const keys = Object.keys(value as object);
    if (keys.length > TEMPORARY_LIMITS.maxObjectKeys) {
      issues.push({
        code: "TOO_MANY_KEYS",
        meta: { max: TEMPORARY_LIMITS.maxObjectKeys },
      });
    }
    for (const key of keys) {
      if (DANGEROUS_KEYS.has(key)) {
        issues.push({ code: "UNSAFE_KEY", meta: { key } });
      }
      issues.push(
        ...measureStructure(
          (value as Record<string, unknown>)[key],
          depth + 1,
        ),
      );
      if (issues.length > 8) break;
    }
  }

  return issues;
}

function tryParse(text: string): { ok: true; data: unknown } | { ok: false } {
  try {
    return { ok: true, data: JSON.parse(text) as unknown };
  } catch {
    return { ok: false };
  }
}

/** Validate user JSON for Temporary API. Attempts safe auto-fixes when needed. */
export function validateTemporaryJson(raw: string): ValidateJsonResult {
  const trimmed = stripBom(raw).trim();

  if (!trimmed) {
    return { ok: false, fixed: false, issues: [{ code: "EMPTY" }] };
  }

  const byteLength = new TextEncoder().encode(trimmed).length;
  if (byteLength > TEMPORARY_LIMITS.maxBytes) {
    return {
      ok: false,
      fixed: false,
      issues: [
        {
          code: "TOO_LARGE",
          meta: { max: Math.round(TEMPORARY_LIMITS.maxBytes / 1024) },
        },
      ],
    };
  }

  let fixed = false;
  let working = trimmed;
  let parsed = tryParse(working);

  if (!parsed.ok) {
    const repaired = stripTrailingCommas(working);
    if (repaired !== working) {
      const retry = tryParse(repaired);
      if (retry.ok) {
        parsed = retry;
        working = repaired;
        fixed = true;
      }
    }
  }

  if (!parsed.ok) {
    return { ok: false, fixed: false, issues: [{ code: "INVALID_JSON" }] };
  }

  let data = parsed.data;
  const cleaned = removeDangerousKeys(data);
  if (cleaned.removed) {
    data = cleaned.value;
    fixed = true;
    working = JSON.stringify(data, null, 2);
  }

  if (data === null || typeof data !== "object") {
    return {
      ok: false,
      fixed,
      fixedText: fixed ? working : undefined,
      fixedData: fixed ? data : undefined,
      issues: [{ code: "NOT_OBJECT_OR_ARRAY" }],
    };
  }

  const structureIssues = measureStructure(data);
  const blocking = structureIssues.filter((i) => i.code !== "UNSAFE_KEY");

  if (blocking.length > 0) {
    return {
      ok: false,
      data,
      fixed,
      fixedText: fixed ? working : undefined,
      fixedData: fixed ? data : undefined,
      issues: blocking,
    };
  }

  if (fixed) {
    working = JSON.stringify(data, null, 2);
  }

  return {
    ok: true,
    data,
    fixed,
    fixedText: fixed ? working : undefined,
    issues: fixed ? [{ code: "AUTO_FIXED" }] : [],
  };
}

export const createTemporaryApiSchema = z.object({
  name: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  json: z.string().min(1),
  duration: z.enum(TEMPORARY_DURATIONS),
});

export type CreateTemporaryApiInput = z.infer<typeof createTemporaryApiSchema>;

export function isTemporaryDuration(value: string): value is TemporaryDuration {
  return (TEMPORARY_DURATIONS as readonly string[]).includes(value);
}
