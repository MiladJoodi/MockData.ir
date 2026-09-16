import { NextRequest } from "next/server";
import { createProduct, listProducts } from "@/db/queries/products";
import { applyMockControls, applyParsedMockControls } from "@/lib/api/mock-controls";
import {
  internalError,
  jsonError,
  jsonLocalizedSuccess,
  validationError,
} from "@/lib/api/response";
import { applyLocalizedCreate } from "@/lib/api/locale-write";
import {
  createProductSchema,
  productListQuerySchema,
} from "@/lib/validations/products";

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = productListQuerySchema.safeParse(params);
    if (!parsed.success) return validationError(parsed.error);

    const { delay, status, ...query } = parsed.data;
    const forced = await applyParsedMockControls({ delay, status });
    if (forced) return forced;

    const result = await listProducts(query);
    return jsonLocalizedSuccess(request, "products", result.items, { pagination: result.pagination });
  } catch (error) {
    console.error("GET /api/products failed:", error);
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

    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const product = await createProduct(parsed.data);
    applyLocalizedCreate(
      request,
      "products",
      product.id,
      parsed.data as Record<string, unknown>,
    );
    return jsonLocalizedSuccess(request, "products", product, { status: 201 });
  } catch (error) {
    console.error("POST /api/products failed:", error);
    return internalError();
  }
}
