export type CsvConvertOk = { ok: true; output: string };
export type CsvConvertErr = { ok: false; message: string };
export type CsvConvertResult = CsvConvertOk | CsvConvertErr;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

function escapeCsvField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function cellFromJson(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

function isPrimitive(v: unknown): boolean {
  return (
    v === null ||
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  );
}

/**
 * Normalize any common JSON shape into rows of plain objects:
 * - array of objects → as-is
 * - single object → one row
 * - object with one array-of-objects field → that array
 * - array of primitives → { value } rows
 */
function toObjectRows(
  value: unknown,
): { ok: true; rows: Record<string, unknown>[] } | CsvConvertErr {
  if (Array.isArray(value)) {
    if (value.length === 0) return { ok: true, rows: [] };
    if (value.every(isPlainObject)) {
      return { ok: true, rows: value as Record<string, unknown>[] };
    }
    if (value.every(isPrimitive)) {
      return {
        ok: true,
        rows: value.map((v) => ({ value: v })),
      };
    }
    return {
      ok: false,
      message: "JSON → CSV needs an array of objects or primitives.",
    };
  }

  if (isPlainObject(value)) {
    const nestedTables = Object.entries(value).filter(
      ([, v]) =>
        Array.isArray(v) &&
        v.length > 0 &&
        (v as unknown[]).every(isPlainObject),
    );
    if (nestedTables.length === 1) {
      return {
        ok: true,
        rows: nestedTables[0]![1] as Record<string, unknown>[],
      };
    }
    return { ok: true, rows: [value] };
  }

  if (isPrimitive(value)) {
    return { ok: true, rows: [{ value }] };
  }

  return {
    ok: false,
    message: "JSON → CSV could not convert this value.",
  };
}

/** Convert JSON into CSV (object, array of objects, or nested table). */
export function jsonToCsv(value: unknown): CsvConvertResult {
  const normalized = toObjectRows(value);
  if (!normalized.ok) return normalized;

  const { rows } = normalized;
  if (rows.length === 0) {
    return { ok: true, output: "\n" };
  }

  const keys: string[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!seen.has(key)) {
        seen.add(key);
        keys.push(key);
      }
    }
  }

  if (keys.length === 0) {
    return { ok: true, output: "\n" };
  }

  const lines = [
    keys.map(escapeCsvField).join(","),
    ...rows.map((row) =>
      keys.map((key) => escapeCsvField(cellFromJson(row[key]))).join(","),
    ),
  ];
  return { ok: true, output: `${lines.join("\n")}\n` };
}

/** Parse CSV text into an array of objects (string cells, light coercion). */
export function csvToJson(csvText: string): CsvConvertResult {
  const text = csvText
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
  if (!text.trim()) return { ok: false, message: "Empty input" };

  let rows: string[][];
  try {
    rows = parseCsvRows(text);
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Invalid CSV",
    };
  }

  if (!rows.length) return { ok: false, message: "CSV has no rows" };

  const headers = rows[0]!;
  if (!headers.length || headers.every((h) => !h.trim())) {
    return { ok: false, message: "CSV header row is empty" };
  }

  const unique = new Set(headers);
  if (unique.size !== headers.length) {
    return { ok: false, message: "CSV headers must be unique" };
  }

  const dataRows = rows.slice(1).filter((row) => row.some((c) => c !== ""));
  const objects = dataRows.map((row) => {
    const obj: Record<string, unknown> = {};
    headers.forEach((header, i) => {
      obj[header] = coerceCell(row[i] ?? "");
    });
    return obj;
  });

  return {
    ok: true,
    output: `${JSON.stringify(objects, null, 2)}\n`,
  };
}

function coerceCell(raw: string): unknown {
  const t = raw.trim();
  if (t === "") return "";
  if (t === "null") return null;
  if (t === "true") return true;
  if (t === "false") return false;
  if (/^-?\d+$/.test(t)) {
    const n = Number(t);
    if (Number.isSafeInteger(n)) return n;
  }
  if (
    /^-?\d+\.\d+(?:[eE][+-]?\d+)?$/.test(t) ||
    /^-?\d+[eE][+-]?\d+$/.test(t)
  ) {
    const n = Number(t);
    if (!Number.isNaN(n)) return n;
  }
  return raw;
}

function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let i = 0;
  let inQuotes = false;

  while (i < text.length) {
    const ch = text[i]!;

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }
    if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i += 1;
      continue;
    }
    field += ch;
    i += 1;
  }

  if (inQuotes) {
    throw new Error("Unterminated quoted CSV field");
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}
