import {
  inferJsonType,
  type JsonTypeNode,
} from "@/lib/json-types";

function isValidIdent(name: string): boolean {
  return /^[A-Za-z_$][\w$]*$/.test(name);
}

function propKey(name: string): string {
  return isValidIdent(name) ? name : JSON.stringify(name);
}

function zodExpr(node: JsonTypeNode, indent: number): string {
  const padInner = "  ".repeat(indent + 1);
  const pad = "  ".repeat(indent);

  switch (node.kind) {
    case "primitive":
      switch (node.name) {
        case "string":
          return "z.string()";
        case "number":
        case "integer":
          return "z.number()";
        case "boolean":
          return "z.boolean()";
        case "null":
          return "z.null()";
        default:
          return "z.unknown()";
      }
    case "array":
      return `z.array(${zodExpr(node.of, indent)})`;
    case "union": {
      if (node.options.length === 1) return zodExpr(node.options[0]!, indent);
      const nullish = node.options.filter(
        (o) => o.kind === "primitive" && o.name === "null",
      );
      const rest = node.options.filter(
        (o) => !(o.kind === "primitive" && o.name === "null"),
      );
      if (nullish.length && rest.length === 1) {
        return `${zodExpr(rest[0]!, indent)}.nullable()`;
      }
      if (nullish.length && rest.length > 1) {
        const inner = `z.union([${rest.map((o) => zodExpr(o, indent)).join(", ")}])`;
        return `${inner}.nullable()`;
      }
      return `z.union([${node.options.map((o) => zodExpr(o, indent)).join(", ")}])`;
    }
    case "object": {
      const keys = Object.keys(node.fields);
      if (keys.length === 0) return "z.object({})";
      const lines = keys.map((key) => {
        let expr = zodExpr(node.fields[key]!, indent + 1);
        if (node.optional?.has(key)) expr = `${expr}.optional()`;
        return `${padInner}${propKey(key)}: ${expr},`;
      });
      return `z.object({\n${lines.join("\n")}\n${pad}})`;
    }
  }
}

/** Generate a Zod schema source string from a JSON sample. */
export function jsonToZod(value: unknown): string {
  const node = inferJsonType(value);
  const schema = zodExpr(node, 0);
  return `import { z } from "zod";\n\nconst schema = ${schema};\n\nexport type Schema = z.infer<typeof schema>;\n`;
}
