export type ApiLocale = "en" | "fa";

/** localStorage key for site EN|FA preference (Playground only — API ignores this). */
export const API_LOCALE_STORAGE_KEY = "mockdata-api-locale";

/** Dispatched on `window` when the header EN|FA toggle changes. */
export const API_LOCALE_EVENT = "mockdata-api-locale";

/** Suggested web font for rendering Persian API payloads. */
export const FA_API_FONT = {
  family: "Vazirmatn",
  cssUrl:
    "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap",
} as const;
