import { z } from "zod";

export const countryListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().trim().optional(),
  region: z.string().trim().optional(),
  code: z.string().trim().min(2).max(2).optional(),
  sort: z.enum(["createdAt", "name", "population"]).default("name"),
  order: z.enum(["asc", "desc"]).default("asc"),
  delay: z.coerce.number().int().min(0).max(5000).optional(),
  status: z.coerce.number().int().min(400).max(599).optional(),
});

export type CountryListQuery = z.infer<typeof countryListQuerySchema>;

export const createCountrySchema = z.object({
  name: z.string().trim().min(1).max(120),
  code: z
    .string()
    .trim()
    .length(2)
    .regex(/^[A-Za-z]{2}$/, "ISO alpha-2 code required"),
  capital: z.string().trim().min(1).max(120),
  region: z.string().trim().min(1).max(80),
  population: z.number().int().min(0).max(10_000_000_000),
  currency: z.string().trim().min(1).max(10),
  flagUrl: z.string().url().max(2000),
});

export type CreateCountryInput = z.infer<typeof createCountrySchema>;

export const updateCountrySchema = createCountrySchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one field must be provided" },
);

export type UpdateCountryInput = z.infer<typeof updateCountrySchema>;

export const countryIdSchema = z.string().uuid();
