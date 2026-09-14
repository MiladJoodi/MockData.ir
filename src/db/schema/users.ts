import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userRoles = ["admin", "member", "guest"] as const;
export type UserRole = (typeof userRoles)[number];

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    avatarUrl: text("avatar_url").notNull(),
    phone: text("phone"),
    company: text("company"),
    role: text("role").notNull().$type<UserRole>().default("member"),
    city: text("city").notNull(),
    country: text("country").notNull(),
    bio: text("bio"),
    website: text("website"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("users_role_idx").on(table.role),
    index("users_country_idx").on(table.country),
    index("users_created_at_idx").on(table.createdAt),
    index("users_name_idx").on(table.name),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
