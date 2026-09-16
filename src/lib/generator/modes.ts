import type { GeneratorFieldDef, GeneratorTopic } from "@/lib/generator/types";

/** Fields typical of stored API records — excluded in “payload” (POST body) mode. */
export const GENERATOR_META_FIELDS = new Set([
  "id",
  "createdAt",
  "updatedAt",
  "hiredAt",
  "postedAt",
  "publishedAt",
]);

/** Only these are auto on/off when switching API ↔ Post body. */
const MODE_TOGGLE_FIELDS = ["id", "createdAt", "updatedAt"] as const;

export type GeneratorOutputMode = "payload" | "api";

function sortFieldDefs(fields: GeneratorFieldDef[]): GeneratorFieldDef[] {
  const idField = fields.find((f) => f.id === "id");
  const created = fields.find((f) => f.id === "createdAt");
  const updated = fields.find((f) => f.id === "updatedAt");
  const rest = fields.filter(
    (f) => f.id !== "id" && f.id !== "createdAt" && f.id !== "updatedAt",
  );
  return [
    ...(idField ? [idField] : []),
    ...rest,
    ...(created ? [created] : []),
    ...(updated ? [updated] : []),
  ];
}

/** Initial selection when picking a topic. */
export function fieldsForMode(
  topic: GeneratorTopic,
  mode: GeneratorOutputMode,
): Set<string> {
  const defaults = topic.fields.filter((f) => f.default).map((f) => f.id);

  if (mode === "payload") {
    const set = new Set<string>();
    for (const key of defaults) {
      if (!GENERATOR_META_FIELDS.has(key)) set.add(key);
    }
    return set;
  }

  const ordered: string[] = [];
  if (topic.fields.some((f) => f.id === "id")) ordered.push("id");
  for (const key of defaults) {
    if (key === "id" || key === "createdAt" || key === "updatedAt") continue;
    ordered.push(key);
  }
  for (const key of ["createdAt", "updatedAt"] as const) {
    if (topic.fields.some((f) => f.id === key)) ordered.push(key);
  }
  return new Set(ordered);
}

/**
 * Preserve user field ticks when switching modes.
 * Payload: drop meta fields. API: ensure id / createdAt / updatedAt are on when present.
 */
export function adjustFieldsForMode(
  topic: GeneratorTopic,
  current: ReadonlySet<string>,
  mode: GeneratorOutputMode,
): Set<string> {
  const allowed = new Set(topic.fields.map((f) => f.id));
  const next = new Set<string>();
  for (const key of current) {
    if (!allowed.has(key)) continue;
    if (mode === "payload" && GENERATOR_META_FIELDS.has(key)) continue;
    next.add(key);
  }

  if (mode === "api") {
    for (const key of MODE_TOGGLE_FIELDS) {
      if (allowed.has(key)) next.add(key);
    }
  }

  if (next.size === 0) {
    return fieldsForMode(topic, mode);
  }
  return next;
}

export function visibleFieldsForMode(
  topic: GeneratorTopic,
  mode: GeneratorOutputMode,
) {
  if (mode === "payload") {
    return sortFieldDefs(
      topic.fields.filter((f) => !GENERATOR_META_FIELDS.has(f.id)),
    );
  }
  return sortFieldDefs(topic.fields);
}

/** Stable key order for generated records: id → … → createdAt → updatedAt. */
export function orderedFieldKeys(
  selected: ReadonlySet<string>,
  topic: GeneratorTopic,
): string[] {
  const schemaOrder = sortFieldDefs(topic.fields).map((f) => f.id);
  const out: string[] = [];
  for (const key of schemaOrder) {
    if (selected.has(key)) out.push(key);
  }
  for (const key of selected) {
    if (!out.includes(key)) out.push(key);
  }
  return out;
}
