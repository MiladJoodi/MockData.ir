import { z } from "zod";

export const contactTopics = [
  "question",
  "bug",
  "feature",
  "other",
] as const;

export const contactTopicLabels: Record<(typeof contactTopics)[number], string> =
  {
    question: "I have a question",
    bug: "I found a bug",
    feature: "Feature idea",
    other: "Something else",
  };

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  topic: z.enum(contactTopics),
  message: z.string().trim().min(10).max(5000),
});

export type ContactInput = z.infer<typeof contactSchema>;
