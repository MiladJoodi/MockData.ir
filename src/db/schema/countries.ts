import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const countries = pgTable(
  "countries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    code: text("code").notNull(),
    capital: text("capital").notNull(),
    region: text("region").notNull(),
    population: integer("population").notNull(),
    currency: text("currency").notNull(),
    flagUrl: text("flag_url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("countries_code_unique").on(table.code),
    index("countries_region_idx").on(table.region),
    index("countries_name_idx").on(table.name),
    index("countries_created_at_idx").on(table.createdAt),
  ],
);

export type Country = typeof countries.$inferSelect;
export type NewCountry = typeof countries.$inferInsert;
