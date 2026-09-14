import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function jsonSuccess<T>(
  data: T,
  init?: { status?: number; pagination?: PaginationMeta },
) {
  const body: { data: T; pagination?: PaginationMeta } = { data };
  if (init?.pagination) {
    body.pagination = init.pagination;
  }
  return NextResponse.json(body, { status: init?.status ?? 200 });
}

export function jsonError(
  code: string,
  message: string,
  status: number,
  details?: unknown,
) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
      },
    },
    { status },
  );
}

export function validationError(error: ZodError) {
  return jsonError(
    "VALIDATION_ERROR",
    "Invalid request",
    400,
    error.flatten(),
  );
}

export function notFoundError(message = "Resource not found") {
  return jsonError("NOT_FOUND", message, 404);
}

export function unauthorizedError(message = "Invalid username or password") {
  return jsonError("UNAUTHORIZED", message, 401);
}

export function internalError() {
  return jsonError("INTERNAL_ERROR", "Something went wrong", 500);
}
