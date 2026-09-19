type JsonSchema = Record<string, unknown>;

export type FromSchemaResult =
  | { ok: true; value: unknown }
  | { ok: false; message: string };

/** Generate a representative JSON value from a limited JSON Schema subset. */
export function generateFromSchema(schema: unknown): FromSchemaResult {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    return { ok: false, message: "Schema must be a JSON object." };
  }
  try {
    return { ok: true, value: build(schema as JsonSchema, 0) };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Could not generate from schema",
    };
  }
}

function build(schema: JsonSchema, depth: number): unknown {
  if (depth > 12) return null;

  if ("default" in schema) return structuredCloneSafe(schema.default);
  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    return structuredCloneSafe(schema.enum[0]);
  }
  if ("const" in schema) return structuredCloneSafe(schema.const);

  const types = normalizeTypes(schema.type);

  if (types.includes("object") || schema.properties) {
    return buildObject(schema, depth);
  }
  if (types.includes("array") || schema.items) {
    return buildArray(schema, depth);
  }
  if (types.includes("string")) return "string";
  if (types.includes("integer")) return 0;
  if (types.includes("number")) return 0;
  if (types.includes("boolean")) return true;
  if (types.includes("null")) return null;

  if (Array.isArray(schema.anyOf) && schema.anyOf[0]) {
    return build(schema.anyOf[0] as JsonSchema, depth + 1);
  }
  if (Array.isArray(schema.oneOf) && schema.oneOf[0]) {
    return build(schema.oneOf[0] as JsonSchema, depth + 1);
  }

  return null;
}

function buildObject(schema: JsonSchema, depth: number): Record<string, unknown> {
  const props = (schema.properties ?? {}) as Record<string, JsonSchema>;
  const required = Array.isArray(schema.required)
    ? (schema.required as string[])
    : Object.keys(props);
  const out: Record<string, unknown> = {};
  const keys = required.length ? required : Object.keys(props);
  for (const key of keys) {
    const child = props[key] ?? {};
    out[key] = build(child, depth + 1);
  }
  return out;
}

function buildArray(schema: JsonSchema, depth: number): unknown[] {
  const items = schema.items;
  if (!items || typeof items !== "object" || Array.isArray(items)) {
    return [];
  }
  const min =
    typeof schema.minItems === "number" && schema.minItems > 0
      ? Math.min(schema.minItems, 3)
      : 1;
  return Array.from({ length: min }, () =>
    build(items as JsonSchema, depth + 1),
  );
}

function normalizeTypes(type: unknown): string[] {
  if (typeof type === "string") return [type];
  if (Array.isArray(type)) {
    return type.filter((t): t is string => typeof t === "string");
  }
  return [];
}

function structuredCloneSafe(value: unknown): unknown {
  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value)) as unknown;
  }
}
