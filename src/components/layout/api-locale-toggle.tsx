"use client";

import { useEffect, useState } from "react";
import {
  API_LOCALE_EVENT,
  API_LOCALE_STORAGE_KEY,
  type ApiLocale,
} from "@/lib/api/locale-constants";
import { cn } from "@/lib/utils";

function readStoredLocale(): ApiLocale {
  try {
    const value = localStorage.getItem(API_LOCALE_STORAGE_KEY);
    return value === "fa" ? "fa" : "en";
  } catch {
    return "en";
  }
}

function writeStoredLocale(locale: ApiLocale) {
  try {
    localStorage.setItem(API_LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
  // Clear legacy cookie so bare /api/* URLs stay English in the browser.
  document.cookie =
    "mockdata-api-locale=; path=/; max-age=0; SameSite=Lax";
}

export function ApiLocaleToggle() {
  const [locale, setLocale] = useState<ApiLocale>("en");

  useEffect(() => {
    const next = readStoredLocale();
    writeStoredLocale(next); // also clears legacy cookie
    setLocale(next);
  }, []);

  function select(next: ApiLocale) {
    writeStoredLocale(next);
    setLocale(next);
    window.dispatchEvent(
      new CustomEvent(API_LOCALE_EVENT, { detail: next }),
    );
  }

  return (
    <div
      role="group"
      aria-label="API data language"
      className="flex items-center gap-0.5 text-[12px] tabular-nums"
      title={
        locale === "fa"
          ? "Playground uses ?lang=fa"
          : "API default: English"
      }
    >
      <button
        type="button"
        onClick={() => select("en")}
        className={cn(
          "rounded px-1.5 py-1 transition-colors",
          locale === "en"
            ? "font-medium text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <span className="text-border" aria-hidden>
        |
      </span>
      <button
        type="button"
        onClick={() => select("fa")}
        className={cn(
          "rounded px-1.5 py-1 transition-colors",
          locale === "fa"
            ? "font-medium text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-pressed={locale === "fa"}
      >
        FA
      </button>
    </div>
  );
}
