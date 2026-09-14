import { faAlbums } from "@/lib/api/fa/albums";
import { faComments } from "@/lib/api/fa/comments";
import { faCountries } from "@/lib/api/fa/countries";
import { faNotifications } from "@/lib/api/fa/notifications";
import { faPhotos } from "@/lib/api/fa/photos";
import { faPosts } from "@/lib/api/fa/posts";
import { faProducts } from "@/lib/api/fa/products";
import { faTodos } from "@/lib/api/fa/todos";
import { faUsers } from "@/lib/api/fa/users";
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

function localizeOne(
  resource: LocaleResource,
  row: Record<string, unknown>,
): Record<string, unknown> {
  switch (resource) {
    case "users":
    case "auth": {
      const key = String(row.username ?? "");
      return applyOverlay(row, faUsers[key] as Record<string, unknown> | undefined);
    }
    case "posts": {
      const key = String(row.title ?? "");
      return applyOverlay(row, faPosts[key] as Record<string, unknown> | undefined);
    }
    case "comments": {
      const key = String(row.body ?? "");
      return applyOverlay(
        row,
        faComments[key] as Record<string, unknown> | undefined,
      );
    }
    case "albums": {
      const key = String(row.id ?? "");
      return applyOverlay(
        row,
        faAlbums[key] as Record<string, unknown> | undefined,
      );
    }
    case "photos": {
      const key = String(row.title ?? "");
      return applyOverlay(
        row,
        faPhotos[key] as Record<string, unknown> | undefined,
      );
    }
    case "todos": {
      const key = String(row.title ?? "");
      return applyOverlay(row, faTodos[key] as Record<string, unknown> | undefined);
    }
    case "products": {
      const key = String(row.name ?? "");
      return applyOverlay(
        row,
        faProducts[key] as Record<string, unknown> | undefined,
      );
    }
    case "notifications": {
      const key = String(row.title ?? "");
      return applyOverlay(
        row,
        faNotifications[key] as Record<string, unknown> | undefined,
      );
    }
    case "countries": {
      const key = String(row.code ?? "");
      return applyOverlay(
        row,
        faCountries[key] as Record<string, unknown> | undefined,
      );
    }
    default:
      return row;
  }
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
