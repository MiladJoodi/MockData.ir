import {
  LOCALE_COUNTRY_CODES,
  getLocalePack,
  irFaPack,
} from "@/lib/generator/locales";
import {
  createRng,
  flagUrl,
  id,
  imageUrl,
  int,
  place,
  postalCode,
  streetAddress,
  takeFields,
} from "@/lib/generator/helpers";
import type { GeneratorTopic } from "@/lib/generator/types";
import { Globe2, MapPinned, Map } from "lucide-react";

const CAPITALS: Record<string, { en: string; fa: string }> = {
  IR: { en: "Tehran", fa: "تهران" },
  DE: { en: "Berlin", fa: "برلین" },
  US: { en: "Washington, D.C.", fa: "واشینگتن" },
  GB: { en: "London", fa: "لندن" },
  FR: { en: "Paris", fa: "پاریس" },
  NL: { en: "Amsterdam", fa: "آمستردام" },
  JP: { en: "Tokyo", fa: "توکیو" },
  CA: { en: "Ottawa", fa: "اوتاوا" },
};

const COUNTRY_NAMES_FA: Record<string, string> = {
  IR: "ایران",
  DE: "آلمان",
  US: "ایالات متحده",
  GB: "بریتانیا",
  FR: "فرانسه",
  NL: "هلند",
  JP: "ژاپن",
  CA: "کانادا",
};

export const locationTopics: GeneratorTopic[] = [
  {
    id: "countries",
    category: "location",
    icon: Globe2,
    fields: [
      { id: "name", default: true },
      { id: "code", default: true },
      { id: "flag", default: true },
      { id: "id", default: false },
      { id: "capital", default: false },
      { id: "currency", default: false },
      { id: "population", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      if (ctx.uiLocale === "fa") {
        const record: Record<string, unknown> = {
          id: id("cty", ctx.index, rng),
          name: irFaPack.countryName,
          code: "IR",
          flag: flagUrl("IR"),
          capital: CAPITALS.IR!.fa,
          currency: irFaPack.currency,
          population: int(rng, 80_000_000, 90_000_000),
        };
        return takeFields(record, fields);
      }
      const code =
        LOCALE_COUNTRY_CODES[ctx.index % LOCALE_COUNTRY_CODES.length]!;
      const pack = getLocalePack(code);
      const record: Record<string, unknown> = {
        id: id("cty", ctx.index, rng),
        name: pack.countryName,
        code: pack.code,
        flag: flagUrl(pack.code),
        capital: CAPITALS[pack.code]?.en ?? pack.places[0]?.city,
        currency: pack.currency,
        population: int(rng, 5_000_000, 350_000_000),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "cities",
    category: "location",
    icon: MapPinned,
    fields: [
      { id: "name", default: true },
      { id: "country", default: true },
      { id: "region", default: true },
      { id: "id", default: false },
      { id: "population", default: false },
      { id: "image", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const loc = place(ctx.pack, rng);
      const record: Record<string, unknown> = {
        id: id("cit", ctx.index, rng),
        name: loc.city,
        country:
          ctx.uiLocale === "fa"
            ? COUNTRY_NAMES_FA[ctx.pack.code] ?? ctx.pack.countryName
            : ctx.pack.countryName,
        region: loc.region,
        population: int(rng, 50_000, 9_000_000),
        image: imageUrl(`city-${ctx.index}`),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "addresses",
    category: "location",
    icon: Map,
    fields: [
      { id: "country", default: true },
      { id: "region", default: true },
      { id: "city", default: true },
      { id: "street", default: true },
      { id: "postalCode", default: true },
      { id: "id", default: false },
      { id: "latitude", default: false },
      { id: "longitude", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const loc = place(ctx.pack, rng);
      const record: Record<string, unknown> = {
        id: id("adr", ctx.index, rng),
        country: ctx.pack.countryName,
        region: loc.region,
        city: loc.city,
        street: streetAddress(ctx.pack, rng),
        postalCode: postalCode(ctx.pack, rng),
        latitude: Number((rng() * 140 - 70).toFixed(5)),
        longitude: Number((rng() * 360 - 180).toFixed(5)),
      };
      return takeFields(record, fields);
    },
  },
];
