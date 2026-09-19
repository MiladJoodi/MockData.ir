import {
  inferJsonType,
  type JsonTypeNode,
} from "@/lib/json-types";

function isValidIdent(name: string): boolean {
  return /^[A-Za-z_$][\w$]*$/.test(name);
}

function formatPropName(name: string): string {
  return isValidIdent(name) ? name : JSON.stringify(name);
}

function tsType(node: JsonTypeNode, indent: number): string {
  const pad = "  ".repeat(indent);
  const padInner = "  ".repeat(indent + 1);

  switch (node.kind) {
    case "primitive":
      if (node.name === "integer") return "number";
      if (node.name === "unknown") return "unknown";
      return node.name;
    case "array":
      return `${tsType(node.of, indent)}[]`;
    case "union":
      return node.options.map((opt) => tsType(opt, indent)).join(" | ");
    case "object": {
      const keys = Object.keys(node.fields);
      if (keys.length === 0) return "Record<string, never>";
      const lines = keys.map((key) => {
        const optional = node.optional?.has(key) ? "?" : "";
        const child = tsType(node.fields[key]!, indent + 1);
        return `${padInner}${formatPropName(key)}${optional}: ${child};`;
      });
      return `{\n${lines.join("\n")}\n${pad}}`;
    }
  }
}

/** Generate a TypeScript interface from a JSON sample. */
export function jsonToTypescript(value: unknown, rootName = "Root"): string {
  const node = inferJsonType(value);

  if (node.kind === "object") {
    const body = tsType(node, 0);
    // body is already `{ ... }`
    return `interface ${rootName} ${body}\n`;
  }

  return `type ${rootName} = ${tsType(node, 0)};\n`;
}
