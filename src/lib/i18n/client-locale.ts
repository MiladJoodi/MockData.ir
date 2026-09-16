import {
  parseUiLocale,
  UI_LOCALE_COOKIE,
  UI_LOCALE_EVENT,
  UI_LOCALE_STORAGE_KEY,
  type UiLocale,
} from "./constants";
import {
  API_LOCALE_EVENT,
  API_LOCALE_STORAGE_KEY,
  type ApiLocale,
} from "@/lib/api/locale-constants";

export function readStoredUiLocale(): UiLocale {
  try {
    return parseUiLocale(localStorage.getItem(UI_LOCALE_STORAGE_KEY));
  } catch {
    return "fa";
  }
}

export function writeUiLocale(locale: UiLocale) {
  try {
    localStorage.setItem(UI_LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }

  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${UI_LOCALE_COOKIE}=${locale}; path=/; max-age=${maxAge}; SameSite=Lax`;

  // Keep API sample-data preference in sync with UI language.
  const apiLocale: ApiLocale = locale === "fa" ? "fa" : "en";
  try {
    localStorage.setItem(API_LOCALE_STORAGE_KEY, apiLocale);
  } catch {
    /* ignore */
  }
  document.cookie =
    "mockdata-api-locale=; path=/; max-age=0; SameSite=Lax";

  window.dispatchEvent(
    new CustomEvent(UI_LOCALE_EVENT, { detail: locale }),
  );
  window.dispatchEvent(
    new CustomEvent(API_LOCALE_EVENT, { detail: apiLocale }),
  );
}

export function applyDocumentLocale(locale: UiLocale) {
  const root = document.documentElement;
  root.lang = locale === "fa" ? "fa" : "en";
  root.dir = locale === "fa" ? "rtl" : "ltr";
  root.classList.toggle("font-fa", locale === "fa");
}
