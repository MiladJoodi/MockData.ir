import { getUserById, getUserByUsername } from "@/db/queries/users";
import type { User } from "@/db/schema/users";
import { faUsers } from "@/lib/api/fa/users";
import { MOCK_PASSWORD, MOCK_TOKEN_PREFIX } from "@/lib/auth/constants";

export { MOCK_PASSWORD } from "@/lib/auth/constants";

export function createMockToken(userId: string) {
  return `${MOCK_TOKEN_PREFIX}${userId}`;
}

export function parseMockToken(token: string): string | null {
  const value = token.trim();
  if (!value.startsWith(MOCK_TOKEN_PREFIX)) return null;
  const id = value.slice(MOCK_TOKEN_PREFIX.length).trim();
  return id || null;
}

export function extractBearerToken(header: string | null): string | null {
  if (!header) return null;
  const [scheme, value] = header.split(/\s+/, 2);
  if (!scheme || !value) return null;
  if (scheme.toLowerCase() !== "bearer") return null;
  return value.trim() || null;
}

/** Accept English seed usernames or FA overlay usernames (e.g. sara.mohammadi). */
function resolveSeedUsername(username: string): string {
  const trimmed = username.trim();
  if (faUsers[trimmed]) return trimmed;
  for (const [seedUsername, overlay] of Object.entries(faUsers)) {
    if (overlay.username === trimmed) return seedUsername;
  }
  return trimmed;
}

export async function verifyCredentials(
  username: string,
  password: string,
): Promise<User | null> {
  const user = await getUserByUsername(resolveSeedUsername(username));
  if (!user) return null;
  if (password !== MOCK_PASSWORD) return null;
  return user;
}

export async function getUserFromAuthHeader(
  authorization: string | null,
): Promise<User | null> {
  const raw = extractBearerToken(authorization);
  if (!raw) return null;
  const userId = parseMockToken(raw);
  if (!userId) return null;
  return getUserById(userId);
}
