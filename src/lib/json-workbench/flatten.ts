/**
 * Flatten nested objects/arrays to dot-path keys.
 * Arrays use numeric segments: user.skills.0
 */

export function flattenJson(value: unknown): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  function walk(node: unknown, path: string) {
    if (Array.isArray(node)) {
      if (node.length === 0) {
        if (path) out[path] = [];
        return;
      }
      node.forEach((item, i) => {
        walk(item, path ? `${path}.${i}` : String(i));
      });
      return;
    }
    if (node && typeof node === "object") {
      const entries = Object.entries(node as Record<string, unknown>);
      if (entries.length === 0) {
        if (path) out[path] = {};
        return;
      }
      for (const [key, child] of entries) {
        walk(child, path ? `${path}.${key}` : key);
      }
      return;
    }
    if (path) out[path] = node;
    else out["value"] = node;
  }

  if (value === null || typeof value !== "object") {
    return { value };
  }

  walk(value, "");
  return out;
}

/**
 * Unflatten dot-path keys back into nested objects/arrays.
 * Numeric-only segments at a level become array indices.
 */
export function unflattenJson(
  value: unknown,
): { ok: true; value: unknown } | { ok: false; message: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      ok: false,
      message: "Unflatten needs a plain object of path keys.",
    };
  }

  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 1 && entries[0]![0] === "value") {
    const only = entries[0]![1];
    if (only === null || typeof only !== "object") {
      return { ok: true, value: only };
    }
  }

  type Node = Record<string, unknown> | unknown[];
  const root: Record<string, unknown> = {};

  for (const [path, leaf] of entries) {
    if (!path) {
      return { ok: false, message: "Invalid empty path key." };
    }
    const parts = path.split(".");
    let cursor: Node = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!;
      const last = i === parts.length - 1;
      if (last) {
        if (Array.isArray(cursor)) {
          const idx = Number(part);
          if (!Number.isInteger(idx) || idx < 0) {
            return {
              ok: false,
              message: `Invalid array index in path: ${path}`,
            };
          }
          cursor[idx] = leaf;
        } else {
          cursor[part] = leaf;
        }
        break;
      }

      const nextPart = parts[i + 1]!;
      const nextIsIndex = /^\d+$/.test(nextPart);

      if (Array.isArray(cursor)) {
        const idx = Number(part);
        if (!Number.isInteger(idx) || idx < 0) {
          return {
            ok: false,
            message: `Invalid array index in path: ${path}`,
          };
        }
        if (cursor[idx] === undefined) {
          cursor[idx] = nextIsIndex ? [] : {};
        }
        cursor = cursor[idx] as Node;
      } else {
        if (cursor[part] === undefined) {
          cursor[part] = nextIsIndex ? [] : {};
        }
        const child = cursor[part];
        if (
          !child ||
          typeof child !== "object" ||
          (nextIsIndex && !Array.isArray(child)) ||
          (!nextIsIndex && Array.isArray(child))
        ) {
          cursor[part] = nextIsIndex ? [] : {};
        }
        cursor = cursor[part] as Node;
      }
    }
  }

  return { ok: true, value: compactArrays(root) };
}

function compactArrays(node: unknown): unknown {
  if (Array.isArray(node)) {
    return node.map((item) =>
      item === undefined ? null : compactArrays(item),
    );
  }
  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      out[k] = compactArrays(v);
    }
    return out;
  }
  return node;
}
