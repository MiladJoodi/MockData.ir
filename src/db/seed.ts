import { config } from "dotenv";

config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { albums } from "./schema/albums";
import { comments } from "./schema/comments";
import { countries } from "./schema/countries";
import { notifications } from "./schema/notifications";
import { photos } from "./schema/photos";
import { posts } from "./schema/posts";
import { products } from "./schema/products";
import { todos } from "./schema/todos";
import { users } from "./schema/users";
import { seedAlbums } from "./seed-albums";
import { seedComments } from "./seed-comments";
import { seedCountries } from "./seed-countries";
import { seedNotifications } from "./seed-notifications";
import { seedPhotos } from "./seed-photos";
import { seedPosts } from "./seed-posts";
import { seedProducts } from "./seed-products";
import { seedTodos } from "./seed-todos";
import { seedUsers } from "./seed-users";

/** Wipe and re-insert seed data. Used by CLI and admin reset. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function runSeed(database: any) {
  console.log("Clearing seed tables...");
  await database.delete(notifications);
  await database.delete(comments);
  await database.delete(todos);
  await database.delete(photos);
  await database.delete(albums);
  await database.delete(posts);
  await database.delete(products);
  await database.delete(countries);
  await database.delete(users);

  console.log(`Seeding ${seedUsers.length} users...`);
  const insertedUsers = await database
    .insert(users)
    .values(seedUsers)
    .returning();
  const userIdByUsername = new Map<string, string>(
    insertedUsers.map((user: { username: string; id: string }) => [
      user.username,
      user.id,
    ]),
  );

  console.log(`Seeding ${seedPosts.length} posts...`);
  const postRows = seedPosts.map((post) => {
    const userId = userIdByUsername.get(post.authorUsername);
    if (!userId) {
      throw new Error(`Unknown authorUsername in seed: ${post.authorUsername}`);
    }
    return {
      userId,
      title: post.title,
      body: post.body,
      tags: post.tags,
      published: post.published,
    };
  });
  const insertedPosts = await database
    .insert(posts)
    .values(postRows)
    .returning();

  console.log(`Seeding ${seedComments.length} comments...`);
  const commentRows = seedComments.map((comment) => {
    const post = insertedPosts[comment.postIndex] as { id: string } | undefined;
    if (!post) {
      throw new Error(`Invalid postIndex in seed comments: ${comment.postIndex}`);
    }
    return {
      postId: post.id,
      name: comment.name,
      email: comment.email,
      body: comment.body,
    };
  });
  await database.insert(comments).values(commentRows);

  console.log(`Seeding ${seedAlbums.length} albums...`);
  const albumRows = seedAlbums.map((album) => {
    const userId = userIdByUsername.get(album.authorUsername);
    if (!userId) {
      throw new Error(
        `Unknown authorUsername in seed albums: ${album.authorUsername}`,
      );
    }
    return {
      id: album.id,
      userId,
      title: album.title,
    };
  });
  await database.insert(albums).values(albumRows);

  console.log(`Seeding ${seedPhotos.length} photos...`);
  await database.insert(photos).values(seedPhotos);

  console.log(`Seeding ${seedTodos.length} todos...`);
  const todoRows = seedTodos.map((todo) => {
    const userId = userIdByUsername.get(todo.authorUsername);
    if (!userId) {
      throw new Error(
        `Unknown authorUsername in seed todos: ${todo.authorUsername}`,
      );
    }
    return {
      userId,
      title: todo.title,
      completed: todo.completed,
    };
  });
  await database.insert(todos).values(todoRows);

  console.log(`Seeding ${seedProducts.length} products...`);
  await database.insert(products).values(seedProducts);

  console.log(`Seeding ${seedNotifications.length} notifications...`);
  const notificationRows = seedNotifications.map((notification) => {
    const userId = userIdByUsername.get(notification.authorUsername);
    if (!userId) {
      throw new Error(
        `Unknown authorUsername in seed notifications: ${notification.authorUsername}`,
      );
    }
    return {
      userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      read: notification.read,
    };
  });
  await database.insert(notifications).values(notificationRows);

  console.log(`Seeding ${seedCountries.length} countries...`);
  await database.insert(countries).values(seedCountries);

  console.log("Seed completed successfully.");

  return {
    users: seedUsers.length,
    posts: seedPosts.length,
    comments: seedComments.length,
    albums: seedAlbums.length,
    photos: seedPhotos.length,
    todos: seedTodos.length,
    products: seedProducts.length,
    notifications: seedNotifications.length,
    countries: seedCountries.length,
  };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = postgres(process.env.DATABASE_URL, { prepare: false, max: 1 });
  const db = drizzle(client);

  try {
    await runSeed(db);
  } finally {
    await client.end();
  }
}

const entry = process.argv[1]?.replace(/\\/g, "/") ?? "";
const isCli = entry.endsWith("/src/db/seed.ts") || entry.endsWith("/db/seed.ts");

if (isCli) {
  main().catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
}
