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
