import { NextRequest } from "next/server";
import { deleteTodo, getTodoById, updateTodo } from "@/db/queries/todos";
import { applyMockControls } from "@/lib/api/mock-controls";
import {
  applyLocalizedDelete,
  applyLocalizedPatch,
} from "@/lib/api/locale-write";
import {
  internalError,
  jsonError,
  jsonSuccess,
  jsonLocalizedSuccess,
  notFoundError,
  validationError,
} from "@/lib/api/response";
import { todoIdSchema, updateTodoSchema } from "@/lib/validations/todos";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = todoIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    const todo = await getTodoById(parsedId.data);
    if (!todo) return notFoundError("Todo not found");
    return jsonLocalizedSuccess(request, "todos", todo);
  } catch (error) {
    console.error("GET /api/todos/[id] failed:", error);
    return internalError();
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = todoIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("VALIDATION_ERROR", "Invalid JSON body", 400);
    }

    const parsed = updateTodoSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const todo = await applyLocalizedPatch(
      request,
      "todos",
      parsedId.data,
      parsed.data,
      updateTodo,
      getTodoById,
    );
    if (!todo) return notFoundError("Todo not found");
    return jsonLocalizedSuccess(request, "todos", todo);
  } catch (error) {
    console.error("PATCH /api/todos/[id] failed:", error);
    return internalError();
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = todoIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    const todo = await deleteTodo(parsedId.data);
    if (!todo) return notFoundError("Todo not found");
    applyLocalizedDelete("todos", todo.id);
    return jsonSuccess({ id: todo.id });
  } catch (error) {
    console.error("DELETE /api/todos/[id] failed:", error);
    return internalError();
  }
}
