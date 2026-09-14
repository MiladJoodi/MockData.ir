import { NextRequest } from "next/server";
import { createUser, listUsers } from "@/db/queries/users";
import { applyMockControls, applyParsedMockControls } from "@/lib/api/mock-controls";
import {
  jsonError,
  jsonLocalizedSuccess,
  internalError,
  validationError,
} from "@/lib/api/response";
import {
  createUserSchema,
  userListQuerySchema,
} from "@/lib/validations/users";

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = userListQuerySchema.safeParse(params);

    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const { delay, status, ...query } = parsed.data;
    const forced = await applyParsedMockControls({ delay, status });
    if (forced) return forced;

    const result = await listUsers(query);
    return jsonLocalizedSuccess(request, "users", result.items, { pagination: result.pagination });
  } catch (error) {
    console.error("GET /api/users failed:", error);
    return internalError();
  }
}

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

    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const user = await createUser(parsed.data);
    return jsonLocalizedSuccess(request, "users", user, { status: 201 });
  } catch (error) {
    console.error("POST /api/users failed:", error);
    return internalError();
  }
}
