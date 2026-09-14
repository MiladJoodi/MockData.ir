import { NextRequest } from "next/server";
import {
  deleteNotification,
  getNotificationById,
  updateNotification,
} from "@/db/queries/notifications";
import { applyMockControls } from "@/lib/api/mock-controls";
import {
  internalError,
  jsonError,
  jsonSuccess,
  notFoundError,
  validationError,
} from "@/lib/api/response";
import {
  notificationIdSchema,
  updateNotificationSchema,
} from "@/lib/validations/notifications";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = notificationIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    const notification = await getNotificationById(parsedId.data);
    if (!notification) return notFoundError("Notification not found");
    return jsonSuccess(notification);
  } catch (error) {
    console.error("GET /api/notifications/[id] failed:", error);
    return internalError();
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = notificationIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("VALIDATION_ERROR", "Invalid JSON body", 400);
    }

    const parsed = updateNotificationSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const notification = await updateNotification(parsedId.data, parsed.data);
    if (!notification) return notFoundError("Notification not found");
    return jsonSuccess(notification);
  } catch (error) {
    console.error("PATCH /api/notifications/[id] failed:", error);
    return internalError();
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = notificationIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    const notification = await deleteNotification(parsedId.data);
    if (!notification) return notFoundError("Notification not found");
    return jsonSuccess({ id: notification.id });
  } catch (error) {
    console.error("DELETE /api/notifications/[id] failed:", error);
    return internalError();
  }
}
