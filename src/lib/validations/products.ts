import { z } from "zod";

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  sort: z.enum(["createdAt", "name", "price", "stock"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  delay: z.coerce.number().int().min(0).max(5000).optional(),
  status: z.coerce.number().int().min(400).max(599).optional(),
});

export type ProductListQuery = z.infer<typeof productListQuerySchema>;

export const createProductSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2000),
  price: z.number().finite().min(0).max(1_000_000),
  stock: z.number().int().min(0).max(1_000_000).default(0),
  category: z.string().trim().min(1).max(100),
  imageUrl: z.string().url().max(2000),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one field must be provided" },
);

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const productIdSchema = z.string().uuid();
