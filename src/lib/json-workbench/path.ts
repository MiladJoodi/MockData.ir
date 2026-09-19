/** Shared JSONPath-style path helpers for Workbench tools. */

export function childPath(parent: string, name: string, isArray: boolean): string {
  if (isArray) return `${parent}[${name}]`;
  if (/^[A-Za-z_$][\w$]*$/.test(name)) {
    return parent === "$" ? `$.${name}` : `${parent}.${name}`;
  }
  return `${parent}[${JSON.stringify(name)}]`;
}

export function formatJsonPreview(value: unknown): string {
  if (typeof value === "string") return JSON.stringify(value);
  if (value === null) return "null";
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    const s = JSON.stringify(value);
    if (s.length <= 80) return s;
    return `${s.slice(0, 77)}…`;
  } catch {
    return String(value);
  }
}
