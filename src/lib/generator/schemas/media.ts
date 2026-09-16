import {
  createRng,
  float,
  fullName,
  id,
  imageUrl,
  int,
  pick,
  takeFields,
} from "@/lib/generator/helpers";
import type { GeneratorTopic } from "@/lib/generator/types";
import { Disc3, Music, Clapperboard, BookOpen } from "lucide-react";

const ALBUMS = {
  en: [
    "Random Access Memories",
    "After Hours",
    "Discovery",
    "Currents",
    "Blond",
  ],
  fa: [
    "شب‌های تهران",
    "مدار آرام",
    "بعد از باران",
    "نور شمالی",
    "خیابان خالی",
  ],
} as const;
const ARTISTS = {
  en: [
    "Daft Punk",
    "The Weeknd",
    "Tame Impala",
    "Frank Ocean",
    "Billie Eilish",
  ],
  fa: [
    "محسن چاوشی",
    "گوگوش",
    "همایون شجریان",
    "محمدرضا شجریان",
    "ابی",
    "سیروان خسروی",
    "محسن یگانه",
  ],
} as const;
const LABELS = {
  en: ["Columbia", "Interscope", "XL", "Warp"],
  fa: ["آوای ایرانی", "هنر صوت", "نی‌داوود", "آلبوم‌سرا"],
} as const;
const GENRES = {
  en: ["Electronic", "Pop", "Rock", "Hip-Hop", "Jazz", "Indie"],
  fa: ["الکترونیک", "پاپ", "راک", "هیپ‌هاپ", "جز", "ایندی"],
};
const MOVIES = {
  en: ["Night Circuit", "Glass Harbor", "The Last Signal", "Paper Cities", "Orbit"],
  fa: ["مدار شب", "بندر شیشه‌ای", "آخرین سیگنال", "شهرهای کاغذی", "مدار"],
};
const BOOKS = {
  en: [
    "Designing Interfaces",
    "Clean Architecture Notes",
    "The Product Craft",
    "Systems Thinking",
    "Ship It",
  ],
  fa: [
    "طراحی رابط‌ها",
    "یادداشت معماری تمیز",
    "هنر ساخت محصول",
    "تفکر سیستمی",
    "منتشر کن",
  ],
};

export const mediaTopics: GeneratorTopic[] = [
  {
    id: "albums",
    category: "media",
    icon: Disc3,
    fields: [
      { id: "title", default: true },
      { id: "artist", default: true },
      { id: "cover", default: true },
      { id: "year", default: true },
      { id: "id", default: false },
      { id: "genre", default: false },
      { id: "tracks", default: false },
      { id: "duration", default: false },
      { id: "label", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const title = pick(rng, ALBUMS[ctx.uiLocale]);
      const record: Record<string, unknown> = {
        id: id("alb", ctx.index, rng),
        title,
        artist: pick(rng, ARTISTS[ctx.uiLocale]),
        cover: imageUrl(`alb-${ctx.seed}-${ctx.index}`, 500, 500),
        year: int(rng, 1995, 2025),
        genre: pick(rng, GENRES[ctx.uiLocale]),
        tracks: int(rng, 8, 18),
        duration: `${int(rng, 35, 75)}:${String(int(rng, 0, 59)).padStart(2, "0")}`,
        label: pick(rng, LABELS[ctx.uiLocale]),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "songs",
    category: "media",
    icon: Music,
    fields: [
      { id: "title", default: true },
      { id: "artist", default: true },
      { id: "album", default: true },
      { id: "duration", default: true },
      { id: "id", default: false },
      { id: "genre", default: false },
      { id: "cover", default: false },
      { id: "plays", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const titles =
        ctx.uiLocale === "fa"
          ? ["رانندگی نیمه‌شب", "فوکوس نرم", "جزر نئون", "ساعات آرام", "سیگنال قطع"]
          : [
              "Midnight Drive",
              "Soft Focus",
              "Neon Tide",
              "Quiet Hours",
              "Signal Lost",
            ];
      const mins = int(rng, 2, 5);
      const secs = int(rng, 0, 59);
      const record: Record<string, unknown> = {
        id: id("sng", ctx.index, rng),
        title: pick(rng, titles),
        artist: pick(rng, ARTISTS[ctx.uiLocale]),
        album: pick(rng, ALBUMS[ctx.uiLocale]),
        duration: `${mins}:${String(secs).padStart(2, "0")}`,
        genre: pick(rng, GENRES[ctx.uiLocale]),
        cover: imageUrl(`sng-${ctx.seed}-${ctx.index}`, 400, 400),
        plays: int(rng, 1000, 5_000_000),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "movies",
    category: "media",
    icon: Clapperboard,
    fields: [
      { id: "title", default: true },
      { id: "poster", default: true },
      { id: "year", default: true },
      { id: "rating", default: true },
      { id: "id", default: false },
      { id: "genre", default: false },
      { id: "duration", default: false },
      { id: "director", default: false },
      { id: "language", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const movieGenres =
        ctx.uiLocale === "fa"
          ? ["درام", "علمی‌تخیلی", "هیجان‌انگیز", "کمدی", "اکشن"]
          : ["Drama", "Sci-Fi", "Thriller", "Comedy", "Action"];
      const record: Record<string, unknown> = {
        id: id("mov", ctx.index, rng),
        title: pick(rng, MOVIES[ctx.uiLocale]),
        poster: imageUrl(`mov-${ctx.seed}-${ctx.index}`, 400, 600),
        year: int(rng, 1990, 2025),
        rating: float(rng, 5.5, 9.4, 1),
        genre: pick(rng, movieGenres),
        duration: int(rng, 85, 160),
        director: fullName(ctx.pack, rng),
        language: ctx.uiLocale === "fa" ? "فارسی" : "English",
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "books",
    category: "media",
    icon: BookOpen,
    fields: [
      { id: "title", default: true },
      { id: "author", default: true },
      { id: "cover", default: true },
      { id: "year", default: true },
      { id: "id", default: false },
      { id: "genre", default: false },
      { id: "rating", default: false },
      { id: "pages", default: false },
      { id: "isbn", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const bookGenres =
        ctx.uiLocale === "fa"
          ? ["غیرداستانی", "طراحی", "کسب‌وکار", "داستان", "فناوری"]
          : ["Non-fiction", "Design", "Business", "Fiction", "Technology"];
      const record: Record<string, unknown> = {
        id: id("bok", ctx.index, rng),
        title: pick(rng, BOOKS[ctx.uiLocale]),
        author: fullName(ctx.pack, rng),
        cover: imageUrl(`bok-${ctx.seed}-${ctx.index}`, 400, 600),
        year: int(rng, 2005, 2025),
        genre: pick(rng, bookGenres),
        rating: float(rng, 3.5, 5, 1),
        pages: int(rng, 160, 520),
        isbn: `978-${int(rng, 1, 9)}-${int(rng, 10000000, 99999999)}`,
      };
      return takeFields(record, fields);
    },
  },
];
