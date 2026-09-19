export type RemoveEmptyOptions = {
  nulls?: boolean;
  emptyStrings?: boolean;
  emptyArrays?: boolean;
  emptyObjects?: boolean;
};

const DEFAULTS: Required<RemoveEmptyOptions> = {
  nulls: true,
  emptyStrings: true,
  emptyArrays: true,
  emptyObjects: true,
};

/** Remove empty values recursively. Preserves `false` and `0`. */
export function removeEmpty(
  value: unknown,
  options: RemoveEmptyOptions = {},
): unknown {
  const opts = { ...DEFAULTS, ...options };

  function walk(node: unknown): unknown {
    if (Array.isArray(node)) {
      const items = node
        .map(walk)
        .filter((item) => !shouldDrop(item, opts));
      return items;
    }
    if (node && typeof node === "object") {
      const out: Record<string, unknown> = {};
      for (const [key, child] of Object.entries(
        node as Record<string, unknown>,
      )) {
        const next = walk(child);
        if (!shouldDrop(next, opts)) out[key] = next;
      }
      return out;
    }
    return node;
  }

  return walk(value);
}

function shouldDrop(
  value: unknown,
  opts: Required<RemoveEmptyOptions>,
): boolean {
  if (opts.nulls && value === null) return true;
  if (opts.emptyStrings && value === "") return true;
  if (opts.emptyArrays && Array.isArray(value) && value.length === 0) {
    return true;
  }
  if (
    opts.emptyObjects &&
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value as object).length === 0
  ) {
    return true;
  }
  return false;
}
