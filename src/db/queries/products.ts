import { and, asc, count, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { products, type Product } from "@/db/schema/products";
import type {
  CreateProductInput,
  ProductListQuery,
  UpdateProductInput,
} from "@/lib/validations/products";

function buildFilters(query: ProductListQuery): SQL | undefined {
  const conditions: SQL[] = [];

  if (query.search) {
    const pattern = `%${query.search}%`;
    conditions.push(
      or(ilike(products.name, pattern), ilike(products.description, pattern))!,
    );
  }

  if (query.category) {
    conditions.push(eq(products.category, query.category));
  }

  if (conditions.length === 0) return undefined;
  if (conditions.length === 1) return conditions[0];
  return and(...conditions);
}

function orderByClause(query: ProductListQuery) {
  const direction = query.order === "asc" ? asc : desc;
  const primary =
    query.sort === "name"
      ? direction(products.name)
      : query.sort === "price"
        ? direction(products.price)
        : query.sort === "stock"
          ? direction(products.stock)
          : direction(products.createdAt);
  return [primary, direction(products.id)] as const;
}

export async function listProducts(query: ProductListQuery) {
  const where = buildFilters(query);
  const offset = (query.page - 1) * query.limit;

  const [items, totalRow] = await Promise.all([
    db
      .select()
      .from(products)
      .where(where)
      .orderBy(...orderByClause(query))
      .limit(query.limit)
      .offset(offset),
    db.select({ value: count() }).from(products).where(where),
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

export async function getProductById(id: string): Promise<Product | null> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const rows = await db.insert(products).values(input).returning();
  return rows[0]!;
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput,
): Promise<Product | null> {
  if (!(await getProductById(id))) return null;
  const rows = await db
    .update(products)
    .set({ ...input, updatedAt: sql`now()` })
    .where(eq(products.id, id))
    .returning();
  return rows[0] ?? null;
}

export async function deleteProduct(id: string): Promise<Product | null> {
  const rows = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();
  return rows[0] ?? null;
}
