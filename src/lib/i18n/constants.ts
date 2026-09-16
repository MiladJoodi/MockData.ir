export type UiLocale = "en" | "fa";

export const UI_LOCALE_COOKIE = "mockdata-ui-locale";
export const UI_LOCALE_STORAGE_KEY = "mockdata-ui-locale";
export const UI_LOCALE_EVENT = "mockdata-ui-locale";

export function isUiLocale(value: unknown): value is UiLocale {
  return value === "en" || value === "fa";
}

export function parseUiLocale(value: string | null | undefined): UiLocale {
  return value === "en" ? "en" : "fa";
}
