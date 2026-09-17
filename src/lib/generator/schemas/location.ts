import {
  EN_LOCALE_COUNTRY_CODES,
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
  pick,
} from "@/lib/generator/helpers";
import type { GeneratorTopic } from "@/lib/generator/types";
import {
  Globe2,
  MapPinned,
  Map,
  Earth,
  LandPlot,
  Building,
  Plane,
  LocateFixed,
} from "lucide-react";

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

const CONTINENTS = {
  en: [
    { name: "Asia", code: "AS" },
    { name: "Europe", code: "EU" },
    { name: "Africa", code: "AF" },
    { name: "North America", code: "NA" },
    { name: "South America", code: "SA" },
    { name: "Oceania", code: "OC" },
    { name: "Antarctica", code: "AN" },
  ],
  fa: [
    { name: "آسیا", code: "AS" },
    { name: "اروپا", code: "EU" },
    { name: "آفریقا", code: "AF" },
    { name: "آمریکای شمالی", code: "NA" },
    { name: "آمریکای جنوبی", code: "SA" },
    { name: "اقیانوسیه", code: "OC" },
    { name: "جنوبگان", code: "AN" },
  ],
} as const;

const AIRPORTS = {
  en: [
      { name: "Heathrow", code: "LHR", city: "London" },
    { name: "Charles de Gaulle", code: "CDG", city: "Paris" },
    { name: "JFK", code: "JFK", city: "New York" },
    { name: "Frankfurt", code: "FRA", city: "Frankfurt" },
    { name: "Narita", code: "NRT", city: "Tokyo" },
    { name: "Schiphol", code: "AMS", city: "Amsterdam" },
    { name: "Pearson", code: "YYZ", city: "Toronto" },
    { name: "Gatwick", code: "LGW", city: "London" },
  ],
  fa: [
    { name: "امام خمینی", code: "IKA", city: "تهران" },
    { name: "مهرآباد", code: "THR", city: "تهران" },
    { name: "شهید هاشمی‌نژاد", code: "MHD", city: "مشهد" },
    { name: "شهید دستغیب", code: "SYZ", city: "شیراز" },
    { name: "اصفهان", code: "IFN", city: "اصفهان" },
    { name: "تبریز", code: "TBZ", city: "تبریز" },
    { name: "کیش", code: "KIH", city: "کیش" },
    { name: "بندرعباس", code: "BND", city: "بندرعباس" },
  ],
} as const;

const NEIGHBORHOODS = {
  en: [
    "Downtown",
    "Old Town",
    "Riverside",
    "University District",
    "Harbor View",
    "Central Park",
    "West End",
    "Industrial Quarter",
  ],
  fa: [
    "ونک",
    "تجریش",
    "نیاوران",
    "سعادت‌آباد",
    "جردن",
    "انقلاب",
    "پاسداران",
    "یوسف‌آباد",
  ],
} as const;

export const locationTopics: GeneratorTopic[] = [
  {
    id: "continents",
    category: "location",
    icon: Earth,
    fields: [
      { id: "name", default: true },
      { id: "code", default: true },
      { id: "id", default: false },
      { id: "countriesCount", default: false },
      { id: "population", default: false },
      { id: "areaKm2", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const list = CONTINENTS[ctx.uiLocale];
      const item = list[ctx.index % list.length]!;
      const record: Record<string, unknown> = {
        id: id("con", ctx.index, rng),
        name: item.name,
        code: item.code,
        countriesCount: int(rng, 1, 55),
        population: int(rng, 1_000_000, 4_800_000_000),
        areaKm2: int(rng, 100_000, 45_000_000),
      };
      return takeFields(record, fields);
    },
  },
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
        EN_LOCALE_COUNTRY_CODES[ctx.index % EN_LOCALE_COUNTRY_CODES.length]!;
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
  {
    id: "regions",
    category: "location",
    icon: LandPlot,
    fields: [
      { id: "name", default: true },
      { id: "country", default: true },
      { id: "code", default: true },
      { id: "id", default: false },
      { id: "capital", default: false },
      { id: "population", default: false },
      { id: "areaKm2", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const loc = place(ctx.pack, rng);
      const record: Record<string, unknown> = {
        id: id("reg", ctx.index, rng),
        name: loc.region,
        country: ctx.pack.countryName,
        code: `${ctx.pack.code}-${String(loc.region).slice(0, 3).toUpperCase()}${int(rng, 1, 9)}`,
        capital: loc.city,
        population: int(rng, 100_000, 12_000_000),
        areaKm2: int(rng, 500, 250_000),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "neighborhoods",
    category: "location",
    icon: Building,
    fields: [
      { id: "name", default: true },
      { id: "city", default: true },
      { id: "region", default: true },
      { id: "id", default: false },
      { id: "postalCode", default: false },
      { id: "population", default: false },
      { id: "country", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const loc = place(ctx.pack, rng);
      const record: Record<string, unknown> = {
        id: id("nbh", ctx.index, rng),
        name: pick(rng, NEIGHBORHOODS[ctx.uiLocale]),
        city: loc.city,
        region: loc.region,
        postalCode: postalCode(ctx.pack, rng),
        population: int(rng, 2_000, 180_000),
        country: ctx.pack.countryName,
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "airports",
    category: "location",
    icon: Plane,
    fields: [
      { id: "name", default: true },
      { id: "code", default: true },
      { id: "city", default: true },
      { id: "country", default: true },
      { id: "id", default: false },
      { id: "timezone", default: false },
      { id: "terminals", default: false },
      { id: "latitude", default: false },
      { id: "longitude", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const list = AIRPORTS[ctx.uiLocale];
      const airport = list[ctx.index % list.length]!;
      const timezones =
        ctx.uiLocale === "fa"
          ? ["Asia/Tehran"]
          : [
              "Europe/London",
              "Europe/Paris",
              "America/New_York",
              "Europe/Berlin",
              "Asia/Tokyo",
              "Europe/Amsterdam",
              "America/Toronto",
              "Asia/Tehran",
            ];
      const record: Record<string, unknown> = {
        id: id("apt", ctx.index, rng),
        name: airport.name,
        code: airport.code,
        city: airport.city,
        country: ctx.pack.countryName,
        timezone: pick(rng, timezones),
        terminals: int(rng, 1, 6),
        latitude: Number((rng() * 140 - 70).toFixed(5)),
        longitude: Number((rng() * 360 - 180).toFixed(5)),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "coordinates",
    category: "location",
    icon: LocateFixed,
    fields: [
      { id: "latitude", default: true },
      { id: "longitude", default: true },
      { id: "label", default: true },
      { id: "id", default: false },
      { id: "altitude", default: false },
      { id: "accuracy", default: false },
      { id: "city", default: false },
      { id: "country", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const loc = place(ctx.pack, rng);
      const lat = Number((rng() * 140 - 70).toFixed(6));
      const lng = Number((rng() * 360 - 180).toFixed(6));
      const record: Record<string, unknown> = {
        id: id("geo", ctx.index, rng),
        latitude: lat,
        longitude: lng,
        label:
          ctx.uiLocale === "fa"
            ? `${loc.city} · ${lat}, ${lng}`
            : `${loc.city} · ${lat}, ${lng}`,
        altitude: int(rng, 0, 4500),
        accuracy: Number((rng() * 25 + 1).toFixed(1)),
        city: loc.city,
        country: ctx.pack.countryName,
      };
      return takeFields(record, fields);
    },
  },
];
