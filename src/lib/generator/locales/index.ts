import { caPack } from "@/lib/generator/locales/ca";
import { dePack } from "@/lib/generator/locales/de";
import { frPack } from "@/lib/generator/locales/fr";
import { gbPack } from "@/lib/generator/locales/gb";
import { irPack } from "@/lib/generator/locales/ir";
import { irFaPack } from "@/lib/generator/locales/ir-fa";
import { jpPack } from "@/lib/generator/locales/jp";
import { nlPack } from "@/lib/generator/locales/nl";
import { usPack } from "@/lib/generator/locales/us";
import type {
  GeneratorCountryCode,
  LocalePack,
} from "@/lib/generator/locales/types";

const PACKS: Record<GeneratorCountryCode, LocalePack> = {
  IR: irPack,
  DE: dePack,
  US: usPack,
  GB: gbPack,
  FR: frPack,
  NL: nlPack,
  JP: jpPack,
  CA: caPack,
};

const ALL_CODES = Object.keys(PACKS) as GeneratorCountryCode[];

/** EN “all” pool — no Iran; FA UI uses irFaPack instead. */
const EN_ALL_CODES = ALL_CODES.filter((code) => code !== "IR");

export function isGeneratorCountryCode(
  value: string,
): value is GeneratorCountryCode | "all" {
  return value === "all" || value in PACKS;
}

/**
 * Resolve locale pack.
 * FA UI → always Iranian Persian-script data.
 * EN UI → rotate non-Iran packs (or a specific country if passed).
 */
export function resolveLocalePack(
  country: GeneratorCountryCode | "all",
  index: number,
  uiLocale: "en" | "fa" = "en",
): LocalePack {
  if (uiLocale === "fa") return irFaPack;
  if (country !== "all") {
    // EN UI never resolves to Iran — fall back to GB (England).
    if (country === "IR") return PACKS.GB;
    return PACKS[country];
  }
  return PACKS[EN_ALL_CODES[index % EN_ALL_CODES.length]!];
}

export function getLocalePack(code: GeneratorCountryCode): LocalePack {
  return PACKS[code];
}

export {
  PACKS as LOCALE_PACKS,
  ALL_CODES as LOCALE_COUNTRY_CODES,
  EN_ALL_CODES as EN_LOCALE_COUNTRY_CODES,
  irFaPack,
};
