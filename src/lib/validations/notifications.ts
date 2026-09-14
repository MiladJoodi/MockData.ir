import { z } from "zod";

const notificationTypeSchema = z.enum(["info", "success", "warning", "error"]);

export const notificationListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().trim().optional(),
  userId: z.string().uuid().optional(),
  type: notificationTypeSchema.optional(),
  read: z
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

export type NotificationListQuery = z.infer<typeof notificationListQuerySchema>;

export const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(2000),
  type: notificationTypeSchema.default("info"),
  read: z.boolean().default(false),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;

export const updateNotificationSchema = createNotificationSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;

export const notificationIdSchema = z.string().uuid();
