import type { ApiLocale } from "@/lib/api/locale-constants";

type ResourceKey = string;

/** Text/content fields that belong to the FA view, not the English DB row. */
export const FA_WRITABLE_FIELDS: Record<string, readonly string[]> = {
  users: [
    "name",
    "username",
    "email",
    "phone",
    "company",
    "city",
    "country",
    "bio",
    "website",
    "avatarUrl",
  ],
  posts: ["title", "body", "tags"],
  comments: ["name", "email", "body"],
  albums: ["title"],
  photos: ["title", "url", "thumbnailUrl"],
  todos: ["title"],
  products: ["name", "description", "category", "imageUrl"],
  notifications: ["title", "message"],
  countries: ["name", "capital", "region", "currency", "flagUrl"],
  auth: [],
};

const runtimeFaById = new Map<string, Record<string, unknown>>();

function key(resource: ResourceKey, id: string | number) {
  return `${resource}:${id}`;
}

export function getFaRuntimeOverlay(
  resource: ResourceKey,
  id: string | number,
): Record<string, unknown> | undefined {
  return runtimeFaById.get(key(resource, id));
}

export function setFaRuntimeOverlay(
  resource: ResourceKey,
  id: string | number,
  patch: Record<string, unknown>,
) {
  const k = key(resource, id);
  const prev = runtimeFaById.get(k) ?? {};
  runtimeFaById.set(k, { ...prev, ...patch });
}

export function clearFaRuntimeOverlay(
  resource: ResourceKey,
  id: string | number,
) {
  runtimeFaById.delete(key(resource, id));
}

export function clearAllFaRuntimeOverlays() {
  runtimeFaById.clear();
}

/**
 * When writing with ?lang=fa, keep Persian text in a runtime overlay (by id)
 * and only send non-localized fields to the English DB.
 */
export function partitionFaWrite(
  resource: ResourceKey,
  locale: ApiLocale,
  id: string | number,
  body: Record<string, unknown>,
): Record<string, unknown> {
  if (locale !== "fa") return body;

  const localized = new Set(FA_WRITABLE_FIELDS[resource] ?? []);
  const dbPatch: Record<string, unknown> = {};
  const faPatch: Record<string, unknown> = {};

  for (const [field, value] of Object.entries(body)) {
    if (localized.has(field)) faPatch[field] = value;
    else dbPatch[field] = value;
  }

  if (Object.keys(faPatch).length > 0) {
    setFaRuntimeOverlay(resource, id, faPatch);
  }

  return dbPatch;
}

/** After create with ?lang=fa, store Persian text against the new id. */
export function captureFaCreate(
  resource: ResourceKey,
  locale: ApiLocale,
  id: string | number,
  body: Record<string, unknown>,
) {
  if (locale !== "fa") return;
  partitionFaWrite(resource, locale, id, body);
}
