const STORAGE_KEY = "mockdata-temporary-apis";

export type StoredTemporaryApi = {
  publicId: string;
  name: string;
  url: string;
  createdAt: string;
  expiresAt: string;
  manageToken?: string;
};

function readRaw(): StoredTemporaryApi[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is StoredTemporaryApi =>
        Boolean(
          item &&
            typeof item === "object" &&
            typeof (item as StoredTemporaryApi).publicId === "string" &&
            typeof (item as StoredTemporaryApi).url === "string",
        ),
    );
  } catch {
    return [];
  }
}

function writeRaw(items: StoredTemporaryApi[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function loadStoredTemporaryApis(): StoredTemporaryApi[] {
  const now = Date.now();
  const items = readRaw().filter(
    (item) => new Date(item.expiresAt).getTime() > now,
  );
  writeRaw(items);
  return items;
}

export function upsertStoredTemporaryApi(item: StoredTemporaryApi) {
  const items = loadStoredTemporaryApis().filter(
    (x) => x.publicId !== item.publicId,
  );
  items.unshift(item);
  writeRaw(items);
}

export function removeStoredTemporaryApi(publicId: string) {
  writeRaw(loadStoredTemporaryApis().filter((x) => x.publicId !== publicId));
}

export function clearStoredTemporaryApis() {
  writeRaw([]);
}

export function mergeServerTemporaryList(
  serverItems: Omit<StoredTemporaryApi, "manageToken">[],
): StoredTemporaryApi[] {
  const local = loadStoredTemporaryApis();
  const byId = new Map(local.map((item) => [item.publicId, item]));
  const merged: StoredTemporaryApi[] = serverItems.map((item) => {
    const prev = byId.get(item.publicId);
    return {
      ...item,
      manageToken: prev?.manageToken,
    };
  });
  writeRaw(merged);
  return merged;
}

export function countActiveStored(): number {
  return loadStoredTemporaryApis().length;
}
