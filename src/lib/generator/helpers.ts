import type { LocalePack } from "@/lib/generator/locales/types";

/** Deterministic-ish PRNG from seed + index (mulberry32). */
export function createRng(seed: string, index: number): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= index * 2654435761;
  let t = h >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rng: () => number, list: readonly T[]): T {
  return list[Math.floor(rng() * list.length) % list.length]!;
}

export function pickN<T>(rng: () => number, list: readonly T[], n: number): T[] {
  const copy = [...list];
  const out: T[] = [];
  const count = Math.min(n, copy.length);
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(rng() * copy.length) % copy.length;
    out.push(copy.splice(idx, 1)[0]!);
  }
  return out;
}

export function int(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/** Whole-number money for generated data (no decimals). FA uses large IRR-style amounts. */
export function moneyAmount(
  rng: () => number,
  uiLocale: "en" | "fa",
  range?: { fa?: [number, number]; en?: [number, number] },
): number {
  if (uiLocale === "fa") {
    const [min, max] = range?.fa ?? [50_000, 8_000_000];
    // Round to nearest 1000 for cleaner FA prices
    return int(rng, Math.ceil(min / 1000), Math.floor(max / 1000)) * 1000;
  }
  const [min, max] = range?.en ?? [10, 999];
  return int(rng, min, max);
}

export function float(
  rng: () => number,
  min: number,
  max: number,
  digits = 2,
): number {
  const v = rng() * (max - min) + min;
  const f = 10 ** digits;
  return Math.round(v * f) / f;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Map Persian letters to Latin for usernames/emails (display names stay Persian). */
const FA_LATIN: Record<string, string> = {
  آ: "a",
  ا: "a",
  أ: "a",
  إ: "e",
  ب: "b",
  پ: "p",
  ت: "t",
  ث: "s",
  ج: "j",
  چ: "ch",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "z",
  ر: "r",
  ز: "z",
  ژ: "zh",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "z",
  ط: "t",
  ظ: "z",
  ع: "a",
  غ: "gh",
  ف: "f",
  ق: "gh",
  ک: "k",
  گ: "g",
  ل: "l",
  م: "m",
  ن: "n",
  و: "v",
  ه: "h",
  ی: "y",
  ي: "y",
  ى: "y",
  ئ: "y",
  ؤ: "o",
  ة: "h",
  ء: "",
  "\u200c": "",
};

export function transliterateFa(value: string): string {
  let out = "";
  for (const ch of value) {
    if (FA_LATIN[ch] !== undefined) {
      out += FA_LATIN[ch];
      continue;
    }
    if (/[a-z0-9]/i.test(ch)) out += ch.toLowerCase();
  }
  return out;
}

export function fullName(pack: LocalePack, rng: () => number): string {
  return `${pick(rng, pack.firstNames)} ${pick(rng, pack.lastNames)}`;
}

export function usernameFromName(name: string, rng: () => number): string {
  let base = slugify(name).replace(/-/g, "");
  if (base.length < 2) {
    base = transliterateFa(name).replace(/\s+/g, "");
  }
  if (base.length >= 2) return `${base.slice(0, 16)}${int(rng, 1, 99)}`;
  const fallback = ["user", "guest", "member", "dev", "maker"] as const;
  return `${pick(rng, fallback)}${int(rng, 10, 999)}`;
}

export function emailFromName(name: string, rng: () => number): string {
  const user = usernameFromName(name, rng).replace(/\d+$/, "") || "user";
  const domains = ["example.com", "mail.test", "demo.dev", "inbox.io"];
  return `${user}${int(rng, 1, 99)}@${pick(rng, domains)}`;
}

export function avatarUrl(seed: string): string {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(seed)}`;
}

export function imageUrl(seed: string, w = 600, h = 400): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

export function flagUrl(code: string): string {
  return `https://flagcdn.com/w320/${code.toLowerCase()}.png`;
}

export function phone(pack: LocalePack, rng: () => number): string {
  const a = int(rng, 100, 999);
  const b = int(rng, 100, 999);
  const c = int(rng, 1000, 9999);
  if (pack.postalPattern === "ir") {
    return `${pack.phonePrefix} 9${int(rng, 10, 39)} ${a} ${b}`;
  }
  return `${pack.phonePrefix} ${a} ${b} ${String(c).slice(0, 4)}`;
}

export function postalCode(pack: LocalePack, rng: () => number): string {
  switch (pack.postalPattern) {
    case "ir":
      return String(int(rng, 1000000000, 1999999999)).slice(0, 10);
    case "de":
    case "fr":
      return String(int(rng, 10000, 99999));
    case "us":
      return String(int(rng, 10000, 99999));
    case "gb": {
      const letters = "ABCDEFGHJKLMNPRSTUVWXY";
      const a = letters[int(rng, 0, letters.length - 1)];
      const b = letters[int(rng, 0, letters.length - 1)];
      return `${a}${b}${int(rng, 1, 9)} ${int(rng, 1, 9)}${a}${b}`;
    }
    case "nl": {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      return `${int(rng, 1000, 9999)} ${letters[int(rng, 0, 25)]}${letters[int(rng, 0, 25)]}`;
    }
    case "jp":
      return `${int(rng, 100, 999)}-${int(rng, 1000, 9999)}`;
    case "ca": {
      const letters = "ABCEGHJKLMNPRSTVXY";
      const L = () => letters[int(rng, 0, letters.length - 1)];
      const D = () => String(int(rng, 0, 9));
      return `${L()}${D()}${L()} ${D()}${L()}${D()}`;
    }
    default:
      return String(int(rng, 10000, 99999));
  }
}

export function place(pack: LocalePack, rng: () => number) {
  return pick(rng, pack.places);
}

export function streetAddress(pack: LocalePack, rng: () => number): string {
  return `${int(rng, 1, 220)} ${pick(rng, pack.streets)}`;
}

export function isoDate(rng: () => number, daysBack = 365): string {
  return isoDateTime(rng, daysBack);
}

/** Future timestamp as full ISO-8601 (same shape as isoDateTime). */
export function isoDateFuture(rng: () => number, daysAhead = 90): string {
  const d = new Date();
  d.setDate(d.getDate() + int(rng, 1, daysAhead));
  d.setHours(int(rng, 0, 23), int(rng, 0, 59), int(rng, 0, 59), 0);
  return d.toISOString();
}

/** Standard date/time for generated data: full ISO-8601. */
export function isoDateTime(rng: () => number, daysBack = 90): string {
  const d = new Date();
  d.setDate(d.getDate() - int(rng, 0, daysBack));
  d.setHours(int(rng, 0, 23), int(rng, 0, 59), int(rng, 0, 59), 0);
  return d.toISOString();
}

export function id(prefix: string, index: number, rng: () => number): string {
  return `${prefix}_${(index + 1).toString(36)}${int(rng, 100, 999)}`;
}

export function takeFields(
  record: Record<string, unknown>,
  fields: ReadonlySet<string>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of fields) {
    if (key in record) out[key] = record[key];
  }
  return out;
}

export const PRODUCT_NAMES = [
  "Wireless Headphones",
  "Smart Watch",
  "Ceramic Mug",
  "Desk Lamp",
  "Running Shoes",
  "Laptop Stand",
  "Water Bottle",
  "Bluetooth Speaker",
  "Backpack",
  "Mechanical Keyboard",
  "USB-C Hub",
  "Yoga Mat",
] as const;

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Home",
  "Fashion",
  "Sports",
  "Office",
  "Beauty",
] as const;

export const JOB_TITLES = [
  "Frontend Developer",
  "Product Designer",
  "Data Analyst",
  "Marketing Manager",
  "DevOps Engineer",
  "Customer Success",
  "Backend Developer",
  "HR Specialist",
] as const;

export const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Operations",
  "People",
] as const;
