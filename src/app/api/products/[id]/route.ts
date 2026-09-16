import { NextRequest } from "next/server";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/db/queries/products";
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
  productIdSchema,
  updateProductSchema,
} from "@/lib/validations/products";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = productIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    const product = await getProductById(parsedId.data);
    if (!product) return notFoundError("Product not found");
    return jsonLocalizedSuccess(request, "products", product);
  } catch (error) {
    console.error("GET /api/products/[id] failed:", error);
    return internalError();
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = productIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("VALIDATION_ERROR", "Invalid JSON body", 400);
    }

    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const product = await applyLocalizedPatch(
      request,
      "products",
      parsedId.data,
      parsed.data,
      updateProduct,
      getProductById,
    );
    if (!product) return notFoundError("Product not found");
    return jsonLocalizedSuccess(request, "products", product);
  } catch (error) {
    console.error("PATCH /api/products/[id] failed:", error);
    return internalError();
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const forced = await applyMockControls(request);
    if (forced) return forced;

    const { id } = await context.params;
    const parsedId = productIdSchema.safeParse(id);
    if (!parsedId.success) return validationError(parsedId.error);

    const product = await deleteProduct(parsedId.data);
    if (!product) return notFoundError("Product not found");
    applyLocalizedDelete("products", product.id);
    return jsonSuccess({ id: product.id });
  } catch (error) {
    console.error("DELETE /api/products/[id] failed:", error);
    return internalError();
  }
}
