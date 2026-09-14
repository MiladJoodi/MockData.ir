import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const albums = pgTable(
  "albums",
  {
    id: integer("id").primaryKey(),
    userId: uuid("user_id").notNull(),
    title: text("title").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("albums_user_id_idx").on(table.userId),
    index("albums_created_at_idx").on(table.createdAt),
    index("albums_title_idx").on(table.title),
  ],
);

export type Album = typeof albums.$inferSelect;
export type NewAlbum = typeof albums.$inferInsert;
