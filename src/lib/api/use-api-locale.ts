"use client";

import { useEffect, useState } from "react";
import {
  API_LOCALE_EVENT,
  API_LOCALE_STORAGE_KEY,
  type ApiLocale,
} from "@/lib/api/locale-constants";

export function useApiLocale(): ApiLocale {
  const [locale, setLocale] = useState<ApiLocale>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(API_LOCALE_STORAGE_KEY);
      setLocale(stored === "fa" ? "fa" : "en");
    } catch {
      setLocale("en");
    }
    function onLocale(e: Event) {
      const detail = (e as CustomEvent<ApiLocale>).detail;
      if (detail === "fa" || detail === "en") setLocale(detail);
    }
    window.addEventListener(API_LOCALE_EVENT, onLocale);
    return () => window.removeEventListener(API_LOCALE_EVENT, onLocale);
  }, []);

  return locale;
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
