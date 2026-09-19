function parseFieldList(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function getByPath(root: unknown, path: string): unknown {
  const parts = path.split(".");
  let cur: unknown = root;
  for (const part of parts) {
    if (cur === null || cur === undefined) return undefined;
    if (Array.isArray(cur)) {
      const idx = Number(part);
      if (!Number.isInteger(idx)) return undefined;
      cur = cur[idx];
      continue;
    }
    if (typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
}

function setByPath(
  root: Record<string, unknown>,
  path: string,
  value: unknown,
): void {
  const parts = path.split(".");
  let cur: Record<string, unknown> | unknown[] = root;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]!;
    const last = i === parts.length - 1;
    if (last) {
      if (Array.isArray(cur)) {
        cur[Number(part)] = value;
      } else {
        cur[part] = value;
      }
      return;
    }
    const nextPart = parts[i + 1]!;
    const nextIsIndex = /^\d+$/.test(nextPart);
    if (Array.isArray(cur)) {
      const idx = Number(part);
      if (cur[idx] === undefined) cur[idx] = nextIsIndex ? [] : {};
      cur = cur[idx] as Record<string, unknown> | unknown[];
    } else {
      if (cur[part] === undefined) cur[part] = nextIsIndex ? [] : {};
      cur = cur[part] as Record<string, unknown> | unknown[];
    }
  }
}

/** Keep only listed top-level or dotted paths. */
export function pickFields(
  value: unknown,
  fieldsRaw: string,
): { ok: true; value: unknown } | { ok: false; message: string } {
  const fields = parseFieldList(fieldsRaw);
  if (!fields.length) {
    return { ok: false, message: "Enter at least one field path." };
  }

  // Fast path: all top-level on an object
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    fields.every((f) => !f.includes("."))
  ) {
    const src = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const f of fields) {
      if (Object.prototype.hasOwnProperty.call(src, f)) out[f] = src[f];
    }
    return { ok: true, value: out };
  }

  const out: Record<string, unknown> = {};
  for (const path of fields) {
    const got = getByPath(value, path);
    if (got !== undefined) setByPath(out, path, got);
  }
  return { ok: true, value: out };
}

/** Remove listed top-level or dotted paths. */
export function omitFields(
  value: unknown,
  fieldsRaw: string,
): { ok: true; value: unknown } | { ok: false; message: string } {
  const fields = parseFieldList(fieldsRaw);
  if (!fields.length) {
    return { ok: false, message: "Enter at least one field path." };
  }

  const clone = structuredCloneSafe(value);
  for (const path of fields) {
    deleteByPath(clone, path);
  }
  return { ok: true, value: clone };
}

function deleteByPath(root: unknown, path: string): void {
  const parts = path.split(".");
  let cur: unknown = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]!;
    if (cur === null || typeof cur !== "object") return;
    cur = Array.isArray(cur)
      ? cur[Number(part)]
      : (cur as Record<string, unknown>)[part];
  }
  if (cur === null || typeof cur !== "object") return;
  const last = parts[parts.length - 1]!;
  if (Array.isArray(cur)) {
    const idx = Number(last);
    if (Number.isInteger(idx) && idx >= 0 && idx < cur.length) {
      cur.splice(idx, 1);
    }
  } else {
    delete (cur as Record<string, unknown>)[last];
  }
}

function structuredCloneSafe(value: unknown): unknown {
  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value)) as unknown;
  }
}
