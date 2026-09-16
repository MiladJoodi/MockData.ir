import { faAlbums } from "@/lib/api/fa/albums";
import { faComments } from "@/lib/api/fa/comments";
import { faCountries } from "@/lib/api/fa/countries";
import { faNotifications } from "@/lib/api/fa/notifications";
import { faPhotos } from "@/lib/api/fa/photos";
import { faPosts } from "@/lib/api/fa/posts";
import { faProducts } from "@/lib/api/fa/products";
import { faTodos } from "@/lib/api/fa/todos";
import { faUsers } from "@/lib/api/fa/users";
import { getFaRuntimeOverlay } from "@/lib/api/fa/runtime";
import {
  type ApiLocale,
} from "@/lib/api/locale-constants";

export { type ApiLocale };

export type LocaleResource =
  | "users"
  | "posts"
  | "comments"
  | "albums"
  | "photos"
  | "todos"
  | "products"
  | "notifications"
  | "countries"
  | "auth";

export function resolveApiLocale(request: Request): ApiLocale {
  // Only ?lang=fa → Persian. English is default (no cookie / Accept-Language).
  try {
    const lang = new URL(request.url).searchParams.get("lang")?.toLowerCase();
    if (lang === "fa") return "fa";
  } catch {
    /* ignore */
  }
  return "en";
}

function applyOverlay<T extends Record<string, unknown>>(
  row: T,
  overlay: Record<string, unknown> | undefined,
): T {
  if (!overlay) return row;
  return { ...row, ...overlay };
}

function seedOverlay(
  resource: LocaleResource,
  row: Record<string, unknown>,
): Record<string, unknown> | undefined {
  switch (resource) {
    case "users":
    case "auth": {
      const k = String(row.username ?? "");
      return faUsers[k] as Record<string, unknown> | undefined;
    }
    case "posts": {
      const k = String(row.title ?? "");
      return faPosts[k] as Record<string, unknown> | undefined;
    }
    case "comments": {
      const k = String(row.body ?? "");
      return faComments[k] as Record<string, unknown> | undefined;
    }
    case "albums": {
      const k = String(row.id ?? "");
      return faAlbums[k] as Record<string, unknown> | undefined;
    }
    case "photos": {
      const k = String(row.title ?? "");
      return faPhotos[k] as Record<string, unknown> | undefined;
    }
    case "todos": {
      const k = String(row.title ?? "");
      return faTodos[k] as Record<string, unknown> | undefined;
    }
    case "products": {
      const k = String(row.name ?? "");
      return faProducts[k] as Record<string, unknown> | undefined;
    }
    case "notifications": {
      const k = String(row.title ?? "");
      return faNotifications[k] as Record<string, unknown> | undefined;
    }
    case "countries": {
      const k = String(row.code ?? "");
      return faCountries[k] as Record<string, unknown> | undefined;
    }
    default:
      return undefined;
  }
}

function localizeOne(
  resource: LocaleResource,
  row: Record<string, unknown>,
): Record<string, unknown> {
  const withSeed = applyOverlay(row, seedOverlay(resource, row));
  const id = row.id;
  if (id == null) return withSeed;
  const runtimeResource = resource === "auth" ? "users" : resource;
  // Runtime edits (PATCH/POST ?lang=fa) win over seed overlays.
  return applyOverlay(
    withSeed,
    getFaRuntimeOverlay(runtimeResource, id as string | number),
  );
}

export function localizePayload(
  resource: LocaleResource,
  data: unknown,
  locale: ApiLocale,
): unknown {
  if (locale !== "fa" || data == null) return data;

  if (Array.isArray(data)) {
    return data.map((item) =>
      item && typeof item === "object"
        ? localizeOne(resource, item as Record<string, unknown>)
        : item,
    );
  }

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    // Auth login shape: { token, tokenType, expiresIn, user }
    if (resource === "auth" && obj.user && typeof obj.user === "object") {
      return {
        ...obj,
        user: localizeOne("users", obj.user as Record<string, unknown>),
      };
    }
    return localizeOne(resource, obj);
  }

  return data;
}
