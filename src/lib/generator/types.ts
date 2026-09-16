import type { LucideIcon } from "lucide-react";
import type { LocalePack, GeneratorCountryCode } from "@/lib/generator/locales/types";

export type GeneratorCategory =
  | "people"
  | "ecommerce"
  | "content"
  | "media"
  | "business"
  | "location";

export type GeneratorFieldDef = {
  id: string;
  /** Shown by default; false = behind “More fields”. */
  default: boolean;
};

export type GenerateContext = {
  index: number;
  seed: string;
  country: GeneratorCountryCode | "all";
  pack: LocalePack;
  /** UI locale for labels that should follow site language when country is all. */
  uiLocale: "en" | "fa";
};

export type GeneratorTopicId =
  | "users"
  | "customers"
  | "employees"
  | "authors"
  | "products"
  | "orders"
  | "reviews"
  | "categories"
  | "cart-items"
  | "coupons"
  | "payments"
  | "shipments"
  | "posts"
  | "comments"
  | "messages"
  | "notifications"
  | "albums"
  | "songs"
  | "movies"
  | "books"
  | "companies"
  | "jobs"
  | "courses"
  | "events"
  | "countries"
  | "cities"
  | "addresses";

export type GeneratorTopic = {
  id: GeneratorTopicId;
  category: GeneratorCategory;
  icon: LucideIcon;
  fields: GeneratorFieldDef[];
  needsCountry?: boolean;
  generateOne: (
    ctx: GenerateContext,
    fields: ReadonlySet<string>,
  ) => Record<string, unknown>;
};

export type TopicPreviewSample = {
  line1: string;
  line2: string;
  line3?: string;
};
