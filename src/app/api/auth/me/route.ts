import { NextRequest } from "next/server";
import { getUserFromAuthHeader } from "@/lib/auth/mock-auth";
import { applyMockControls } from "@/lib/api/mock-controls";
import {
  internalError,
  jsonLocalizedSuccess,
  unauthorizedError,
} from "@/lib/api/response";

export async function GET(request: NextRequest) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const user = await getUserFromAuthHeader(
      request.headers.get("authorization"),
    );

    if (!user) {
      return unauthorizedError("Missing or invalid Bearer token");
    }

    return jsonLocalizedSuccess(request, "auth", user);
  } catch (error) {
    console.error("GET /api/auth/me failed:", error);
    return internalError();
  }
}
