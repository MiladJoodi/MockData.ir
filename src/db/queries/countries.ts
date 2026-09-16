import { and, asc, count, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { countries, type Country } from "@/db/schema/countries";
import type {
  CountryListQuery,
  CreateCountryInput,
  UpdateCountryInput,
} from "@/lib/validations/countries";

function buildFilters(query: CountryListQuery): SQL | undefined {
  const conditions: SQL[] = [];

  if (query.search) {
    const pattern = `%${query.search}%`;
    conditions.push(
      or(
        ilike(countries.name, pattern),
        ilike(countries.capital, pattern),
        ilike(countries.code, pattern),
      )!,
    );
  }

  if (query.region) {
    conditions.push(eq(countries.region, query.region));
  }

  if (query.code) {
    conditions.push(eq(countries.code, query.code.toUpperCase()));
  }

  if (conditions.length === 0) return undefined;
  if (conditions.length === 1) return conditions[0];
  return and(...conditions);
}

function orderByClause(query: CountryListQuery) {
  const direction = query.order === "asc" ? asc : desc;
  const primary =
    query.sort === "name"
      ? direction(countries.name)
      : query.sort === "population"
        ? direction(countries.population)
        : direction(countries.createdAt);
  return [primary, direction(countries.id)] as const;
}

export async function listCountries(query: CountryListQuery) {
  const where = buildFilters(query);
  const offset = (query.page - 1) * query.limit;

  const [items, totalRow] = await Promise.all([
    db
      .select()
      .from(countries)
      .where(where)
      .orderBy(...orderByClause(query))
      .limit(query.limit)
      .offset(offset),
    db.select({ value: count() }).from(countries).where(where),
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

export async function getCountryById(id: string): Promise<Country | null> {
  const rows = await db
    .select()
    .from(countries)
    .where(eq(countries.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createCountry(
  input: CreateCountryInput,
): Promise<Country> {
  const rows = await db
    .insert(countries)
    .values({ ...input, code: input.code.toUpperCase() })
    .returning();
  return rows[0]!;
}

export async function updateCountry(
  id: string,
  input: UpdateCountryInput,
): Promise<Country | null> {
  if (!(await getCountryById(id))) return null;
  const payload = {
    ...input,
    ...(input.code ? { code: input.code.toUpperCase() } : {}),
    updatedAt: sql`now()`,
  };
  const rows = await db
    .update(countries)
    .set(payload)
    .where(eq(countries.id, id))
    .returning();
  return rows[0] ?? null;
}

export async function deleteCountry(id: string): Promise<Country | null> {
  const rows = await db
    .delete(countries)
    .where(eq(countries.id, id))
    .returning();
  return rows[0] ?? null;
}
