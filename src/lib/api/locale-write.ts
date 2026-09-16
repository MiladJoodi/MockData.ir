import {
  captureFaCreate,
  clearFaRuntimeOverlay,
  partitionFaWrite,
} from "@/lib/api/fa/runtime";
import {
  resolveApiLocale,
  type LocaleResource,
} from "@/lib/api/locale";

/**
 * Apply PATCH body with ?lang=fa awareness: Persian text fields go to
 * runtime FA overlay; other fields update the English DB.
 */
export async function applyLocalizedPatch<
  TId extends string | number,
  T extends { id: TId },
  TPatch extends object,
>(
  request: Request,
  resource: LocaleResource,
  id: TId,
  body: TPatch,
  update: (id: TId, data: TPatch) => Promise<T | null>,
  getById: (id: TId) => Promise<T | null>,
): Promise<T | null> {
  const locale = resolveApiLocale(request);
  const dbPatch = partitionFaWrite(
    resource,
    locale,
    id,
    body as Record<string, unknown>,
  ) as TPatch;

  if (Object.keys(dbPatch as object).length === 0) {
    return getById(id);
  }

  return update(id, dbPatch);
}

export function applyLocalizedCreate(
  request: Request,
  resource: LocaleResource,
  id: string | number,
  body: Record<string, unknown>,
) {
  const locale = resolveApiLocale(request);
  captureFaCreate(resource, locale, id, body);
}

export function applyLocalizedDelete(
  resource: LocaleResource,
  id: string | number,
) {
  clearFaRuntimeOverlay(resource, id);
}
