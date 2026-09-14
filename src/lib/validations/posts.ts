import { z } from "zod";

export const postListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().trim().optional(),
  userId: z.string().uuid().optional(),
  published: z
    .enum(["true", "false"])
    .optional()
    .transform((value) =>
      value === undefined ? undefined : value === "true",
    ),
  sort: z.enum(["createdAt", "title"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  delay: z.coerce.number().int().min(0).max(5000).optional(),
  status: z.coerce.number().int().min(400).max(599).optional(),
});

export type PostListQuery = z.infer<typeof postListQuerySchema>;

export const createPostSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(10000),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  published: z.boolean().default(true),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const updatePostSchema = createPostSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one field must be provided" },
);

export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export const postIdSchema = z.string().uuid();
