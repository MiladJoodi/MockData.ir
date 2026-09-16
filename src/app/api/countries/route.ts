import { NextRequest } from "next/server";
import { createCountry, listCountries } from "@/db/queries/countries";
import { applyMockControls, applyParsedMockControls } from "@/lib/api/mock-controls";
import {
  internalError,
  jsonError,
  jsonLocalizedSuccess,
  validationError,
} from "@/lib/api/response";
import { applyLocalizedCreate } from "@/lib/api/locale-write";
import {
  countryListQuerySchema,
  createCountrySchema,
} from "@/lib/validations/countries";

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = countryListQuerySchema.safeParse(params);
    if (!parsed.success) return validationError(parsed.error);

    const { delay, status, ...query } = parsed.data;
    const forced = await applyParsedMockControls({ delay, status });
    if (forced) return forced;

    const result = await listCountries(query);
    return jsonLocalizedSuccess(request, "countries", result.items, { pagination: result.pagination });
  } catch (error) {
    console.error("GET /api/countries failed:", error);
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

    const parsed = createCountrySchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const country = await createCountry(parsed.data);
    applyLocalizedCreate(
      request,
      "countries",
      country.id,
      parsed.data as Record<string, unknown>,
    );
    return jsonLocalizedSuccess(request, "countries", country, { status: 201 });
  } catch (error) {
    console.error("POST /api/countries failed:", error);
    return internalError();
  }
}
