import { and, asc, count, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { users, type User } from "@/db/schema/users";
import type {
  CreateUserInput,
  UpdateUserInput,
  UserListQuery,
} from "@/lib/validations/users";

function buildFilters(query: UserListQuery): SQL | undefined {
  const conditions: SQL[] = [];

  if (query.search) {
    const pattern = `%${query.search}%`;
    conditions.push(
      or(
        ilike(users.name, pattern),
        ilike(users.username, pattern),
        ilike(users.email, pattern),
        ilike(users.company, pattern),
        ilike(users.city, pattern),
      )!,
    );
  }

  if (query.role) {
    conditions.push(eq(users.role, query.role));
  }

  if (query.country) {
    conditions.push(ilike(users.country, query.country));
  }

  if (conditions.length === 0) return undefined;
  if (conditions.length === 1) return conditions[0];
  return and(...conditions);
}

function orderByClause(query: UserListQuery) {
  const direction = query.order === "asc" ? asc : desc;
  switch (query.sort) {
    case "name":
      return direction(users.name);
    case "username":
      return direction(users.username);
    case "createdAt":
    default:
      return direction(users.createdAt);
  }
}

export async function listUsers(query: UserListQuery) {
  const where = buildFilters(query);
  const offset = (query.page - 1) * query.limit;

  const [items, totalRow] = await Promise.all([
    db
      .select()
      .from(users)
      .where(where)
      .orderBy(orderByClause(query))
      .limit(query.limit)
      .offset(offset),
    db.select({ value: count() }).from(users).where(where),
  ]);

  const total = totalRow[0]?.value ?? 0;

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
}

export async function getUserById(id: string): Promise<User | null> {
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getUserByUsername(
  username: string,
): Promise<User | null> {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  return rows[0] ?? null;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const rows = await db
    .insert(users)
    .values({
      ...input,
      phone: input.phone ?? null,
      company: input.company ?? null,
      bio: input.bio ?? null,
      website: input.website ?? null,
    })
    .returning();
  return rows[0]!;
}

export async function updateUser(
  id: string,
  input: UpdateUserInput,
): Promise<User | null> {
  const existing = await getUserById(id);
  if (!existing) return null;

  const rows = await db
    .update(users)
    .set({
      ...input,
      updatedAt: sql`now()`,
    })
    .where(eq(users.id, id))
    .returning();

  return rows[0] ?? null;
}

export async function deleteUser(id: string): Promise<User | null> {
  const rows = await db.delete(users).where(eq(users.id, id)).returning();
  return rows[0] ?? null;
}

export async function countUsers(): Promise<number> {
  const rows = await db.select({ value: count() }).from(users);
  return rows[0]?.value ?? 0;
}
