import { and, asc, count, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { posts, type Post } from "@/db/schema/posts";
import type {
  CreatePostInput,
  PostListQuery,
  UpdatePostInput,
} from "@/lib/validations/posts";

function buildFilters(query: PostListQuery): SQL | undefined {
  const conditions: SQL[] = [];

  if (query.search) {
    const pattern = `%${query.search}%`;
    conditions.push(
      or(ilike(posts.title, pattern), ilike(posts.body, pattern))!,
    );
  }

  if (query.userId) {
    conditions.push(eq(posts.userId, query.userId));
  }

  if (query.published !== undefined) {
    conditions.push(eq(posts.published, query.published));
  }

  if (conditions.length === 0) return undefined;
  if (conditions.length === 1) return conditions[0];
  return and(...conditions);
}

function orderByClause(query: PostListQuery) {
  const direction = query.order === "asc" ? asc : desc;
  switch (query.sort) {
    case "title":
      return [direction(posts.title), direction(posts.id)] as const;
    case "createdAt":
    default:
      return [direction(posts.createdAt), direction(posts.id)] as const;
  }
}

export async function listPosts(query: PostListQuery) {
  const where = buildFilters(query);
  const offset = (query.page - 1) * query.limit;

  const [items, totalRow] = await Promise.all([
    db
      .select()
      .from(posts)
      .where(where)
      .orderBy(...orderByClause(query))
      .limit(query.limit)
      .offset(offset),
    db.select({ value: count() }).from(posts).where(where),
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

export async function getPostById(id: string): Promise<Post | null> {
  const rows = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const rows = await db
    .insert(posts)
    .values({
      userId: input.userId,
      title: input.title,
      body: input.body,
      tags: input.tags,
      published: input.published,
    })
    .returning();
  return rows[0]!;
}

export async function updatePost(
  id: string,
  input: UpdatePostInput,
): Promise<Post | null> {
  const existing = await getPostById(id);
  if (!existing) return null;

  const rows = await db
    .update(posts)
    .set({
      ...input,
      updatedAt: sql`now()`,
    })
    .where(eq(posts.id, id))
    .returning();

  return rows[0] ?? null;
}

export async function deletePost(id: string): Promise<Post | null> {
  const rows = await db.delete(posts).where(eq(posts.id, id)).returning();
  return rows[0] ?? null;
}

export async function countPosts(): Promise<number> {
  const rows = await db.select({ value: count() }).from(posts);
  return rows[0]?.value ?? 0;
}
