import { parse as parseYaml } from "yaml";
import { z } from "zod";

import { BLOG_CATEGORIES } from "@/lib/blog/categories";
import { BlogContentError } from "@/lib/blog/errors";
import type { BlogFrontmatter } from "@/lib/blog/types";

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD")
  .refine((value) => {
    const [y, m, d] = value.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return (
      dt.getUTCFullYear() === y &&
      dt.getUTCMonth() === m - 1 &&
      dt.getUTCDate() === d
    );
  }, "date must be a valid calendar day");

export const blogFrontmatterSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  category: z.enum(BLOG_CATEGORIES),
  date: dateStringSchema,
  published: z.boolean(),
});

export type ParsedBlogMdx = {
  frontmatter: BlogFrontmatter;
  body: string;
};

/**
 * Split `---` YAML frontmatter from MDX body and validate with Zod.
 */
export function parseBlogMdxSource(
  source: string,
  context: { postId: string; locale: string; filePath: string },
): ParsedBlogMdx {
  const trimmed = source.replace(/^\uFEFF/, "");
  const match = trimmed.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new BlogContentError(
      `Missing or invalid YAML frontmatter in ${context.filePath}`,
      context,
    );
  }

  const [, yamlBlock, body] = match;

  let raw: unknown;
  try {
    raw = parseYaml(yamlBlock);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown YAML error";
    throw new BlogContentError(
      `Invalid YAML frontmatter in ${context.filePath}: ${detail}`,
      context,
    );
  }

  const parsed = blogFrontmatterSchema.safeParse(raw);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("; ");
    throw new BlogContentError(
      `Invalid frontmatter in ${context.filePath}: ${details}`,
      context,
    );
  }

  if (parsed.data.id !== context.postId) {
    throw new BlogContentError(
      `Frontmatter id "${parsed.data.id}" does not match folder name "${context.postId}" (${context.filePath})`,
      context,
    );
  }

  return {
    frontmatter: parsed.data,
    body: body.replace(/^\r?\n/, ""),
  };
}
