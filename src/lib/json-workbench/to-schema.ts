import {
  inferJsonType,
  type JsonTypeNode,
} from "@/lib/json-types";

type JsonSchema = Record<string, unknown>;

function toSchema(node: JsonTypeNode): JsonSchema {
  switch (node.kind) {
    case "primitive":
      switch (node.name) {
        case "string":
          return { type: "string" };
        case "integer":
          return { type: "integer" };
        case "number":
          return { type: "number" };
        case "boolean":
          return { type: "boolean" };
        case "null":
          return { type: "null" };
        default:
          return {};
      }
    case "array":
      return {
        type: "array",
        items: toSchema(node.of),
      };
    case "union": {
      const nullish = node.options.some(
        (o) => o.kind === "primitive" && o.name === "null",
      );
      const rest = node.options.filter(
        (o) => !(o.kind === "primitive" && o.name === "null"),
      );
      if (nullish && rest.length === 1) {
        const base = toSchema(rest[0]!);
        const t = base.type;
        if (typeof t === "string") {
          return { ...base, type: [t, "null"] };
        }
        return { anyOf: [base, { type: "null" }] };
      }
      return { anyOf: node.options.map(toSchema) };
    }
    case "object": {
      const properties: Record<string, JsonSchema> = {};
      const required: string[] = [];
      for (const key of Object.keys(node.fields)) {
        properties[key] = toSchema(node.fields[key]!);
        if (!node.optional?.has(key)) required.push(key);
      }
      const schema: JsonSchema = {
        type: "object",
        properties,
      };
      if (required.length) schema.required = required;
      return schema;
    }
  }
}

/** Generate a compact JSON Schema from a JSON sample (no $schema URL). */
export function jsonToJsonSchema(value: unknown): string {
  return `${JSON.stringify(toSchema(inferJsonType(value)), null, 2)}\n`;
}
