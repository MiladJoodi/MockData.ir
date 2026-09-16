import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const temporaryApis = pgTable(
  "temporary_apis",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    publicId: text("public_id").notNull().unique(),
    manageTokenHash: text("manage_token_hash").notNull(),
    clientKey: text("client_key").notNull(),
    name: text("name").notNull(),
    payload: jsonb("payload").notNull().$type<unknown>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("temporary_apis_client_expires_idx").on(
      table.clientKey,
      table.expiresAt,
    ),
    index("temporary_apis_expires_at_idx").on(table.expiresAt),
  ],
);

export type TemporaryApi = typeof temporaryApis.$inferSelect;
export type NewTemporaryApi = typeof temporaryApis.$inferInsert;
