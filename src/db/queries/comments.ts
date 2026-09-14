import { and, asc, count, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { comments, type Comment } from "@/db/schema/comments";
import type {
  CommentListQuery,
  CreateCommentInput,
  UpdateCommentInput,
} from "@/lib/validations/comments";

function buildFilters(query: CommentListQuery): SQL | undefined {
  const conditions: SQL[] = [];

  if (query.search) {
    const pattern = `%${query.search}%`;
    conditions.push(
      or(
        ilike(comments.name, pattern),
        ilike(comments.email, pattern),
        ilike(comments.body, pattern),
      )!,
    );
  }

  if (query.postId) {
    conditions.push(eq(comments.postId, query.postId));
  }

  if (conditions.length === 0) return undefined;
  if (conditions.length === 1) return conditions[0];
  return and(...conditions);
}

function orderByClause(query: CommentListQuery) {
  const direction = query.order === "asc" ? asc : desc;
  return query.sort === "name"
    ? direction(comments.name)
    : direction(comments.createdAt);
}

export async function listComments(query: CommentListQuery) {
  const where = buildFilters(query);
  const offset = (query.page - 1) * query.limit;

  const [items, totalRow] = await Promise.all([
    db
      .select()
      .from(comments)
      .where(where)
      .orderBy(orderByClause(query))
      .limit(query.limit)
      .offset(offset),
    db.select({ value: count() }).from(comments).where(where),
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

export async function getCommentById(id: string): Promise<Comment | null> {
  const rows = await db
    .select()
    .from(comments)
    .where(eq(comments.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createComment(
  input: CreateCommentInput,
): Promise<Comment> {
  const rows = await db.insert(comments).values(input).returning();
  return rows[0]!;
}

export async function updateComment(
  id: string,
  input: UpdateCommentInput,
): Promise<Comment | null> {
  if (!(await getCommentById(id))) return null;
  const rows = await db
    .update(comments)
    .set({ ...input, updatedAt: sql`now()` })
    .where(eq(comments.id, id))
    .returning();
  return rows[0] ?? null;
}

export async function deleteComment(id: string): Promise<Comment | null> {
  const rows = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning();
  return rows[0] ?? null;
}

export async function countComments(): Promise<number> {
  const rows = await db.select({ value: count() }).from(comments);
  return rows[0]?.value ?? 0;
}
