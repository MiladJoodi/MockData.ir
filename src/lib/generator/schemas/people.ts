import { contentList } from "@/lib/generator/content";
import {
  avatarUrl,
  createRng,
  emailFromName,
  fullName,
  id,
  int,
  isoDate,
  moneyAmount,
  phone,
  place,
  takeFields,
  usernameFromName,
  pick,
} from "@/lib/generator/helpers";
import type { GeneratorTopic } from "@/lib/generator/types";
import { Users, UserRound, BriefcaseBusiness, PenLine } from "lucide-react";

const ROLES = {
  en: ["admin", "member", "viewer", "editor"] as const,
  fa: ["admin", "member", "viewer", "editor"] as const,
};

export const peopleTopics: GeneratorTopic[] = [
  {
    id: "users",
    category: "people",
    icon: Users,
    fields: [
      { id: "name", default: true },
      { id: "username", default: true },
      { id: "email", default: true },
      { id: "avatar", default: true },
      { id: "id", default: false },
      { id: "phone", default: false },
      { id: "company", default: false },
      { id: "location", default: false },
      { id: "age", default: false },
      { id: "role", default: false },
      { id: "bio", default: false },
      { id: "website", default: false },
      { id: "createdAt", default: false },
      { id: "country", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = fullName(ctx.pack, rng);
      const loc = place(ctx.pack, rng);
      const record: Record<string, unknown> = {
        id: id("usr", ctx.index, rng),
        name,
        username: usernameFromName(name, rng),
        email: emailFromName(name, rng),
        avatar: avatarUrl(`${ctx.seed}-${ctx.index}`),
        phone: phone(ctx.pack, rng),
        company: pick(rng, ctx.pack.companies),
        location: `${loc.city}, ${loc.region}`,
        age: int(rng, 18, 65),
        role: pick(rng, ROLES[ctx.uiLocale]),
        bio: pick(rng, contentList("bios", ctx.uiLocale)),
        website: `https://example.com/u/${usernameFromName(name, rng)}`,
        createdAt: isoDate(rng, 400),
        country: ctx.pack.countryName,
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "customers",
    category: "people",
    icon: UserRound,
    fields: [
      { id: "name", default: true },
      { id: "email", default: true },
      { id: "avatar", default: true },
      { id: "phone", default: true },
      { id: "id", default: false },
      { id: "location", default: false },
      { id: "company", default: false },
      { id: "country", default: false },
      { id: "ordersCount", default: false },
      { id: "totalSpent", default: false },
      { id: "createdAt", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = fullName(ctx.pack, rng);
      const loc = place(ctx.pack, rng);
      const record: Record<string, unknown> = {
        id: id("cus", ctx.index, rng),
        name,
        email: emailFromName(name, rng),
        avatar: avatarUrl(`cus-${ctx.seed}-${ctx.index}`),
        phone: phone(ctx.pack, rng),
        location: `${loc.city}, ${ctx.pack.countryName}`,
        company: pick(rng, ctx.pack.companies),
        country: ctx.pack.countryName,
        ordersCount: int(rng, 0, 48),
        totalSpent: moneyAmount(rng, ctx.uiLocale, {
          fa: [0, 50_000_000],
          en: [0, 5000],
        }),
        createdAt: isoDate(rng, 500),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "employees",
    category: "people",
    icon: BriefcaseBusiness,
    fields: [
      { id: "name", default: true },
      { id: "jobTitle", default: true },
      { id: "department", default: true },
      { id: "company", default: true },
      { id: "avatar", default: true },
      { id: "id", default: false },
      { id: "location", default: false },
      { id: "email", default: false },
      { id: "phone", default: false },
      { id: "country", default: false },
      { id: "hiredAt", default: false },
      { id: "salary", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = fullName(ctx.pack, rng);
      const loc = place(ctx.pack, rng);
      const record: Record<string, unknown> = {
        id: id("emp", ctx.index, rng),
        name,
        jobTitle: pick(rng, contentList("jobTitles", ctx.uiLocale)),
        department: pick(rng, contentList("departments", ctx.uiLocale)),
        company: pick(rng, ctx.pack.companies),
        avatar: avatarUrl(`emp-${ctx.seed}-${ctx.index}`),
        location: `${loc.city}, ${loc.region}`,
        email: emailFromName(name, rng),
        phone: phone(ctx.pack, rng),
        country: ctx.pack.countryName,
        hiredAt: isoDate(rng, 1200),
        salary: moneyAmount(rng, ctx.uiLocale, {
          fa: [8_000_000, 85_000_000],
          en: [42_000, 165_000],
        }),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "authors",
    category: "people",
    icon: PenLine,
    fields: [
      { id: "name", default: true },
      { id: "avatar", default: true },
      { id: "bio", default: true },
      { id: "email", default: true },
      { id: "id", default: false },
      { id: "website", default: false },
      { id: "location", default: false },
      { id: "country", default: false },
      { id: "postsCount", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = fullName(ctx.pack, rng);
      const loc = place(ctx.pack, rng);
      const record: Record<string, unknown> = {
        id: id("aut", ctx.index, rng),
        name,
        avatar: avatarUrl(`aut-${ctx.seed}-${ctx.index}`),
        bio: pick(rng, contentList("bios", ctx.uiLocale)),
        email: emailFromName(name, rng),
        website: `https://${usernameFromName(name, rng)}.dev`,
        location: `${loc.city}, ${ctx.pack.countryName}`,
        country: ctx.pack.countryName,
        postsCount: int(rng, 1, 120),
      };
      return takeFields(record, fields);
    },
  },
];
