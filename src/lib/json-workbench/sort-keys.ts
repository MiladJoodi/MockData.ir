export type SortDirection = "asc" | "desc";

/** Deep-clone and recursively sort object keys. Arrays keep order. */
export function sortKeys(
  value: unknown,
  direction: SortDirection = "asc",
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sortKeys(item, direction));
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    entries.sort(([a], [b]) =>
      direction === "asc" ? a.localeCompare(b) : b.localeCompare(a),
    );
    const out: Record<string, unknown> = {};
    for (const [key, child] of entries) {
      out[key] = sortKeys(child, direction);
    }
    return out;
  }
  return value;
}
