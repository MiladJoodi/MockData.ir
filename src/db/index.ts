import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const globalForDb = globalThis as unknown as {
  postgresClient: ReturnType<typeof postgres> | undefined;
};

const client =
  globalForDb.postgresClient ??
  postgres(connectionString, {
    prepare: false,
    // Neon pooler: keep a single connection per Next.js process
    max: 1,
    idle_timeout: 20,
    connect_timeout: 30,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresClient = client;
}

export const db = drizzle(client, { schema });
