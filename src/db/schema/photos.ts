import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const photos = pgTable(
  "photos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    albumId: integer("album_id").notNull(),
    title: text("title").notNull(),
    url: text("url").notNull(),
    thumbnailUrl: text("thumbnail_url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("photos_album_id_idx").on(table.albumId),
    index("photos_created_at_idx").on(table.createdAt),
    index("photos_title_idx").on(table.title),
  ],
);

export type Photo = typeof photos.$inferSelect;
export type NewPhoto = typeof photos.$inferInsert;
