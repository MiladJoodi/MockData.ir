/** Infer a precise, readable type tree from JSON values (playground Types view). */

export type JsonTypeNode =
  | {
      kind: "primitive";
      name: "string" | "number" | "integer" | "boolean" | "null" | "unknown";
      note?: string;
    }
  | { kind: "array"; of: JsonTypeNode }
  | {
      kind: "object";
      fields: Record<string, JsonTypeNode>;
      optional?: ReadonlySet<string>;
    }
  | { kind: "union"; options: JsonTypeNode[] };

const ISO_DATE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\//i;

function stringNote(value: string): string | undefined {
  if (ISO_DATE.test(value)) return "date-time";
  if (UUID.test(value)) return "uuid";
  if (EMAIL.test(value)) return "email";
  if (URL_RE.test(value)) return "url";
  return undefined;
}

function typeKey(node: JsonTypeNode): string {
  switch (node.kind) {
    case "primitive":
      return `p:${node.name}:${node.note ?? ""}`;
    case "array":
      return `a:${typeKey(node.of)}`;
    case "union":
      return `u:${node.options.map(typeKey).sort().join("|")}`;
    case "object":
      return `o:${Object.keys(node.fields).sort().join(",")}`;
  }
}

function mergeTypes(nodes: JsonTypeNode[]): JsonTypeNode {
  if (nodes.length === 0) return { kind: "primitive", name: "unknown" };
  if (nodes.length === 1) return nodes[0]!;

  const objects = nodes.filter(
    (n): n is Extract<JsonTypeNode, { kind: "object" }> => n.kind === "object",
  );
  if (objects.length === nodes.length) {
    const keys = new Set(objects.flatMap((n) => Object.keys(n.fields)));
    const fields: Record<string, JsonTypeNode> = {};
    const optional = new Set<string>();
    for (const key of keys) {
      const present = objects.filter((n) => key in n.fields);
      if (present.length < objects.length) optional.add(key);
      fields[key] = mergeTypes(present.map((n) => n.fields[key]!));
    }
    return {
      kind: "object",
      fields,
      optional: optional.size > 0 ? optional : undefined,
    };
  }

  const arrays = nodes.filter(
    (n): n is Extract<JsonTypeNode, { kind: "array" }> => n.kind === "array",
  );
  if (arrays.length === nodes.length) {
    return { kind: "array", of: mergeTypes(arrays.map((n) => n.of)) };
  }

  const byKey = new Map<string, JsonTypeNode>();
  for (const node of nodes) {
    if (node.kind === "union") {
      for (const opt of node.options) byKey.set(typeKey(opt), opt);
    } else {
      byKey.set(typeKey(node), node);
    }
  }
  const options = [...byKey.values()];
  if (options.length === 1) return options[0]!;
  return { kind: "union", options };
}

export function inferJsonType(value: unknown): JsonTypeNode {
  if (value === null) return { kind: "primitive", name: "null" };
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { kind: "array", of: { kind: "primitive", name: "unknown" } };
    }
    const sample = value.slice(0, 40).map(inferJsonType);
    return { kind: "array", of: mergeTypes(sample) };
  }
  switch (typeof value) {
    case "boolean":
      return { kind: "primitive", name: "boolean" };
    case "number":
      return Number.isInteger(value)
        ? { kind: "primitive", name: "integer" }
        : { kind: "primitive", name: "number" };
    case "string": {
      const note = stringNote(value);
      return note
        ? { kind: "primitive", name: "string", note }
        : { kind: "primitive", name: "string" };
    }
    case "object": {
      const fields: Record<string, JsonTypeNode> = {};
      for (const [key, child] of Object.entries(
        value as Record<string, unknown>,
      )) {
        fields[key] = inferJsonType(child);
      }
      return { kind: "object", fields };
    }
    default:
      return { kind: "primitive", name: "unknown" };
  }
}

function formatNode(node: JsonTypeNode, indent: number): string {
  const pad = "  ".repeat(indent);
  const padInner = "  ".repeat(indent + 1);

  switch (node.kind) {
    case "primitive":
      return node.note ? `${node.name} /* ${node.note} */` : node.name;
    case "array":
      if (node.of.kind === "object") {
        return `Array<${formatNode(node.of, indent)}>`;
      }
      if (node.of.kind === "union") {
        return `Array<${formatNode(node.of, indent)}>`;
      }
      return `${formatNode(node.of, indent)}[]`;
    case "union":
      return node.options.map((opt) => formatNode(opt, indent)).join(" | ");
    case "object": {
      const keys = Object.keys(node.fields);
      if (keys.length === 0) return "{}";
      const lines = keys.map((key) => {
        const optional = node.optional?.has(key) ? "?" : "";
        const child = formatNode(node.fields[key]!, indent + 1);
        const multiline = child.includes("\n");
        if (multiline) {
          return `${padInner}${key}${optional}: ${child}`;
        }
        return `${padInner}${key}${optional}: ${child}`;
      });
      return `{\n${lines.join("\n")}\n${pad}}`;
    }
  }
}

/** Pretty TypeScript-like type string for a JSON value. */
export function formatJsonTypes(value: unknown): string {
  return formatNode(inferJsonType(value), 0);
}

/** Parse response text and return types, or an error comment. */
export function typesFromResponseText(text: string): string {
  const trimmed = text.trim();
  if (!trimmed || trimmed.startsWith("//")) {
    return "// No JSON response yet";
  }
  try {
    return formatJsonTypes(JSON.parse(trimmed));
  } catch {
    return "// Response is not valid JSON";
  }
}
