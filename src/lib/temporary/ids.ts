import { createHash, randomBytes } from "crypto";
import { TEMPORARY_LIMITS } from "@/lib/temporary/limits";

const PUBLIC_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

export function generatePublicId(
  length = TEMPORARY_LIMITS.publicIdLength,
): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += PUBLIC_ALPHABET[bytes[i]! % PUBLIC_ALPHABET.length];
  }
  return out;
}

export function generateManageToken(): string {
  return randomBytes(TEMPORARY_LIMITS.manageTokenBytes).toString("base64url");
}

export function hashManageToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateClientKey(): string {
  return randomBytes(24).toString("base64url");
}

export function generateItemId(): string {
  return randomBytes(6).toString("hex");
}
