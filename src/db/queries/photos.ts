import { and, asc, count, desc, eq, ilike, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { photos, type Photo } from "@/db/schema/photos";
import type {
  CreatePhotoInput,
  PhotoListQuery,
  UpdatePhotoInput,
} from "@/lib/validations/photos";

function buildFilters(query: PhotoListQuery): SQL | undefined {
  const conditions: SQL[] = [];

  if (query.search) {
    conditions.push(ilike(photos.title, `%${query.search}%`));
  }

  if (query.albumId !== undefined) {
    conditions.push(eq(photos.albumId, query.albumId));
  }

  if (conditions.length === 0) return undefined;
  if (conditions.length === 1) return conditions[0];
  return and(...conditions);
}

function orderByClause(query: PhotoListQuery) {
  const direction = query.order === "asc" ? asc : desc;
  switch (query.sort) {
    case "title":
      return direction(photos.title);
    case "albumId":
      return direction(photos.albumId);
    default:
      return direction(photos.createdAt);
  }
}

export async function listPhotos(query: PhotoListQuery) {
  const where = buildFilters(query);
  const offset = (query.page - 1) * query.limit;

  const [items, totalRow] = await Promise.all([
    db
      .select()
      .from(photos)
      .where(where)
      .orderBy(orderByClause(query))
      .limit(query.limit)
      .offset(offset),
    db.select({ value: count() }).from(photos).where(where),
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

export async function getPhotoById(id: string): Promise<Photo | null> {
  const rows = await db.select().from(photos).where(eq(photos.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createPhoto(input: CreatePhotoInput): Promise<Photo> {
  const rows = await db.insert(photos).values(input).returning();
  return rows[0]!;
}

export async function updatePhoto(
  id: string,
  input: UpdatePhotoInput,
): Promise<Photo | null> {
  if (!(await getPhotoById(id))) return null;
  const rows = await db
    .update(photos)
    .set({ ...input, updatedAt: sql`now()` })
    .where(eq(photos.id, id))
    .returning();
  return rows[0] ?? null;
}

export async function deletePhoto(id: string): Promise<Photo | null> {
  const rows = await db.delete(photos).where(eq(photos.id, id)).returning();
  return rows[0] ?? null;
}

export async function countPhotos(): Promise<number> {
  const rows = await db.select({ value: count() }).from(photos);
  return rows[0]?.value ?? 0;
}
