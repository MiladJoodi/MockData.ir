import { z } from "zod";

export const photoListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().trim().optional(),
  albumId: z.coerce.number().int().min(1).optional(),
  sort: z.enum(["createdAt", "title", "albumId"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  delay: z.coerce.number().int().min(0).max(5000).optional(),
  status: z.coerce.number().int().min(400).max(599).optional(),
});

export type PhotoListQuery = z.infer<typeof photoListQuerySchema>;

export const createPhotoSchema = z.object({
  albumId: z.number().int().min(1).max(100),
  title: z.string().trim().min(1).max(200),
  url: z.string().url().max(2000),
  thumbnailUrl: z.string().url().max(2000),
});

export type CreatePhotoInput = z.infer<typeof createPhotoSchema>;

export const updatePhotoSchema = createPhotoSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one field must be provided" },
);

export type UpdatePhotoInput = z.infer<typeof updatePhotoSchema>;

export const photoIdSchema = z.string().uuid();
