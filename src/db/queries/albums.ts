import { and, asc, count, desc, eq, ilike, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { albums, type Album } from "@/db/schema/albums";
import type {
  AlbumListQuery,
  CreateAlbumInput,
  UpdateAlbumInput,
} from "@/lib/validations/albums";

function buildFilters(query: AlbumListQuery): SQL | undefined {
  const conditions: SQL[] = [];

  if (query.search) {
    conditions.push(ilike(albums.title, `%${query.search}%`));
  }

  if (query.userId) {
    conditions.push(eq(albums.userId, query.userId));
  }

  if (conditions.length === 0) return undefined;
  if (conditions.length === 1) return conditions[0];
  return and(...conditions);
}

function orderByClause(query: AlbumListQuery) {
  const direction = query.order === "asc" ? asc : desc;
  switch (query.sort) {
    case "title":
      return [direction(albums.title), direction(albums.id)] as const;
    case "createdAt":
      return [direction(albums.createdAt), direction(albums.id)] as const;
    case "id":
    default:
      return [direction(albums.id)] as const;
  }
}

export async function listAlbums(query: AlbumListQuery) {
  const where = buildFilters(query);
  const offset = (query.page - 1) * query.limit;

  const [items, totalRow] = await Promise.all([
    db
      .select()
      .from(albums)
      .where(where)
      .orderBy(...orderByClause(query))
      .limit(query.limit)
      .offset(offset),
    db.select({ value: count() }).from(albums).where(where),
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

export async function getAlbumById(id: number): Promise<Album | null> {
  const rows = await db.select().from(albums).where(eq(albums.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createAlbum(input: CreateAlbumInput): Promise<Album> {
  let id = input.id;
  if (id === undefined) {
    const maxRow = await db
      .select({ value: sql<number>`coalesce(max(${albums.id}), 0)` })
      .from(albums);
    id = Number(maxRow[0]?.value ?? 0) + 1;
  }

  const rows = await db
    .insert(albums)
    .values({ id, userId: input.userId, title: input.title })
    .returning();
  return rows[0]!;
}

export async function updateAlbum(
  id: number,
  input: UpdateAlbumInput,
): Promise<Album | null> {
  if (!(await getAlbumById(id))) return null;
  const rows = await db
    .update(albums)
    .set({ ...input, updatedAt: sql`now()` })
    .where(eq(albums.id, id))
    .returning();
  return rows[0] ?? null;
}

export async function deleteAlbum(id: number): Promise<Album | null> {
  const rows = await db.delete(albums).where(eq(albums.id, id)).returning();
  return rows[0] ?? null;
}

export async function countAlbums(): Promise<number> {
  const rows = await db.select({ value: count() }).from(albums);
  return rows[0]?.value ?? 0;
}
