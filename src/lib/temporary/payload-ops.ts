import { generateItemId } from "@/lib/temporary/ids";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** Shallow-safe deep merge for plain objects (arrays replaced). */
export function deepMerge(
  target: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...target };
  for (const [key, value] of Object.entries(patch)) {
    if (isPlainObject(value) && isPlainObject(out[key])) {
      out[key] = deepMerge(out[key] as Record<string, unknown>, value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

export function ensureItemId(item: unknown): Record<string, unknown> {
  if (isPlainObject(item)) {
    if (item.id == null || item.id === "") {
      return { ...item, id: generateItemId() };
    }
    return item;
  }
  return { id: generateItemId(), value: item };
}

export function findCollectionIndex(
  items: unknown[],
  itemId: string,
): number {
  const byId = items.findIndex(
    (item) =>
      isPlainObject(item) && String((item as { id?: unknown }).id) === itemId,
  );
  if (byId >= 0) return byId;

  if (/^\d+$/.test(itemId)) {
    const index = Number(itemId);
    if (Number.isInteger(index) && index >= 0 && index < items.length) {
      const item = items[index];
      // Only allow numeric index when item has no id field
      if (!isPlainObject(item) || item.id == null) return index;
    }
  }
  return -1;
}
