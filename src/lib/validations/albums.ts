import { z } from "zod";

export const albumListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().trim().optional(),
  userId: z.string().uuid().optional(),
  sort: z.enum(["createdAt", "title", "id"]).default("id"),
  order: z.enum(["asc", "desc"]).default("asc"),
  delay: z.coerce.number().int().min(0).max(5000).optional(),
  status: z.coerce.number().int().min(400).max(599).optional(),
});

export type AlbumListQuery = z.infer<typeof albumListQuerySchema>;

export const createAlbumSchema = z.object({
  id: z.number().int().min(1).max(10000).optional(),
  userId: z.string().uuid(),
  title: z.string().trim().min(1).max(200),
});

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;

export const updateAlbumSchema = z
  .object({
    userId: z.string().uuid().optional(),
    title: z.string().trim().min(1).max(200).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateAlbumInput = z.infer<typeof updateAlbumSchema>;

export const albumIdSchema = z.coerce.number().int().min(1);
