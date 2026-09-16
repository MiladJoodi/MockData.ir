import { and, count, desc, eq, gt, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  temporaryApis,
  type NewTemporaryApi,
  type TemporaryApi,
} from "@/db/schema/temporary-apis";

export async function createTemporaryApi(
  input: Omit<NewTemporaryApi, "id" | "createdAt" | "updatedAt">,
): Promise<TemporaryApi> {
  const rows = await db.insert(temporaryApis).values(input).returning();
  return rows[0]!;
}

export async function getTemporaryApiByPublicId(
  publicId: string,
): Promise<TemporaryApi | null> {
  const rows = await db
    .select()
    .from(temporaryApis)
    .where(eq(temporaryApis.publicId, publicId))
    .limit(1);
  return rows[0] ?? null;
}

export async function updateTemporaryApiPayload(
  publicId: string,
  payload: unknown,
): Promise<TemporaryApi | null> {
  const rows = await db
    .update(temporaryApis)
    .set({ payload, updatedAt: sql`now()` })
    .where(eq(temporaryApis.publicId, publicId))
    .returning();
  return rows[0] ?? null;
}

export async function deleteTemporaryApiByPublicId(
  publicId: string,
): Promise<TemporaryApi | null> {
  const rows = await db
    .delete(temporaryApis)
    .where(eq(temporaryApis.publicId, publicId))
    .returning();
  return rows[0] ?? null;
}

export async function countActiveTemporaryApisByClient(
  clientKey: string,
): Promise<number> {
  const rows = await db
    .select({ value: count() })
    .from(temporaryApis)
    .where(
      and(
        eq(temporaryApis.clientKey, clientKey),
        gt(temporaryApis.expiresAt, sql`now()`),
      ),
    );
  return rows[0]?.value ?? 0;
}

export async function listActiveTemporaryApisByClient(
  clientKey: string,
): Promise<
  Pick<TemporaryApi, "publicId" | "name" | "createdAt" | "expiresAt">[]
> {
  return db
    .select({
      publicId: temporaryApis.publicId,
      name: temporaryApis.name,
      createdAt: temporaryApis.createdAt,
      expiresAt: temporaryApis.expiresAt,
    })
    .from(temporaryApis)
    .where(
      and(
        eq(temporaryApis.clientKey, clientKey),
        gt(temporaryApis.expiresAt, sql`now()`),
      ),
    )
    .orderBy(desc(temporaryApis.createdAt));
}

export async function purgeExpiredTemporaryApis(): Promise<number> {
  const rows = await db
    .delete(temporaryApis)
    .where(lt(temporaryApis.expiresAt, sql`now()`))
    .returning({ id: temporaryApis.id });
  return rows.length;
}

export async function purgeExpiredTemporaryApisForClient(
  clientKey: string,
): Promise<number> {
  const rows = await db
    .delete(temporaryApis)
    .where(
      and(
        eq(temporaryApis.clientKey, clientKey),
        lt(temporaryApis.expiresAt, sql`now()`),
      ),
    )
    .returning({ id: temporaryApis.id });
  return rows.length;
}
