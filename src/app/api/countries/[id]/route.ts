import { NextRequest } from "next/server";
import {
  deleteCountry,
  getCountryById,
  updateCountry,
} from "@/db/queries/countries";
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
import {
  countryIdSchema,
  updateCountrySchema,
} from "@/lib/validations/countries";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = countryIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    const country = await getCountryById(parsedId.data);
    if (!country) return notFoundError("Country not found");
    return jsonLocalizedSuccess(request, "countries", country);
  } catch (error) {
    console.error("GET /api/countries/[id] failed:", error);
    return internalError();
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = countryIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("VALIDATION_ERROR", "Invalid JSON body", 400);
    }

    const parsed = updateCountrySchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const country = await applyLocalizedPatch(
      request,
      "countries",
      parsedId.data,
      parsed.data,
      updateCountry,
      getCountryById,
    );
    if (!country) return notFoundError("Country not found");
    return jsonLocalizedSuccess(request, "countries", country);
  } catch (error) {
    console.error("PATCH /api/countries/[id] failed:", error);
    return internalError();
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = countryIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    const country = await deleteCountry(parsedId.data);
    if (!country) return notFoundError("Country not found");
    applyLocalizedDelete("countries", country.id);
    return jsonSuccess({ id: country.id });
  } catch (error) {
    console.error("DELETE /api/countries/[id] failed:", error);
    return internalError();
  }
}
