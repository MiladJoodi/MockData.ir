import { NextResponse, type NextRequest } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  rateLimitHeaders,
} from "@/lib/api/rate-limit";

export function middleware(request: NextRequest) {
  const ip = getClientIp(request);
  const result = checkRateLimit(ip);
  const headers = rateLimitHeaders(result);

  if (!result.ok) {
    return NextResponse.json(
      {
        error: {
          code: "RATE_LIMITED",
          message: `Too many requests. Try again in ${result.retryAfter}s.`,
        },
      },
      { status: 429, headers },
    );
  }

  const response = NextResponse.next();
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
