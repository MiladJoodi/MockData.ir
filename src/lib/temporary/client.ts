import { NextResponse } from "next/server";
import {
  TMP_CLIENT_COOKIE,
  TMP_CLIENT_MAX_AGE_SEC,
} from "@/lib/temporary/limits";
import { generateClientKey } from "@/lib/temporary/ids";

export function readTmpClientKey(request: Request): string | null {
  const cookie = request.headers.get("cookie");
  if (!cookie) return null;
  const match = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${TMP_CLIENT_COOKIE}=`));
  if (!match) return null;
  const value = decodeURIComponent(match.slice(TMP_CLIENT_COOKIE.length + 1));
  return value || null;
}

export function ensureTmpClientKey(request: Request): {
  clientKey: string;
  setCookie: boolean;
} {
  const existing = readTmpClientKey(request);
  if (existing) return { clientKey: existing, setCookie: false };
  return { clientKey: generateClientKey(), setCookie: true };
}

export function appendTmpClientCookie(
  response: NextResponse,
  clientKey: string,
) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.headers.append(
    "Set-Cookie",
    `${TMP_CLIENT_COOKIE}=${encodeURIComponent(clientKey)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${TMP_CLIENT_MAX_AGE_SEC}${secure}`,
  );
}

/** Absolute public URL for a temporary API. */
export function temporaryPublicUrl(
  request: Request,
  publicId: string,
): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (env) return `${env}/api/t/${publicId}`;
  const url = new URL(request.url);
  return `${url.origin}/api/t/${publicId}`;
}
