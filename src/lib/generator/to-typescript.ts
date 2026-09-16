/** Infer a TypeScript type from one sample record. */

function pascalCase(id: string): string {
  return id
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function valueToTsType(value: unknown, depth = 0): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    return `${valueToTsType(value[0], depth + 1)}[]`;
  }
  switch (typeof value) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "object": {
      if (depth > 2) return "Record<string, unknown>";
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return "Record<string, never>";
      const inner = entries
        .map(([k, v]) => `${JSON.stringify(k)}: ${valueToTsType(v, depth + 1)}`)
        .join("; ");
      return `{ ${inner} }`;
    }
    default:
      return "unknown";
  }
}

export function recordToTypeScript(
  topicId: string,
  sample: Record<string, unknown>,
): string {
  const name = pascalCase(topicId);
  const lines = Object.entries(sample).map(
    ([key, value]) => `  ${key}: ${valueToTsType(value)};`,
  );
  return `type ${name} = {\n${lines.join("\n")}\n};`;
}
