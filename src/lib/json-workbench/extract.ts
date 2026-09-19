/** Collect nested object key paths (dot notation). Array indices included. */
export function extractKeys(value: unknown): string[] {
  return extractEntries(value).map((e) => e.path);
}

/**
 * Every selectable field path in the document (objects, arrays, and leaves).
 * Parents appear before children — good for pick/omit chip UIs.
 */
export function listFieldPaths(value: unknown): string[] {
  const paths: string[] = [];

  function walk(node: unknown, path: string) {
    if (path) paths.push(path);

    if (Array.isArray(node)) {
      node.forEach((item, i) => {
        walk(item, path ? `${path}.${i}` : String(i));
      });
      return;
    }
    if (node && typeof node === "object") {
      for (const [key, child] of Object.entries(
        node as Record<string, unknown>,
      )) {
        walk(child, path ? `${path}.${key}` : key);
      }
    }
  }

  if (Array.isArray(value)) {
    value.forEach((item, i) => walk(item, String(i)));
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(
      value as Record<string, unknown>,
    )) {
      walk(child, key);
    }
  }

  return paths;
}

/** Collect all leaf values (primitives + null), depth-first. */
export function extractValues(value: unknown): unknown[] {
  return extractEntries(value).map((e) => e.value);
}

export type ExtractEntry = { path: string; value: unknown };

/** Leaf path + value pairs mixed together. */
export function extractEntries(value: unknown): ExtractEntry[] {
  const entries: ExtractEntry[] = [];

  function walk(node: unknown, path: string) {
    if (Array.isArray(node)) {
      if (node.length === 0) {
        if (path) entries.push({ path, value: node });
        return;
      }
      node.forEach((item, i) => {
        const next = path ? `${path}.${i}` : String(i);
        walk(item, next);
      });
      return;
    }
    if (node && typeof node === "object") {
      const obj = node as Record<string, unknown>;
      const keys = Object.keys(obj);
      if (keys.length === 0) {
        if (path) entries.push({ path, value: node });
        return;
      }
      for (const [key, child] of Object.entries(obj)) {
        const next = path ? `${path}.${key}` : key;
        walk(child, next);
      }
      return;
    }
    if (path) entries.push({ path, value: node });
    else entries.push({ path: "$", value: node });
  }

  walk(value, "");
  return entries;
}
