import { NextRequest } from "next/server";
import { createTodo, listTodos } from "@/db/queries/todos";
import { applyMockControls, applyParsedMockControls } from "@/lib/api/mock-controls";
import {
  internalError,
  jsonError,
  jsonLocalizedSuccess,
  validationError,
} from "@/lib/api/response";
import {
  createTodoSchema,
  todoListQuerySchema,
} from "@/lib/validations/todos";

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = todoListQuerySchema.safeParse(params);
    if (!parsed.success) return validationError(parsed.error);

    const { delay, status, ...query } = parsed.data;
    const forced = await applyParsedMockControls({ delay, status });
    if (forced) return forced;

    const result = await listTodos(query);
    return jsonLocalizedSuccess(request, "todos", result.items, { pagination: result.pagination });
  } catch (error) {
    console.error("GET /api/todos failed:", error);
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

    const parsed = createTodoSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const todo = await createTodo(parsed.data);
    return jsonLocalizedSuccess(request, "todos", todo, { status: 201 });
  } catch (error) {
    console.error("POST /api/todos failed:", error);
    return internalError();
  }
}
