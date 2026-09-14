import { z } from "zod";
import { userRoles } from "@/db/schema/users";

export const userRoleSchema = z.enum(userRoles);

export const userListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().trim().optional(),
  role: userRoleSchema.optional(),
  country: z.string().trim().optional(),
  sort: z.enum(["createdAt", "name", "username"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  delay: z.coerce.number().int().min(0).max(5000).optional(),
  status: z.coerce.number().int().min(400).max(599).optional(),
});

export type UserListQuery = z.infer<typeof userListQuerySchema>;

export const createUserSchema = z.object({
  name: z.string().trim().min(1).max(200),
  username: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z0-9._-]+$/, "Username may only contain letters, numbers, ., _, -"),
  email: z.string().trim().email().max(255),
  avatarUrl: z.string().url().max(2000),
  phone: z.string().trim().max(40).nullable().optional(),
  company: z.string().trim().max(120).nullable().optional(),
  role: userRoleSchema.default("member"),
  city: z.string().trim().min(1).max(100),
  country: z.string().trim().min(1).max(100),
  bio: z.string().trim().max(1000).nullable().optional(),
  website: z.string().url().max(500).nullable().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one field must be provided" },
);

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const userIdSchema = z.string().uuid();
