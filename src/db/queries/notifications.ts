import { and, asc, count, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { notifications, type Notification } from "@/db/schema/notifications";
import type {
  CreateNotificationInput,
  NotificationListQuery,
  UpdateNotificationInput,
} from "@/lib/validations/notifications";

function buildFilters(query: NotificationListQuery): SQL | undefined {
  const conditions: SQL[] = [];

  if (query.search) {
    conditions.push(
      or(
        ilike(notifications.title, `%${query.search}%`),
        ilike(notifications.message, `%${query.search}%`),
      )!,
    );
  }

  if (query.userId) {
    conditions.push(eq(notifications.userId, query.userId));
  }

  if (query.type) {
    conditions.push(eq(notifications.type, query.type));
  }

  if (query.read !== undefined) {
    conditions.push(eq(notifications.read, query.read));
  }

  if (conditions.length === 0) return undefined;
  if (conditions.length === 1) return conditions[0];
  return and(...conditions);
}

function orderByClause(query: NotificationListQuery) {
  const direction = query.order === "asc" ? asc : desc;
  const primary =
    query.sort === "title"
      ? direction(notifications.title)
      : direction(notifications.createdAt);
  return [primary, direction(notifications.id)] as const;
}

export async function listNotifications(query: NotificationListQuery) {
  const where = buildFilters(query);
  const offset = (query.page - 1) * query.limit;

  const [items, totalRow] = await Promise.all([
    db
      .select()
      .from(notifications)
      .where(where)
      .orderBy(...orderByClause(query))
      .limit(query.limit)
      .offset(offset),
    db.select({ value: count() }).from(notifications).where(where),
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

export async function getNotificationById(
  id: string,
): Promise<Notification | null> {
  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createNotification(
  input: CreateNotificationInput,
): Promise<Notification> {
  const rows = await db.insert(notifications).values(input).returning();
  return rows[0]!;
}

export async function updateNotification(
  id: string,
  input: UpdateNotificationInput,
): Promise<Notification | null> {
  if (!(await getNotificationById(id))) return null;
  const rows = await db
    .update(notifications)
    .set({ ...input, updatedAt: sql`now()` })
    .where(eq(notifications.id, id))
    .returning();
  return rows[0] ?? null;
}

export async function deleteNotification(
  id: string,
): Promise<Notification | null> {
  const rows = await db
    .delete(notifications)
    .where(eq(notifications.id, id))
    .returning();
  return rows[0] ?? null;
}
