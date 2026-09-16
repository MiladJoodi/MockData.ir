"use client";

import {
  API_LOCALE_STORAGE_KEY,
  type ApiLocale,
} from "@/lib/api/locale-constants";
import { useUiLocale } from "@/components/providers/ui-locale-provider";

/**
 * Sample-data locale for API calls — follows the UI language
 * (cookie/SSR-safe, no en→fa flash on first paint).
 */
export function useApiLocale(): ApiLocale {
  const { locale } = useUiLocale();
  return locale === "fa" ? "fa" : "en";
}

/** Append `lang=fa` when locale is Persian; leave English URLs unchanged. */
export function withApiLang(path: string, locale: ApiLocale): string {
  if (locale !== "fa") return path;
  try {
    const url = new URL(path, "http://local.invalid");
    url.searchParams.set("lang", "fa");
    return `${url.pathname}${url.search}`;
  } catch {
    return path.includes("?") ? `${path}&lang=fa` : `${path}?lang=fa`;
  }
}

export function readStoredApiLocale(): ApiLocale {
  try {
    return localStorage.getItem(API_LOCALE_STORAGE_KEY) === "fa" ? "fa" : "en";
  } catch {
    return "en";
  }
}
