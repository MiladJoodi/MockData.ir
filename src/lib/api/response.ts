import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import {
  localizePayload,
  resolveApiLocale,
  type LocaleResource,
  type ApiLocale,
} from "@/lib/api/locale";
import { FA_API_FONT } from "@/lib/api/locale-constants";

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiFontMeta = {
  family: string;
  cssUrl: string;
};

export function jsonSuccess<T>(
  data: T,
  init?: {
    status?: number;
    pagination?: PaginationMeta;
    locale?: ApiLocale;
  },
) {
  const body: {
    data: T;
    pagination?: PaginationMeta;
    font?: ApiFontMeta;
  } = { data };
  if (init?.pagination) {
    body.pagination = init.pagination;
  }
  if (init?.locale === "fa") {
    body.font = { ...FA_API_FONT };
  }
  const headers = new Headers();
  if (init?.locale) {
    headers.set("Content-Language", init.locale);
  }
  return NextResponse.json(body, {
    status: init?.status ?? 200,
    headers,
  });
}

/** Localize entity payload when ?lang=fa is present. */
export function jsonLocalizedSuccess<T>(
  request: Request,
  resource: LocaleResource,
  data: T,
  init?: { status?: number; pagination?: PaginationMeta },
) {
  const locale = resolveApiLocale(request);
  const localized = localizePayload(resource, data, locale) as T;
  return jsonSuccess(localized, { ...init, locale });
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
