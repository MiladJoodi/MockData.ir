import type { GeneratorCountryCode } from "@/lib/generator/locales/types";

export const GENERATOR_MAX_RECORDS = 1000;
export const GENERATOR_QTY_PRESETS = [10, 50, 100, 500, 1000] as const;

export const GENERATOR_COUNTRIES: ReadonlyArray<{
  code: GeneratorCountryCode | "all";
  /** i18n key under generator.countries */
  labelKey: string;
}> = [
  { code: "all", labelKey: "all" },
  { code: "IR", labelKey: "IR" },
  { code: "DE", labelKey: "DE" },
  { code: "US", labelKey: "US" },
  { code: "GB", labelKey: "GB" },
  { code: "FR", labelKey: "FR" },
  { code: "NL", labelKey: "NL" },
  { code: "JP", labelKey: "JP" },
  { code: "CA", labelKey: "CA" },
] as const;

export const GENERATOR_CATEGORIES = [
  "people",
  "ecommerce",
  "content",
  "media",
  "business",
  "location",
] as const;
