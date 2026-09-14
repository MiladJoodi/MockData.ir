import { NextRequest } from "next/server";
import {
  deleteUser,
  getUserById,
  updateUser,
} from "@/db/queries/users";
import { applyMockControls } from "@/lib/api/mock-controls";
import {
  internalError,
  jsonError,
  jsonSuccess,
  notFoundError,
  validationError,
} from "@/lib/api/response";
import {
  updateUserSchema,
  userIdSchema,
} from "@/lib/validations/users";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = userIdSchema.safeParse(id);
    if (!parsedId.success) {
      return validationError(parsedId.error);
    }

    const user = await getUserById(parsedId.data);
    if (!user) {
      return notFoundError("User not found");
    }

    return jsonSuccess(user);
  } catch (error) {
    console.error("GET /api/users/[id] failed:", error);
    return internalError();
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = userIdSchema.safeParse(id);
    if (!parsedId.success) {
      return validationError(parsedId.error);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("VALIDATION_ERROR", "Invalid JSON body", 400);
    }

    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const user = await updateUser(parsedId.data, parsed.data);
    if (!user) {
      return notFoundError("User not found");
    }

    return jsonSuccess(user);
  } catch (error) {
    console.error("PATCH /api/users/[id] failed:", error);
    return internalError();
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = userIdSchema.safeParse(id);
    if (!parsedId.success) {
      return validationError(parsedId.error);
    }

    const user = await deleteUser(parsedId.data);
    if (!user) {
      return notFoundError("User not found");
    }

    return jsonSuccess({ id: user.id });
  } catch (error) {
    console.error("DELETE /api/users/[id] failed:", error);
    return internalError();
  }
}
