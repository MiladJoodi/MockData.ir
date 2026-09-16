import type { UiLocale } from "./constants";

/** Display dates in What’s new. Uses ASCII digits; locale only affects month names. */
export function formatUiDate(iso: string, locale: UiLocale): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    numberingSystem: "latn",
  });
}

export function formatUiDateShort(iso: string, locale: UiLocale): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", {
    month: "short",
    day: "numeric",
    numberingSystem: "latn",
  });
}

/** Format API `createdAt` timestamps for tables. */
export function formatApiDate(iso: string, locale: UiLocale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  if (locale === "fa") {
    return d.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
