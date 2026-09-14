import { NextRequest } from "next/server";
import { createMockToken, verifyCredentials } from "@/lib/auth/mock-auth";
import { applyMockControls } from "@/lib/api/mock-controls";
import {
  internalError,
  jsonError,
  jsonLocalizedSuccess,
  unauthorizedError,
  validationError,
} from "@/lib/api/response";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("VALIDATION_ERROR", "Invalid JSON body", 400);
    }

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const user = await verifyCredentials(
      parsed.data.username,
      parsed.data.password,
    );

    if (!user) {
      return unauthorizedError();
    }

    return jsonLocalizedSuccess(request, "auth", {
      token: createMockToken(user.id),
      tokenType: "Bearer",
      expiresIn: 3600,
      user,
    });
  } catch (error) {
    console.error("POST /api/auth/login failed:", error);
    return internalError();
  }
}
