import { and, asc, count, desc, eq, ilike, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { todos, type Todo } from "@/db/schema/todos";
import type {
  CreateTodoInput,
  TodoListQuery,
  UpdateTodoInput,
} from "@/lib/validations/todos";

function buildFilters(query: TodoListQuery): SQL | undefined {
  const conditions: SQL[] = [];

  if (query.search) {
    conditions.push(ilike(todos.title, `%${query.search}%`));
  }

  if (query.userId) {
    conditions.push(eq(todos.userId, query.userId));
  }

  if (query.completed !== undefined) {
    conditions.push(eq(todos.completed, query.completed));
  }

  if (conditions.length === 0) return undefined;
  if (conditions.length === 1) return conditions[0];
  return and(...conditions);
}

function orderByClause(query: TodoListQuery) {
  const direction = query.order === "asc" ? asc : desc;
  const primary =
    query.sort === "title"
      ? direction(todos.title)
      : direction(todos.createdAt);
  return [primary, direction(todos.id)] as const;
}

export async function listTodos(query: TodoListQuery) {
  const where = buildFilters(query);
  const offset = (query.page - 1) * query.limit;

  const [items, totalRow] = await Promise.all([
    db
      .select()
      .from(todos)
      .where(where)
      .orderBy(...orderByClause(query))
      .limit(query.limit)
      .offset(offset),
    db.select({ value: count() }).from(todos).where(where),
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

export async function getTodoById(id: string): Promise<Todo | null> {
  const rows = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const rows = await db.insert(todos).values(input).returning();
  return rows[0]!;
}

export async function updateTodo(
  id: string,
  input: UpdateTodoInput,
): Promise<Todo | null> {
  if (!(await getTodoById(id))) return null;
  const rows = await db
    .update(todos)
    .set({ ...input, updatedAt: sql`now()` })
    .where(eq(todos.id, id))
    .returning();
  return rows[0] ?? null;
}

export async function deleteTodo(id: string): Promise<Todo | null> {
  const rows = await db.delete(todos).where(eq(todos.id, id)).returning();
  return rows[0] ?? null;
}

export async function countTodos(): Promise<number> {
  const rows = await db.select({ value: count() }).from(todos);
  return rows[0]?.value ?? 0;
}
